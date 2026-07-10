import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3015;
const HOST = `http://localhost:${PORT}`;
const BACKGROUND_MD5 = "BeachDay.svg";

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

  await page.setViewport({ width: 1024, height: 768 });

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
          && document.getElementById("setbkg")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
      );
    },
    { timeout: 30_000 }
  );
}

async function openBackgroundLibrary(page) {
  await page.click("#setbkg");
  await page.waitForSelector("#libframe.appear #scrollarea", { timeout: 30_000 });
  await page.waitForSelector(`[id="${BACKGROUND_MD5}"]`, { timeout: 30_000 });
}

async function chooseBackground(page) {
  await openBackgroundLibrary(page);
  await page.click(`[id="${BACKGROUND_MD5}"]`);
  await page.waitForFunction(
    (backgroundMd5) => {
      const thumb = document.getElementById(backgroundMd5);
      return thumb && thumb.className === "assetbox on";
    },
    { timeout: 30_000 },
    BACKGROUND_MD5
  );
  await page.waitFor(300);
  await page.click("#okbut");
  await page.waitForFunction(
    (backgroundMd5) => {
      const libFrame = document.getElementById("libframe");
      return window.ScratchJr.stage.currentPage.md5 === backgroundMd5
        && libFrame
        && libFrame.className === "libframe disappear";
    },
    { timeout: 30_000 },
    BACKGROUND_MD5
  );
}

async function openActiveBackgroundInPaintEditor(page) {
  await openBackgroundLibrary(page);
  await page.click("#library_paintme");
  await page.waitForSelector("#paintframe.appear #layer1", { timeout: 30_000 });
  await page.waitForFunction(
    () => {
      const layer = document.getElementById("layer1");
      return layer && layer.childElementCount > 0;
    },
    { timeout: 30_000 }
  );
}

describe("Background paint editor", () => {
  it(
    "opens the current page background from the library paintbrush",
    async () => {
      const { browser, page, errors } = await openPage("/editor.html?mode=edit");

      try {
        await waitForEditorReady(page);
        await chooseBackground(page);
        await openActiveBackgroundInPaintEditor(page);

        const paintState = await page.evaluate((backgroundMd5) => {
          const layer = document.getElementById("layer1");
          const firstChild = layer.firstElementChild;
          return {
            currentPageMd5: window.ScratchJr.stage.currentPage.md5,
            layerChildCount: layer.childElementCount,
            firstChildId: firstChild ? firstChild.id : null,
            hasGeneratedBlankBackground:
              layer.childElementCount === 1 && firstChild && firstChild.id === "staticbkg",
            hasExpectedBackgroundContent: Boolean(layer.querySelector('[id="Tide"]')),
            paintFrameClass: document.getElementById("paintframe").className,
            expectedBackgroundMd5: backgroundMd5,
          };
        }, BACKGROUND_MD5);

        expect(paintState.currentPageMd5).toBe(BACKGROUND_MD5);
        expect(paintState.hasGeneratedBlankBackground).toBe(false);
        expect(paintState.hasExpectedBackgroundContent).toBe(true);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
