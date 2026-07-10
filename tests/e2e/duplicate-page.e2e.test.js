import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3015;
const HOST = `http://localhost:${PORT}`;
const BACKGROUND_MD5 = "Beach.svg";
const SCRIPT_BLOCK_TYPE = "forward";

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

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && document.getElementById("pagecc")
          && document.getElementById("sprite-motion")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout: 30_000 }
  );
}

async function prepareSourcePage(page) {
  await page.evaluate((backgroundMd5) => new Promise((resolve) => {
    const currentPage = window.ScratchJr.stage.currentPage;
    currentPage.setBackground(backgroundMd5, () => {
      currentPage.updateThumb();
      resolve();
    });
  }), BACKGROUND_MD5);

  await page.click("#sprite-motion");
  await page.waitForFunction(
    (blockType) => Boolean(document.querySelector(`#palette [data-blocktype="${blockType}"]`)),
    { timeout: 30_000 },
    SCRIPT_BLOCK_TYPE
  );

  await page.evaluate((blockType) => {
    const blockElement = document.querySelector(`#palette [data-blocktype="${blockType}"]`);
    window.Palette.insertBlockFromKeyboard(blockElement, new Event("duplicate-page-e2e"));
  }, SCRIPT_BLOCK_TYPE);

  await page.waitForFunction(
    (blockType) => window.ScratchJr.getBlocks().some((block) => block.blocktype === blockType),
    { timeout: 30_000 },
    SCRIPT_BLOCK_TYPE
  );
}

async function activateDuplicatePageAction(page) {
  const result = await page.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll("#pages button, #pages [role=\"button\"], #pages [aria-label]")
    );
    const action = candidates.find((element) => {
      const label = [
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.textContent,
      ].filter(Boolean).join(" ");
      return /(duplicate|copy)/i.test(label) && /(page|scene)/i.test(label);
    });

    if (!action) {
      return {
        activated: false,
        pageActions: candidates.map((element) => ({
          id: element.id || null,
          className: element.className || null,
          label: element.getAttribute("aria-label") || element.getAttribute("title") || element.textContent || "",
        })),
      };
    }

    if (action.disabled || action.getAttribute("aria-disabled") === "true") {
      return { activated: false, disabled: true };
    }

    action.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }));
    return { activated: true };
  });

  if (!result.activated) {
    throw new Error(`No enabled accessible duplicate-page action found in the page strip: ${JSON.stringify(result)}`);
  }
}

function pageHasBlock(pageData, blockType) {
  return Boolean(pageData && Array.isArray(pageData.sprites) && pageData.sprites.some((spriteId) => {
    const sprite = pageData[spriteId];
    return sprite && Array.isArray(sprite.scripts) && sprite.scripts.some((strip) => {
      return Array.isArray(strip) && strip.some((block) => Array.isArray(block) && block[0] === blockType);
    });
  }));
}

async function waitForPageDuplication(page, beforeCount) {
  await page.waitForFunction(
    (count) => window.ScratchJr.stage.pages.length === count + 1
      && !window.ScratchJr.stage.duplicatingPage,
    { timeout: 30_000 },
    beforeCount
  );
}

describe("duplicate page", () => {
  it(
    "duplicates the current page with its scripts and background from the page strip",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await waitForEditorReady(page);
        await prepareSourcePage(page);

        const sourceState = await page.evaluate(() => {
          const sourcePage = window.ScratchJr.stage.currentPage;
          return {
            pageId: sourcePage.id,
            pageData: sourcePage.encodePage(),
            pageCount: window.ScratchJr.stage.pages.length,
          };
        });
        expect(sourceState.pageData.md5).toBe(BACKGROUND_MD5);
        expect(pageHasBlock(sourceState.pageData, SCRIPT_BLOCK_TYPE)).toBe(true);

        await activateDuplicatePageAction(page);

        await page.waitForFunction(
          (beforeCount, sourcePageId) => window.ScratchJr.stage.pages.length === beforeCount + 1
            && !window.ScratchJr.stage.duplicatingPage
            && window.ScratchJr.stage.currentPage.id !== sourcePageId,
          { timeout: 30_000 },
          sourceState.pageCount,
          sourceState.pageId
        );

        const duplicatedState = await page.evaluate((sourcePageId) => {
          const sourceIndex = window.ScratchJr.stage.pages.findIndex((stagePage) => stagePage.id === sourcePageId);
          const duplicatePage = window.ScratchJr.stage.pages[sourceIndex + 1];
          return {
            duplicatePageId: duplicatePage ? duplicatePage.id : null,
            duplicatePageData: duplicatePage ? duplicatePage.encodePage() : null,
            pageIds: window.ScratchJr.stage.getPagesID(),
          };
        }, sourceState.pageId);

        expect(duplicatedState.duplicatePageId).not.toBe(sourceState.pageId);
        expect(duplicatedState.duplicatePageData.md5).toBe(BACKGROUND_MD5);
        expect(pageHasBlock(duplicatedState.duplicatePageData, SCRIPT_BLOCK_TYPE)).toBe(true);
        expect(duplicatedState.duplicatePageData.sprites).not.toEqual(sourceState.pageData.sprites);
        expect(duplicatedState.pageIds).toHaveLength(sourceState.pageCount + 1);
        expect(errors).toEqual([]);

        await page.click("#id_undo");
        await page.waitForFunction(
          (duplicatePageId, beforeCount) => !document.getElementById(duplicatePageId)
            && window.ScratchJr.stage.pages.length === beforeCount,
          { timeout: 30_000 },
          duplicatedState.duplicatePageId,
          sourceState.pageCount
        );

        await page.click("#id_redo");
        await page.waitForFunction(
          (duplicatePageId, beforeCount) => document.getElementById(duplicatePageId)
            && window.ScratchJr.stage.pages.length === beforeCount + 1,
          { timeout: 30_000 },
          duplicatedState.duplicatePageId,
          sourceState.pageCount
        );
        const redonePageData = await page.evaluate((duplicatePageId) => {
          return document.getElementById(duplicatePageId).owner.encodePage();
        }, duplicatedState.duplicatePageId);
        expect(redonePageData.md5).toBe(BACKGROUND_MD5);
        expect(pageHasBlock(redonePageData, SCRIPT_BLOCK_TYPE)).toBe(true);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "respects the four-page project limit",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await waitForEditorReady(page);
        for (let pageCount = 1; pageCount < 4; pageCount += 1) {
          await activateDuplicatePageAction(page);
          await waitForPageDuplication(page, pageCount);
        }

        const limitState = await page.evaluate(() => {
          const duplicateButton = document.getElementById("duplicatepage");
          return {
            pageCount: window.ScratchJr.stage.pages.length,
            disabled: duplicateButton.disabled,
            ariaDisabled: duplicateButton.getAttribute("aria-disabled"),
            canDuplicate: window.ScratchJr.stage.canDuplicatePage(window.ScratchJr.stage.currentPage.id),
          };
        });
        expect(limitState).toEqual({
          pageCount: 4,
          disabled: true,
          ariaDisabled: "true",
          canDuplicate: false,
        });
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
