import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3016;
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

async function openEditor() {
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

  await page.goto(`${HOST}/editor.html?mode=edit`, { waitUntil: "networkidle2", timeout: 30_000 });
  await waitForEditorReady(page);

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
          && document.querySelector("#spritecc .spritethumb.on .brush")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout: 30_000 }
  );
}

async function openSpritePaintEditor(page) {
  await page.click("#addsprite");
  await page.waitForSelector("#libframe.appear #Star\\.svg", { timeout: 30_000 });
  await page.click("#Star\\.svg");
  await page.waitForFunction(
    () => {
      const star = document.getElementById("Star.svg");
      const paintButton = document.getElementById("library_paintme");
      return Boolean(
        star
          && star.className.includes("on")
          && paintButton.getAttribute("aria-disabled") === "false"
      );
    },
    { timeout: 30_000 }
  );

  await new Promise((resolve) => setTimeout(resolve, 250));
  await page.click("#Star\\.svg");
  await page.waitForFunction(
    () => {
      const sprite = window.ScratchJr && window.ScratchJr.getSprite();
      return Boolean(sprite && sprite.md5 === "Star.svg");
    },
    { timeout: 30_000 }
  );

  const starThumbId = await page.evaluate(() => window.ScratchJr.getSprite().thumbnail.id);
  await page.click(`[id="${starThumbId}"]`);
  await page.waitForFunction(
    () => {
      const sprite = window.ScratchJr && window.ScratchJr.getSprite();
      const brush = sprite && sprite.thumbnail && sprite.thumbnail.querySelector(".brush");
      return Boolean(
        sprite
          && sprite.md5 === "Star.svg"
          && sprite.thumbnail.className.includes("on")
          && brush
          && window.getComputedStyle(brush).display !== "none"
      );
    },
    { timeout: 30_000 }
  );

  await page.evaluate(() => {
    const sprite = window.ScratchJr.getSprite();
    const brush = sprite && sprite.thumbnail && sprite.thumbnail.querySelector(".brush");
    if (!brush || window.getComputedStyle(brush).display === "none") {
      throw new Error("Selected editable sprite paintbrush control was not found");
    }
    brush.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, pointerType: "mouse" }));
  });
  await waitForPaintEditor(page);
}

async function openBackgroundPaintEditor(page) {
  await page.click("#setbkg");
  await page.waitForSelector("#libframe.appear #library_paintme", { timeout: 30_000 });
  await page.click("#library_paintme");
  await waitForPaintEditor(page);
}

async function waitForPaintEditor(page) {
  await page.waitForFunction(
    () => {
      const paintFrame = document.getElementById("paintframe");
      const doneCheck = document.getElementById("donecheck");
      const layer = document.getElementById("layer1");
      return Boolean(
        paintFrame
          && doneCheck
          && layer
          && layer.childElementCount > 0
          && window.getComputedStyle(paintFrame).display !== "none"
          && window.getComputedStyle(doneCheck).display !== "none"
      );
    },
    { timeout: 30_000 }
  );
}

async function getPaintToolbarControls(page) {
  return page.evaluate(() => {
    const paintFrame = document.getElementById("paintframe");
    const toolbar = paintFrame && paintFrame.querySelector(".paintop");
    const controls = toolbar ? Array.from(toolbar.querySelectorAll("*")) : [];
    const visibleControls = controls
      .filter((element) => {
        const styles = window.getComputedStyle(element);
        return styles.display !== "none" && styles.visibility !== "hidden" && element.offsetWidth > 0 && element.offsetHeight > 0;
      })
      .map((element) => {
        const styles = window.getComputedStyle(element);
        return {
          id: element.id,
          className: element.className,
          ariaLabel: element.getAttribute("aria-label") || "",
          title: element.getAttribute("title") || "",
          backgroundImage: styles.backgroundImage,
        };
      });

    const isAcceptControl = (control) => (
      control.id === "donecheck"
        || /\bpaintdone\b/.test(control.className)
        || /ok\.svg|check|accept|done/i.test(`${control.backgroundImage} ${control.ariaLabel} ${control.title}`)
    );

    const isCancelControl = (control) => (
      /\b(cancelicon|paintcancel|closeModal|closex)\b/.test(control.className)
        || /\b(cancel|close|dismiss)\b/i.test(`${control.id} ${control.ariaLabel} ${control.title}`)
        || /cancel\.svg|close/i.test(control.backgroundImage)
    );

    return {
      hasToolbar: Boolean(toolbar),
      visibleControls,
      acceptControls: visibleControls.filter(isAcceptControl),
      cancelControls: visibleControls.filter(isCancelControl),
    };
  });
}

async function cancelPaintEditor(page, errors) {
  const hitTarget = await page.$eval("#cancelcheck", (button) => {
    const rect = button.getBoundingClientRect();
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return target ? { id: target.id, className: target.className, tagName: target.tagName } : null;
  });
  await page.click("#cancelcheck");
  try {
    await page.waitForFunction(() => {
      const paintFrame = document.getElementById("paintframe");
      const editorFrame = document.getElementById("frame");
      return paintFrame
        && editorFrame
        && window.getComputedStyle(paintFrame).display === "none"
        && window.getComputedStyle(editorFrame).display !== "none";
    }, { timeout: 5_000 });
  } catch (error) {
    const state = await page.evaluate(() => ({
      paintFrameClass: document.getElementById("paintframe").className,
      paintFrameDisplay: window.getComputedStyle(document.getElementById("paintframe")).display,
      editorFrameDisplay: window.getComputedStyle(document.getElementById("frame")).display,
      cancelHasClickHandler: typeof document.getElementById("cancelcheck").onclick === "function",
    }));
    throw new Error(`Cancel control did not close the paint editor: ${JSON.stringify({ hitTarget, state, errors })}`);
  }
}

describe("Paint editor cancel controls", () => {
  it(
    "offers a cancel control in the sprite paint editor",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        await openSpritePaintEditor(page);
        const spriteToolbar = await getPaintToolbarControls(page);

        expect(spriteToolbar.hasToolbar).toBe(true);
        expect(spriteToolbar.acceptControls.length).toBeGreaterThan(0);
        expect(spriteToolbar.cancelControls.length).toBeGreaterThan(0);
        await cancelPaintEditor(page, errors);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "offers a cancel control in the background paint editor",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        await openBackgroundPaintEditor(page);
        const backgroundToolbar = await getPaintToolbarControls(page);

        expect(backgroundToolbar.hasToolbar).toBe(true);
        expect(backgroundToolbar.acceptControls.length).toBeGreaterThan(0);
        expect(backgroundToolbar.cancelControls.length).toBeGreaterThan(0);
        await cancelPaintEditor(page, errors);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
