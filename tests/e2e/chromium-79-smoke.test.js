import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3011;
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

async function getTutorialFrame(page) {
  await page.waitForFunction(() => {
    const iframe = document.getElementById("htmlcontents");
    return iframe && iframe.tagName === "IFRAME" && iframe.src.includes("inapp/tutorials.html");
  }, { timeout: 30_000 });

  await page.waitForFunction(() => {
    const iframe = document.getElementById("htmlcontents");
    const frameLocation = iframe?.contentWindow?.location?.href;
    return typeof frameLocation === "string" && frameLocation.includes("/inapp/tutorials.html");
  }, { timeout: 30_000 });

  const iframeHandle = await page.$("#htmlcontents");
  const frame = iframeHandle ? await iframeHandle.contentFrame() : null;
  if (!frame) {
    throw new Error("Tutorial frame not found");
  }

  await frame.waitForSelector(".tutorial-card", { timeout: 30_000 });
  return frame;
}

async function assertTutorialOpened(page, tutorialId) {
  await page.waitFor(3_000);

  const tutorialState = await page.evaluate(() => ({
    tutorialEngineId:
      window.tutorialEngine && window.tutorialEngine.tutorial
        ? window.tutorialEngine.tutorial.id
        : null,
    hasTutorialMenuBar: Boolean(document.getElementById("tutorialMenuBar")),
    hasCloseTutorialButton: Boolean(document.getElementById("closeTutorial")),
    hasTutorialProgressBar: Boolean(document.getElementById("tutorialProgressBar")),
    hasTutorialInstructor: Boolean(document.getElementById("tutorialInstructor")),
    tutorialTitle: (
      document.getElementById("tutorialTitle") &&
      document.getElementById("tutorialTitle").textContent
        ? document.getElementById("tutorialTitle").textContent
        : ""
    ).trim(),
  }));

  expect(tutorialState.tutorialEngineId).toBe(tutorialId);
  expect(tutorialState.hasTutorialMenuBar).toBe(true);
  expect(tutorialState.hasCloseTutorialButton).toBe(true);
  expect(tutorialState.hasTutorialProgressBar).toBe(true);
  expect(tutorialState.hasTutorialInstructor).toBe(true);
  expect(tutorialState.tutorialTitle.length).toBeGreaterThan(0);
}

async function openExtensionsLibrary(page) {
  await page.click("#addExtensionButton");
}

async function getPaletteUndoGap(page) {
  return page.evaluate(() => {
    const palette = document.getElementById("palette").getBoundingClientRect();
    const undoControls = document.getElementById("undocontrols").getBoundingClientRect();
    return undoControls.left - palette.right;
  });
}

describe("Chromium 79 smoke test", () => {
  it(
    "loads home page without console errors",
    async () => {
      const { browser, page, errors } = await openPage("/home.html");
      const title = await page.title();

      await browser.close();
      expect(title.toLowerCase()).toContain("scratch");
      expect(errors).toEqual([]);
    },
    60_000
  );

  it(
    "uses the third connection slot for either the extension entry or micro:bit controls",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await page.waitForSelector("#addExtensionButton", { timeout: 30_000 });

        const initialState = await page.evaluate(() => {
          const addButton = document.getElementById("addExtensionButton");
          const microBitButton = document.getElementById("microBitConnectionButton");
          const removeButton = document.getElementById("microBitRemoveButton");
          return {
            addButtonDisplay: window.getComputedStyle(addButton).display,
            addButtonAriaHidden: addButton.getAttribute("aria-hidden"),
            addButtonDisabled: addButton.disabled,
            microBitButtonDisplay: window.getComputedStyle(microBitButton).display,
            microBitButtonAriaHidden: microBitButton.getAttribute("aria-hidden"),
            microBitButtonDisabled: microBitButton.disabled,
            removeButtonDisplay: window.getComputedStyle(removeButton).display,
            removeButtonAriaHidden: removeButton.getAttribute("aria-hidden"),
            removeButtonDisabled: removeButton.disabled,
            rightCategoryIds: Array.from(document.querySelectorAll("#selectorsright .category-selector-button")).map(
              (button) => button.id
            ),
            extensionEnabled: document.getElementById("connectionButtonsArea").classList.contains("extensionEnabled"),
          };
        });

        expect(initialState).toEqual({
          addButtonDisplay: "flex",
          addButtonAriaHidden: "false",
          addButtonDisabled: false,
          microBitButtonDisplay: "none",
          microBitButtonAriaHidden: "true",
          microBitButtonDisabled: true,
          removeButtonDisplay: "none",
          removeButtonAriaHidden: "true",
          removeButtonDisabled: true,
          rightCategoryIds: ["cog-start", "cog-looks", "cog-sound"],
          extensionEnabled: false,
        });

        await openExtensionsLibrary(page);
        await page.waitForSelector("#extensionsLibrary.fade.in", { timeout: 30_000 });
        const libraryState = await page.evaluate(() => ({
          title: document.getElementById("extensionsLibraryTitle").textContent.trim(),
          hasMicroBitCard: Boolean(document.getElementById("microBitExtensionCard")),
          microBitCardAction: document.getElementById("microBitExtensionCardAction").textContent.trim(),
          microBitStillHidden:
            window.getComputedStyle(document.getElementById("microBitConnectionButton")).display === "none",
        }));

        expect(libraryState).toEqual({
          title: "Extensions",
          hasMicroBitCard: true,
          microBitCardAction: "+",
          microBitStillHidden: true,
        });

        await page.click("#microBitExtensionCard");
        await page.waitForFunction(
          () => {
            const microBitButton = document.getElementById("microBitConnectionButton");
            const library = document.getElementById("extensionsLibrary");
            return microBitButton
              && window.getComputedStyle(microBitButton).display !== "none"
              && library
              && !library.classList.contains("in");
          },
          { timeout: 30_000 }
        );

        const enabledState = await page.evaluate(() => {
          const addButton = document.getElementById("addExtensionButton");
          const microBitButton = document.getElementById("microBitConnectionButton");
          const removeButton = document.getElementById("microBitRemoveButton");
          const microBitAction = microBitButton.querySelector(".iconButtonContainer");
          return {
            addButtonDisplay: window.getComputedStyle(addButton).display,
            addButtonAriaHidden: addButton.getAttribute("aria-hidden"),
            addButtonDisabled: addButton.disabled,
            microBitButtonDisplay: window.getComputedStyle(microBitButton).display,
            microBitButtonAriaHidden: microBitButton.getAttribute("aria-hidden"),
            microBitButtonDisabled: microBitButton.disabled,
            removeButtonDisplay: window.getComputedStyle(removeButton).display,
            removeButtonAriaHidden: removeButton.getAttribute("aria-hidden"),
            removeButtonDisabled: removeButton.disabled,
            microBitUsesConnectControl: window.getComputedStyle(microBitAction).backgroundImage.includes(
              "connect_btn-default.svg"
            ),
            microBitActionPosition: window.getComputedStyle(microBitAction).position,
            rightCategoryIds: Array.from(document.querySelectorAll("#selectorsright .category-selector-button")).map(
              (button) => button.id
            ),
            selectedRightCategoryIds: Array.from(
              document.querySelectorAll('#selectorsright .category-selector-button[aria-pressed="true"]')
            ).map((button) => button.id),
            paletteBlockTypes: Array.from(document.querySelectorAll("#palette > div")).map(
              (block) => block.owner && block.owner.blocktype
            ),
            extensionEnabled: document.getElementById("connectionButtonsArea").classList.contains("extensionEnabled"),
          };
        });

        expect(enabledState).toEqual({
          addButtonDisplay: "none",
          addButtonAriaHidden: "true",
          addButtonDisabled: true,
          microBitButtonDisplay: "flex",
          microBitButtonAriaHidden: "false",
          microBitButtonDisabled: false,
          removeButtonDisplay: "flex",
          removeButtonAriaHidden: "false",
          removeButtonDisabled: false,
          microBitUsesConnectControl: true,
          microBitActionPosition: "static",
          rightCategoryIds: ["cog-start", "cog-looks", "cog-sound", "microbit-start", "microbit-looks"],
          selectedRightCategoryIds: ["microbit-start"],
          paletteBlockTypes: [
            "microbitbuttonpressed",
            "microbitgesture",
            "microbittilted",
          ],
          extensionEnabled: true,
        });

        const microBitTiltState = await page.evaluate(() => {
          const paletteBlock = Array.from(document.querySelectorAll("#palette > div"))
            .find((block) => block.owner && block.owner.blocktype === "microbittilted").owner;
          return {
            defaultValue: paletteBlock.getArgValue(),
            options: JSON.parse(paletteBlock.arg.list),
          };
        });

        expect(microBitTiltState).toEqual({
          defaultValue: "microbittiltright",
          options: [
            "microbittiltright",
            "microbittiltleft",
            "microbittiltbackward",
            "microbittiltforward",
          ],
        });

        const legacyMicroBitTiltState = await page.evaluate(() => {
          const scripts = window.ScratchJr.getActiveScript().owner;
          const block = scripts.insertKeyboardBlock(null, [[
            "microbittilted",
            "microbittiltany",
            50,
            50,
          ]]);
          return {
            value: block.getArgValue(),
            icon: block.arg.icon,
            options: JSON.parse(block.arg.list),
          };
        });

        expect(legacyMicroBitTiltState).toEqual({
          value: "microbittiltany",
          icon: "microbittiltany",
          options: [
            "microbittiltright",
            "microbittiltleft",
            "microbittiltbackward",
            "microbittiltforward",
          ],
        });

        const standardPaletteUndoGap = await getPaletteUndoGap(page);
        const maximumPaletteUndoGap = await page.evaluate(() => window.innerHeight * 0.02);
        await page.setViewport({ width: 1200, height: 600 });
        const widePaletteUndoGap = await getPaletteUndoGap(page);
        await page.setViewport({ width: 800, height: 600 });

        expect(standardPaletteUndoGap).toBeGreaterThanOrEqual(0);
        expect(standardPaletteUndoGap).toBeLessThanOrEqual(maximumPaletteUndoGap);
        expect(widePaletteUndoGap).toBeCloseTo(standardPaletteUndoGap, 1);

        const connectedActionState = await page.evaluate(() => {
          const microBitButton = document.getElementById("microBitConnectionButton");
          const microBitAction = microBitButton.querySelector(".iconButtonContainer");
          microBitButton.classList.add("connectButtonConnected");
          microBitAction.classList.remove("notConnectedButtonContainer");
          microBitAction.classList.add("connectedButtonContainer");
          microBitAction.textContent = "DISCONNECT";

          const actionStyle = window.getComputedStyle(microBitAction);
          const result = {
            text: microBitAction.textContent,
            backgroundImage: actionStyle.backgroundImage,
            position: actionStyle.position,
          };

          microBitButton.classList.remove("connectButtonConnected");
          microBitAction.classList.remove("connectedButtonContainer");
          microBitAction.classList.add("notConnectedButtonContainer");
          microBitAction.textContent = "";
          return result;
        });

        expect(connectedActionState).toEqual({
          text: "DISCONNECT",
          backgroundImage: "none",
          position: "static",
        });

        await page.click("#microbit-looks");
        await page.waitForFunction(
          () => Array.from(document.querySelectorAll("#palette > div")).some(
            (block) => block.owner && block.owner.blocktype === "microbitdisplaycustom"
          ),
          { timeout: 30_000 }
        );
        const looksPaletteBlockTypes = await page.evaluate(() =>
          Array.from(document.querySelectorAll("#palette > div")).map((block) => block.owner && block.owner.blocktype)
        );
        expect(looksPaletteBlockTypes).toEqual([
          "microbitdisplayheart",
          "microbitdisplayhappy",
          "microbitdisplaycustom",
          "microbitdisplaytext",
          "microbitdisplayclear",
        ]);

        const customMatrixState = await page.evaluate(() => {
          const scripts = window.ScratchJr.getActiveScript().owner;
          const block = scripts.insertKeyboardBlock(null, [[
            "microbitdisplaycustom",
            "00000/00000/00000/00000/00000",
            50,
            50,
          ]]);
          block.arg.pressMicroBitMatrixEditor({
            preventDefault() {},
            stopPropagation() {},
          });
          const cells = Array.from(document.querySelectorAll(".microbitMatrixCell"));
          cells[12].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true }));
          return {
            argValue: block.getArgValue(),
            cellCount: cells.length,
            menuOpen: Boolean(document.querySelector(".microbitMatrixMenu")),
            activeCells: Array.from(document.querySelectorAll(".microbitMatrixCell.on")).length,
          };
        });
        expect(customMatrixState).toEqual({
          argValue: "00000/00000/00100/00000/00000",
          cellCount: 25,
          menuOpen: true,
          activeCells: 1,
        });

        const blocksAfterInsert = await page.evaluate(() => {
          const scripts = window.ScratchJr.getActiveScript().owner;
          scripts.insertKeyboardBlock(null, [["microbitdisplayclear", "null", 20, 20]]);
          return window.ScratchJr.getBlocks().map((block) => block.blocktype);
        });
        expect(blocksAfterInsert).toContain("microbitdisplayclear");

        await page.click("#microBitRemoveButton");
        await page.waitForSelector("#microBitExtensionRemoveWarning.show", { timeout: 30_000 });
        const loadedLibraryState = await page.evaluate(() => ({
          microBitCardAction: document.getElementById("microBitExtensionCardAction").textContent.trim(),
          microBitCardLoaded: document.getElementById("microBitExtensionCard").classList.contains("loaded"),
        }));
        expect(loadedLibraryState).toEqual({
          microBitCardAction: "-",
          microBitCardLoaded: true,
        });

        await page.click("#microBitExtensionRemoveCancel");
        await page.waitForFunction(
          () => !document.getElementById("microBitExtensionRemoveWarning").classList.contains("show"),
          { timeout: 30_000 }
        );
        const cancelUnloadState = await page.evaluate(() => ({
          microBitButtonDisplay: window.getComputedStyle(document.getElementById("microBitConnectionButton")).display,
          hasMicroBitBlock: window.ScratchJr.getBlocks().some((block) => block.blocktype === "microbitdisplayclear"),
        }));
        expect(cancelUnloadState).toEqual({
          microBitButtonDisplay: "flex",
          hasMicroBitBlock: true,
        });

        await page.click(".extensionsLibraryClose");
        await page.waitForFunction(
          () => !document.getElementById("extensionsLibrary").classList.contains("in"),
          { timeout: 30_000 }
        );
        await page.click("#microBitRemoveButton");
        await page.waitForSelector("#microBitExtensionRemoveWarning.show", { timeout: 30_000 });
        await page.click("#microBitExtensionRemoveConfirm");
        await page.waitForFunction(
          () => window.getComputedStyle(document.getElementById("microBitConnectionButton")).display === "none"
            && !document.querySelector("#selectorsright #microbit-start")
            && !document.getElementById("extensionsLibrary").classList.contains("in"),
          { timeout: 30_000 }
        );
        const unloadedState = await page.evaluate(() => ({
          addButtonDisplay: window.getComputedStyle(document.getElementById("addExtensionButton")).display,
          microBitButtonDisplay: window.getComputedStyle(document.getElementById("microBitConnectionButton")).display,
          removeButtonDisplay: window.getComputedStyle(document.getElementById("microBitRemoveButton")).display,
          extensionsLibraryOpen: document.getElementById("extensionsLibrary").classList.contains("in"),
          microBitCardAction: document.getElementById("microBitExtensionCardAction").textContent.trim(),
          microBitCardLoaded: document.getElementById("microBitExtensionCard").classList.contains("loaded"),
          rightCategoryIds: Array.from(document.querySelectorAll("#selectorsright .category-selector-button")).map(
            (button) => button.id
          ),
          hasMicroBitBlock: window.ScratchJr.getBlocks().some((block) => block.blocktype.indexOf("microbit") === 0),
          extensionEnabled: document.getElementById("connectionButtonsArea").classList.contains("extensionEnabled"),
        }));
        expect(unloadedState).toEqual({
          addButtonDisplay: "flex",
          microBitButtonDisplay: "none",
          removeButtonDisplay: "none",
          extensionsLibraryOpen: false,
          microBitCardAction: "+",
          microBitCardLoaded: false,
          rightCategoryIds: ["cog-start", "cog-looks", "cog-sound"],
          hasMicroBitBlock: false,
          extensionEnabled: false,
        });

        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "opens tutorials from the book tab and returns there from tutorial mode",
    async () => {
      const { browser, page, errors } = await openPage("/home.html?place=book&submenu=tutorials");

      const frame = await getTutorialFrame(page);
      const tutorialCount = await frame.$$eval(".tutorial-card", (cards) => cards.length);

      expect(tutorialCount).toBe(19);

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
        frame.click('[data-tutorial-id="marty-jr-blocks-1"]'),
      ]);

      expect(page.url()).toContain("/editor.html");
      expect(page.url()).toContain("tutorial=marty-jr-blocks-1");
      expect(page.url()).toContain("tutorialReturnPlace=book");
      expect(page.url()).toContain("tutorialReturnSubmenu=tutorials");

      await assertTutorialOpened(page, "marty-jr-blocks-1");

      await page.evaluate(() => {
        document.getElementById("closeTutorial").click();
      });
      await page.waitForFunction(
        () => window.location.href.includes("home.html?place=book&submenu=tutorials"),
        { timeout: 30_000 }
      );

      expect(page.url()).toContain("/home.html?place=book&submenu=tutorials");

      const returnedFrame = await getTutorialFrame(page);
      const returnedCount = await returnedFrame.$$eval(".tutorial-card", (cards) => cards.length);

      await browser.close();

      expect(returnedCount).toBe(19);
      expect(errors).toEqual([]);
    },
    90_000
  );

  it(
    "opens a tutorial when the tutorials page is loaded standalone",
    async () => {
      const { browser, page, errors } = await openPage("/inapp/tutorials.html");

      await page.waitForSelector('.tutorial-card[data-tutorial-id="marty-jr-blocks-1"]', {
        timeout: 30_000,
      });

      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
        page.click('.tutorial-card[data-tutorial-id="marty-jr-blocks-1"]'),
      ]);

      expect(page.url()).toContain("/editor.html");
      expect(page.url()).toContain("tutorial=marty-jr-blocks-1");
      expect(page.url()).toContain("tutorialReturnPlace=book");
      expect(page.url()).toContain("tutorialReturnSubmenu=tutorials");

      await assertTutorialOpened(page, "marty-jr-blocks-1");

      await browser.close();

      expect(errors).toEqual([]);
    },
    90_000
  );

  it(
    "returns to the in-app tutorials page when a tutorial was launched from the host-style entry route",
    async () => {
      const { browser, page, errors } = await openPage("/index.html?tutorial=marty-jr-blocks-1");

      await page.waitForFunction(
        () => window.location.href.includes("editor.html") && window.location.href.includes("tutorial=marty-jr-blocks-1"),
        { timeout: 30_000 }
      );

      expect(page.url()).toContain("/editor.html");
      expect(page.url()).toContain("tutorialReturnPlace=book");
      expect(page.url()).toContain("tutorialReturnSubmenu=tutorials");

      await assertTutorialOpened(page, "marty-jr-blocks-1");

      await page.evaluate(() => {
        document.getElementById("closeTutorial").click();
      });

      await page.waitForFunction(
        () => window.location.href.includes("home.html?place=book&submenu=tutorials"),
        { timeout: 30_000 }
      );

      expect(page.url()).toContain("/home.html?place=book&submenu=tutorials");

      const frame = await getTutorialFrame(page);
      const tutorialCount = await frame.$$eval(".tutorial-card", (cards) => cards.length);

      await browser.close();

      expect(tutorialCount).toBe(19);
      expect(errors).toEqual([]);
    },
    90_000
  );
});
