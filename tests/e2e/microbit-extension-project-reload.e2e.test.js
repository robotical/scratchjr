import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3013;
const HOST = `http://localhost:${PORT}`;
const MICROBIT_BLOCK_TYPE = "microbitdisplayclear";

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
  expect(page.url()).toContain("/editor.html");
  expect(page.url()).toContain("mode=edit");
  await waitForEditorReady(page);
  return page.evaluate(() => window.ScratchJr.currentProject);
}

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && document.getElementById("addExtensionButton")
          && document.getElementById("martyMode")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout: 30_000 }
  );
}

async function waitForProjectStateLoaded(page) {
  await page.waitForFunction(
    () => Boolean(
      window.ScratchJr
        && window.ScratchJr.stage
        && window.ScratchJr.stage.currentPage
        && window.ScratchJr.getActiveScript()
        && document.querySelector("#selectorsright .category-selector-button")
    ),
    { timeout: 30_000 }
  );
}

async function enableMartyMode(page) {
  const alreadyEnabled = await page.evaluate(() => window.ScratchJr.isMartyModeEnabled);
  if (!alreadyEnabled) {
    await page.click("#martyMode");
  }
  await page.waitForFunction(
    () => window.ScratchJr.isMartyModeEnabled
      && window.ScratchJr.stage.currentPage.currentSpriteName
      && window.ScratchJr.stage.currentPage.currentSpriteName.indexOf(window.ScratchJr.BIRDS_EYE_SPRITE_NAME) > -1
      && window.ScratchJr.getActiveScript(),
    { timeout: 30_000 }
  );
}

async function enableMicroBitExtension(page) {
  await page.click("#addExtensionButton");
  await page.waitForSelector("#extensionsLibrary.fade.in", { timeout: 30_000 });
  await page.click("#microBitExtensionCard");
  await page.waitForFunction(
    () => {
      const microBitButton = document.getElementById("microBitConnectionButton");
      const library = document.getElementById("extensionsLibrary");
      return window.ScratchJr.isMicroBitExtensionEnabled
        && microBitButton
        && window.getComputedStyle(microBitButton).display !== "none"
        && document.querySelector("#selectorsright #microbit-start")
        && document.querySelector("#selectorsright #microbit-looks")
        && library
        && !library.classList.contains("in");
    },
    { timeout: 30_000 }
  );
}

async function insertMicroBitBlock(page) {
  await page.click("#microbit-looks");
  await page.waitForFunction(
    (blockType) => Boolean(document.querySelector(`#palette [data-blocktype="${blockType}"]`)),
    { timeout: 30_000 },
    MICROBIT_BLOCK_TYPE
  );

  await page.evaluate((blockType) => {
    const blockElement = document.querySelector(`#palette [data-blocktype="${blockType}"]`);
    window.Palette.insertBlockFromKeyboard(blockElement, new Event("microbit-reload-test"));
  }, MICROBIT_BLOCK_TYPE);

  await page.waitForFunction(
    (blockType) => window.ScratchJr.getBlocks().some((block) => block.blocktype === blockType),
    { timeout: 30_000 },
    MICROBIT_BLOCK_TYPE
  );
}

async function saveProjectAndWaitForBlock(page, projectId) {
  await page.evaluate(() => new Promise((resolve) => {
    window.ScratchJr.changed = true;
    window.ScratchJr.saveProject(null, resolve);
  }));

  await waitForPersistedProject(page, projectId, (project) => projectHasBlock(project, MICROBIT_BLOCK_TYPE));
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

async function hardReload(page) {
  const client = await page.target().createCDPSession();
  await client.send("Network.enable");
  await client.send("Network.setCacheDisabled", { cacheDisabled: true });
  try {
    await page.reload({ waitUntil: "networkidle2", timeout: 30_000 });
  } finally {
    await client.send("Network.setCacheDisabled", { cacheDisabled: false });
    await client.detach();
  }
}

async function getLoadedProjectState(page) {
  return page.evaluate((blockType) => {
    const activeBlocks = window.ScratchJr.getBlocks().map((block) => block.blocktype);
    const currentSpriteName = window.ScratchJr.stage.currentPage.currentSpriteName || "";
    return {
      currentProject: window.ScratchJr.currentProject,
      isMartyModeEnabled: window.ScratchJr.isMartyModeEnabled,
      isMicroBitExtensionEnabled: window.ScratchJr.isMicroBitExtensionEnabled,
      activeSpriteIsMartyBirdsEye: currentSpriteName.indexOf(window.ScratchJr.BIRDS_EYE_SPRITE_NAME) > -1,
      activeBlocks,
      hasMicroBitBlockInActiveScript: activeBlocks.indexOf(blockType) > -1,
      rightCategoryIds: Array.from(document.querySelectorAll("#selectorsright .category-selector-button")).map(
        (button) => button.id
      ),
      microBitButtonVisible:
        window.getComputedStyle(document.getElementById("microBitConnectionButton")).display !== "none",
      extensionEnabledClass: document.getElementById("connectionButtonsArea").classList.contains("extensionEnabled"),
    };
  }, MICROBIT_BLOCK_TYPE);
}

function expectLoadedMicroBitMartyProjectStates(states, projectId) {
  const expectedState = {
    currentProject: projectId,
    isMartyModeEnabled: true,
    activeSpriteIsMartyBirdsEye: true,
    isMicroBitExtensionEnabled: true,
    microBitButtonVisible: true,
    extensionEnabledClass: true,
    hasMicroBitBlockInActiveScript: true,
    rightCategoryIds: ["cog-start", "cog-looks", "cog-sound", "microbit-start", "microbit-looks"],
  };
  expect(states).toMatchObject({
    beforeReload: expectedState,
    afterPlainReload: expectedState,
    afterHardReload: expectedState,
  });
}

describe("micro:bit extension project reload", () => {
  it(
    "keeps the saved micro:bit extension, active Marty mode, and block after plain and hard refreshes",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=home");

      try {
        const projectId = await createProjectFromHome(page);

        await enableMartyMode(page);
        await enableMicroBitExtension(page);
        await insertMicroBitBlock(page);
        await saveProjectAndWaitForBlock(page, projectId);

        const beforeReload = await getLoadedProjectState(page);
        await page.reload({ waitUntil: "networkidle2", timeout: 30_000 });
        await waitForEditorReady(page);
        const afterPlainReload = await getLoadedProjectState(page);

        await hardReload(page);
        await waitForProjectStateLoaded(page);
        const afterHardReload = await getLoadedProjectState(page);

        expectLoadedMicroBitMartyProjectStates({
          beforeReload,
          afterPlainReload,
          afterHardReload,
        }, projectId);

        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );
});
