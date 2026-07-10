import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3015;
const HOST = `http://localhost:${PORT}`;

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
}, 30000);

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

  await page.goto(`${HOST}${pathname}`, { waitUntil: "networkidle2", timeout: 30000 });

  return { browser, page, errors };
}

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      const selectedSpriteThumb = document.querySelector("#spritecc .spritethumb[aria-pressed=\"true\"]");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && document.getElementById("addsprite")
          && document.getElementById("martyMode")
          && selectedSpriteThumb
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout: 30000 }
  );
}

async function getEditorState(page) {
  return page.evaluate(() => {
    const currentPage = window.ScratchJr.stage.currentPage;
    const spriteIds = currentPage.getSprites();
    const normalSpriteIds = spriteIds.filter(
      (spriteId) => spriteId.indexOf(window.ScratchJr.BIRDS_EYE_SPRITE_NAME) === -1
    );
    const currentSpriteName = currentPage.currentSpriteName || "";
    const addSpriteButton = document.getElementById("addsprite");

    return {
      currentSpriteName,
      spriteIds,
      normalSpriteIds,
      isMartyModeEnabled: window.ScratchJr.isMartyModeEnabled,
      activeSpriteIsMartyBirdsEye:
        currentSpriteName.indexOf(window.ScratchJr.BIRDS_EYE_SPRITE_NAME) > -1,
      hasMartyModeSidebarCard: Boolean(document.getElementById("martyModeSidebarCard")),
      addSpriteButtonVisible:
        Boolean(addSpriteButton) && window.getComputedStyle(addSpriteButton).display !== "none",
      addSpriteButtonDisabled: Boolean(addSpriteButton && addSpriteButton.disabled),
    };
  });
}

async function deleteSelectedSpriteWithKeyboard(page) {
  await page.focus("#spritecc .spritethumb[aria-pressed=\"true\"]");
  await page.keyboard.press("Delete");
  await page.waitForFunction(
    () => {
      const currentPage = window.ScratchJr.stage.currentPage;
      return currentPage.getSprites().filter(
        (spriteId) => spriteId.indexOf(window.ScratchJr.BIRDS_EYE_SPRITE_NAME) === -1
      ).length === 0;
    },
    { timeout: 30000 }
  );
}

describe("deleting the final sprite", () => {
  it(
    "keeps the editor in Sprite mode when no normal sprites remain",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await waitForEditorReady(page);

        const beforeDelete = await getEditorState(page);
        expect(beforeDelete).toMatchObject({
          normalSpriteIds: [beforeDelete.currentSpriteName],
          isMartyModeEnabled: false,
          activeSpriteIsMartyBirdsEye: false,
          hasMartyModeSidebarCard: false,
          addSpriteButtonVisible: true,
          addSpriteButtonDisabled: false,
        });

        await deleteSelectedSpriteWithKeyboard(page);

        const afterDelete = await getEditorState(page);
        expect(
          afterDelete,
          `Editor state after deleting the last normal sprite: ${JSON.stringify(afterDelete, null, 2)}`
        ).toMatchObject({
          normalSpriteIds: [],
          isMartyModeEnabled: false,
          activeSpriteIsMartyBirdsEye: false,
          hasMartyModeSidebarCard: false,
          addSpriteButtonVisible: true,
          addSpriteButtonDisabled: false,
        });
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    90000
  );
});
