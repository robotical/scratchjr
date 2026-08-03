import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3015;
const HOST = `http://localhost:${PORT}`;
const BLOCK_TYPE = "back";
const FOLLOW_UP_BLOCK_TYPE = "forward";

let server;

async function waitForServer(maxAttempts = 20) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const ok = await new Promise((resolve) => {
      const req = http.get(`${HOST}/`, (res) => {
        res.destroy();
        resolve(true);
      });
      req.on("error", () => resolve(false));
    });
    if (ok) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Local server did not start in time");
}

beforeAll(async () => {
  server = spawn("python3", ["-m", "http.server", `${PORT}`, "--directory", "editions/free/src"], {
    stdio: "ignore",
  });
  await waitForServer();
}, 30_000);

afterAll(() => {
  if (server) {
    server.kill();
  }
});

async function openPage(pathname) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [];

  page.on("pageerror", (err) => errors.push(err.message || String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const location = msg.location();
      errors.push(location.url ? `${msg.text()} (${location.url})` : msg.text());
    }
  });

  await page.goto(`${HOST}${pathname}`, { waitUntil: "networkidle2", timeout: 30_000 });

  return { browser, page, errors };
}

async function createProjectFromHome(page) {
  await page.waitForSelector("#newproject .card-action-open", { timeout: 30_000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
    page.click("#newproject .card-action-open"),
  ]);
  await waitForEditorReady(page);
  return page.evaluate(() => window.ScratchJr.currentProject);
}

async function waitForEditorReady(page, timeout = 30_000) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && document.getElementById("sprite-motion")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout }
  );
}

async function insertMotionBlock(page, blockType = BLOCK_TYPE) {
  await page.click("#sprite-motion");
  await page.waitForFunction(
    (type) => Boolean(document.querySelector(`#palette [data-blocktype="${type}"]`)),
    { timeout: 30_000 },
    blockType
  );

  await page.evaluate((type) => {
    const blockElement = document.querySelector(`#palette [data-blocktype="${type}"]`);
    window.Palette.insertBlockFromKeyboard(blockElement, new Event("project-save-stall-test"));
  }, blockType);

  await page.waitForFunction(
    (type) => window.ScratchJr.getBlocks().some((block) => block.blocktype === type),
    { timeout: 30_000 },
    blockType
  );
}

async function insertVisibleMotionBlock(page, blockType) {
  await page.evaluate((type) => {
    const blockElement = document.querySelector(`#palette [data-blocktype="${type}"]`);
    window.Palette.insertBlockFromKeyboard(blockElement, new Event("project-save-stall-follow-up"));
  }, blockType);

  await page.waitForFunction(
    (type) => window.ScratchJr.getBlocks().some((block) => block.blocktype === type),
    { timeout: 30_000 },
    blockType
  );
}

async function interruptNextThumbnailSave(page) {
  await page.evaluate(() => {
    const originalSetMediaName = window.OS.setmedianame;
    window.__projectSaveStallTest = {
      droppedThumbnailSave: false,
      restore() {
        window.OS.setmedianame = originalSetMediaName;
      },
    };
    window.OS.setmedianame = function (str, name, ext, callback) {
      if (!window.__projectSaveStallTest.droppedThumbnailSave && ext === "png") {
        window.__projectSaveStallTest.droppedThumbnailSave = true;
        return undefined;
      }
      return originalSetMediaName.call(this, str, name, ext, callback);
    };
  });
}

async function restoreThumbnailSave(page) {
  await page.evaluate(() => {
    if (window.__projectSaveStallTest) {
      window.__projectSaveStallTest.restore();
    }
  });
}

async function startRapidAutosave(page, intervalMs = 100) {
  await page.evaluate((interval) => {
    window.ScratchJr.onPause();
    window.Settings.autoSaveInterval = interval;

    const originalSaveProject = window.ScratchJr.saveProject;
    window.__projectAutosaveGuardTest = {
      attempts: 0,
      originalSaveProject,
    };
    window.ScratchJr.saveProject = function (...args) {
      window.__projectAutosaveGuardTest.attempts += 1;
      return originalSaveProject.apply(this, args);
    };

    window.ScratchJr.onResume();
  }, intervalMs);
}

async function stopRapidAutosave(page) {
  await page.evaluate(() => {
    window.ScratchJr.onPause();
    if (window.__projectAutosaveGuardTest) {
      window.ScratchJr.saveProject = window.__projectAutosaveGuardTest.originalSaveProject;
    }
  });
}

async function installCloudFetchStub(page) {
  await page.evaluate(() => {
    const firebaseOrigin = "https://blocksjr-projects-default-rtdb.firebaseio.com/";
    const originalFetch = window.fetch.bind(window);
    window.__projectCloudSaveTest = {
      requests: [],
    };

    window.fetch = async function (input, options = {}) {
      const url = typeof input === "string" ? input : input.url;
      if (!url.startsWith(firebaseOrigin)) {
        return originalFetch(input, options);
      }

      const method = (options.method || "GET").toUpperCase();
      window.__projectCloudSaveTest.requests.push({ method, url });
      const body = method === "POST" ? { name: "e2e-cloud-save" } : {};
      return {
        ok: true,
        status: 200,
        json: async () => body,
      };
    };
  });
}

async function waitForCloudPost(page, timeoutMs = 15_000) {
  try {
    await page.waitForFunction(
      () => window.__projectCloudSaveTest.requests.some((request) => request.method === "POST"),
      { timeout: timeoutMs }
    );
    return true;
  } catch (err) {
    if (err && err.name === "TimeoutError") {
      return false;
    }
    throw err;
  }
}

async function startTrackedSave(page, label) {
  await page.evaluate((saveLabel) => {
    window.__projectSaveCallbacks = window.__projectSaveCallbacks || [];
    window.ScratchJr.changed = true;
    window.ScratchJr.saveProject(null, (persisted) => {
      window.__projectSaveCallbacks.push({ label: saveLabel, persisted });
    });
  }, label);
}

async function waitForTrackedSaveCount(page, count, timeoutMs = 12_000) {
  try {
    await page.waitForFunction(
      (expectedCount) => window.__projectSaveCallbacks.length >= expectedCount,
      { timeout: timeoutMs },
      count
    );
    return true;
  } catch (err) {
    if (err && err.name === "TimeoutError") {
      return false;
    }
    throw err;
  }
}

async function waitForPersistedProject(page, projectId, predicate) {
  const startedAt = Date.now();
  let lastProject = null;

  while (Date.now() - startedAt < 15_000) {
    lastProject = await readPersistedProject(page, projectId);
    if (lastProject && predicate(lastProject)) {
      return lastProject;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for saved project state. Last project: ${JSON.stringify(lastProject)}`);
}

async function readPersistedProject(page, projectId) {
  return page.evaluate((id) => new Promise((resolve) => {
    window.OS.query(
      { stmt: "select * from projects where id = ?", values: [Number(id)] },
      (result) => {
        const rows = JSON.parse(result);
        if (!rows.length) {
          resolve(null);
          return;
        }
        const row = Object.fromEntries(Object.entries(rows[0]).map(([key, value]) => [key.toLowerCase(), value]));
        resolve(typeof row.json === "string" ? JSON.parse(row.json) : row.json);
      }
    );
  }), projectId);
}

function projectHasBlock(project, blockType) {
  if (!project || !Array.isArray(project.pages)) {
    return false;
  }
  return project.pages.some((pageId) => {
    const page = project[pageId];
    return page && Array.isArray(page.sprites) && page.sprites.some((spriteId) => {
      const sprite = page[spriteId];
      return sprite && Array.isArray(sprite.scripts) && sprite.scripts.some((strip) => {
        return Array.isArray(strip) && strip.some((block) => Array.isArray(block) && block[0] === blockType);
      });
    });
  });
}

describe("project save stall reproduction", () => {
  it(
    "coalesces a follow-up save and preserves edits made during an interrupted thumbnail callback",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=home");

      try {
        const projectId = await createProjectFromHome(page);
        await insertMotionBlock(page);

        await interruptNextThumbnailSave(page);
        await startTrackedSave(page, "interrupted");
        await page.waitForFunction(
          () => window.__projectSaveStallTest.droppedThumbnailSave,
          { timeout: 5_000 }
        );
        await insertVisibleMotionBlock(page, FOLLOW_UP_BLOCK_TYPE);
        await restoreThumbnailSave(page);
        await startTrackedSave(page, "coalesced");

        const savesCompleted = await waitForTrackedSaveCount(page, 2);
        expect(savesCompleted).toBe(true);
        expect(await page.evaluate(() => window.__projectSaveCallbacks)).toEqual([
          { label: "interrupted", persisted: true },
          { label: "coalesced", persisted: true },
        ]);
        await waitForPersistedProject(
          page,
          projectId,
          (project) => projectHasBlock(project, BLOCK_TYPE) && projectHasBlock(project, FOLLOW_UP_BLOCK_TYPE)
        );
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );

  it(
    "does not queue repeated autosaves while the real project save is busy",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=home");

      try {
        await createProjectFromHome(page);
        await insertMotionBlock(page);
        await interruptNextThumbnailSave(page);
        await startRapidAutosave(page);

        await page.waitForFunction(
          () => window.__projectSaveStallTest.droppedThumbnailSave,
          { timeout: 5_000 }
        );
        await new Promise((resolve) => setTimeout(resolve, 450));

        const autosaveAttempts = await page.evaluate(
          () => window.__projectAutosaveGuardTest.attempts
        );
        expect(autosaveAttempts).toBe(1);
        expect(errors).toEqual([]);
      } finally {
        await stopRapidAutosave(page);
        await browser.close();
      }
    },
    120_000
  );

  it(
    "lets Save to Cloud reach the cloud callback after an interrupted local save",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=home");

      try {
        await createProjectFromHome(page);
        await insertMotionBlock(page);
        await installCloudFetchStub(page);

        await interruptNextThumbnailSave(page);
        await startTrackedSave(page, "interrupted");
        await page.waitForFunction(
          () => window.__projectSaveStallTest.droppedThumbnailSave,
          { timeout: 5_000 }
        );
        await restoreThumbnailSave(page);

        await page.evaluate(() => {
          document.getElementById("projectinfo").click();
          document.getElementById("cloudToggleSave").click();
          document.getElementById("infoboxCloudSave").click();
        });

        const cloudPostReached = await waitForCloudPost(page);
        expect(cloudPostReached).toBe(true);
        expect(await page.evaluate(() => window.__projectSaveCallbacks)).toEqual([
          { label: "interrupted", persisted: true },
        ]);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );

  it(
    "does not report a cloud save when the local project row fails to persist",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=home");

      try {
        await createProjectFromHome(page);
        await insertMotionBlock(page);
        await installCloudFetchStub(page);
        await page.evaluate(() => {
          const originalStmt = window.OS.stmt;
          window.__projectRowFailureTest = {
            failed: false,
            restore() {
              window.OS.stmt = originalStmt;
            },
          };
          window.OS.stmt = function (json, callback) {
            if (!window.__projectRowFailureTest.failed
                && /^update projects set version = /i.test(json.stmt)) {
              window.__projectRowFailureTest.failed = true;
              if (callback) {
                callback(null);
              }
              return;
            }
            return originalStmt.call(this, json, callback);
          };
        });

        await page.evaluate(() => {
          document.getElementById("projectinfo").click();
          document.getElementById("cloudToggleSave").click();
          document.getElementById("infoboxCloudSave").click();
        });
        await page.waitForFunction(
          () => window.__projectRowFailureTest.failed,
          { timeout: 15_000 }
        );

        expect(await waitForCloudPost(page, 5_000)).toBe(false);
        expect(await page.evaluate(() => window.__projectRowFailureTest.failed)).toBe(true);
        expect(errors).toEqual([]);
      } finally {
        await page.evaluate(() => {
          if (window.__projectRowFailureTest) {
            window.__projectRowFailureTest.restore();
          }
        }).catch(() => {});
        await browser.close();
      }
    },
    120_000
  );
});
