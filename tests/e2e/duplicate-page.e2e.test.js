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

async function activateDuplicatePageAction(page, requestedPageId) {
  const result = await page.evaluate((pageId) => {
    const targetPageId = pageId || window.ScratchJr.stage.currentPage.id;
    const action = document.querySelector(`#pageactions .duplicatepage[data-owner="${targetPageId}"]`);

    if (!action) {
      return {
        activated: false,
        pageActions: Array.from(document.querySelectorAll("#pageactions .duplicatepage")).map((element) => ({
          id: element.id || null,
          owner: element.getAttribute("data-owner"),
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
  }, requestedPageId);

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

        const pageActionState = await page.evaluate((sourcePageId) => {
          const action = document.querySelector(`#pageactions .duplicatepage[data-owner="${sourcePageId}"]`);
          return {
            actionCount: document.querySelectorAll("#pageactions .duplicatepage").length,
            isNestedInPageThumb: Boolean(action && action.closest(".pagethumb")),
            label: action && action.getAttribute("aria-label"),
          };
        }, sourceState.pageId);
        expect(pageActionState).toEqual({
          actionCount: sourceState.pageCount,
          isNestedInPageThumb: false,
          label: "Duplicate page 1",
        });

        await activateDuplicatePageAction(page, sourceState.pageId);

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
          const duplicateButtons = Array.from(document.querySelectorAll("#pageactions .duplicatepage"));
          return {
            pageCount: window.ScratchJr.stage.pages.length,
            buttonCount: duplicateButtons.length,
            disabled: duplicateButtons.every((button) => button.disabled),
            ariaDisabled: duplicateButtons.every((button) => button.getAttribute("aria-disabled") === "true"),
            canDuplicate: window.ScratchJr.stage.canDuplicatePage(window.ScratchJr.stage.currentPage.id),
          };
        });
        expect(limitState).toEqual({
          pageCount: 4,
          buttonCount: 4,
          disabled: true,
          ariaDisabled: true,
          canDuplicate: false,
        });
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "duplicates the page attached to the clicked action when another page is selected",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await waitForEditorReady(page);
        await prepareSourcePage(page);

        const sourcePageId = await page.evaluate(() => window.ScratchJr.stage.currentPage.id);
        await activateDuplicatePageAction(page, sourcePageId);
        await waitForPageDuplication(page, 1);

        const selectedPageId = await page.evaluate(() => new Promise((resolve) => {
          const selectedPage = window.ScratchJr.stage.currentPage;
          selectedPage.setBackground("none", () => {
            selectedPage.updateThumb();
            resolve(selectedPage.id);
          });
        }));

        await activateDuplicatePageAction(page, sourcePageId);
        await waitForPageDuplication(page, 2);

        const targetedState = await page.evaluate(({ sourceId, previousSelectedId }) => {
          const sourceIndex = window.ScratchJr.stage.pages.findIndex((stagePage) => stagePage.id === sourceId);
          const targetedDuplicate = window.ScratchJr.stage.pages[sourceIndex + 1];
          const previousSelectedIndex = window.ScratchJr.stage.pages.findIndex(
            (stagePage) => stagePage.id === previousSelectedId
          );
          return {
            currentPageId: window.ScratchJr.stage.currentPage.id,
            targetedDuplicateId: targetedDuplicate.id,
            targetedDuplicateData: targetedDuplicate.encodePage(),
            previousSelectedIndex,
          };
        }, { sourceId: sourcePageId, previousSelectedId: selectedPageId });

        expect(targetedState.currentPageId).toBe(targetedState.targetedDuplicateId);
        expect(targetedState.targetedDuplicateId).not.toBe(selectedPageId);
        expect(targetedState.targetedDuplicateData.md5).toBe(BACKGROUND_MD5);
        expect(pageHasBlock(targetedState.targetedDuplicateData, SCRIPT_BLOCK_TYPE)).toBe(true);
        expect(targetedState.previousSelectedIndex).toBe(2);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "always shows the duplicate glyph and hides the action during long-press delete mode",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await waitForEditorReady(page);
        const pageId = await page.evaluate(() => window.ScratchJr.stage.currentPage.id);
        await activateDuplicatePageAction(page, pageId);
        await waitForPageDuplication(page, 1);
        const restingState = await page.evaluate((currentPageId) => {
          const action = document.querySelector(
            `#pageactions .duplicatepage[data-owner="${currentPageId}"]`
          );
          const icon = action.querySelector(".duplicatepageicon");
          const backSquare = window.getComputedStyle(icon, "::before");
          const frontSquare = window.getComputedStyle(icon, "::after");
          return {
            actionVisibility: window.getComputedStyle(action).visibility,
            backContent: backSquare.content,
            frontContent: frontSquare.content,
            backZIndex: backSquare.zIndex,
            frontZIndex: frontSquare.zIndex,
          };
        }, pageId);

        expect(restingState.actionVisibility).toBe("visible");
        expect(restingState.backContent).not.toBe("none");
        expect(restingState.frontContent).not.toBe("none");
        expect(restingState.backZIndex).not.toBe("-1");
        expect(restingState.frontZIndex).not.toBe("-1");

        await page.evaluate((currentPageId) => new Promise((resolve) => {
          const thumb = document.querySelector(`.pagethumb[data-owner="${currentPageId}"]`);
          const bounds = thumb.getBoundingClientRect();
          thumb.dispatchEvent(new PointerEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            clientX: bounds.left + (bounds.width / 2),
            clientY: bounds.top + (bounds.height / 2),
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
          }));
          window.setTimeout(resolve, 600);
        }), pageId);
        await page.waitForFunction((currentPageId) => {
          const thumb = document.querySelector(`.pagethumb[data-owner="${currentPageId}"]`);
          const action = document.querySelector(
            `#pageactions .duplicatepage[data-owner="${currentPageId}"]`
          );
          return thumb.classList.contains("shakeme")
            && window.getComputedStyle(action).visibility === "hidden"
            && window.getComputedStyle(thumb.querySelector(".deletethumb")).visibility === "visible";
        }, { timeout: 5_000 }, pageId);

        await page.evaluate(() => window.ScratchJr.clearSelection());
        await page.waitForFunction((currentPageId) => {
          const thumb = document.querySelector(`.pagethumb[data-owner="${currentPageId}"]`);
          const action = document.querySelector(
            `#pageactions .duplicatepage[data-owner="${currentPageId}"]`
          );
          return !thumb.classList.contains("shakeme")
            && window.getComputedStyle(action).visibility === "visible";
        }, { timeout: 5_000 }, pageId);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
