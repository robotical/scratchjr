import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3015;
const HOST = `http://localhost:${PORT}`;
const BLOCK_TYPE = "back";

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
      errors.push(msg.text());
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

async function saveProjectWithTimeout(page, timeoutMs = 4_000) {
  return page.evaluate((timeout) => new Promise((resolve) => {
    let settled = false;
    window.ScratchJr.changed = true;
    window.ScratchJr.saveProject(null, () => {
      if (!settled) {
        settled = true;
        resolve(true);
      }
    });
    window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, timeout);
  }), timeoutMs);
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
  it.fails(
    "recovers local save/autosave after one interrupted thumbnail save",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=home");

      try {
        const projectId = await createProjectFromHome(page);
        await insertMotionBlock(page);

        await interruptNextThumbnailSave(page);
        const interruptedSaveCompleted = await saveProjectWithTimeout(page, 1_500);
        expect(interruptedSaveCompleted).toBe(false);

        await restoreThumbnailSave(page);
        const recoveredSaveCompleted = await saveProjectWithTimeout(page, 4_000);

        expect(recoveredSaveCompleted).toBe(true);
        await waitForPersistedProject(page, projectId, (project) => projectHasBlock(project, BLOCK_TYPE));
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );
});
