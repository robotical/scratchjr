import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3015;
const HOST = `http://localhost:${PORT}`;
const AFFECTED_SPRITES = [
  { name: "Pink Octopus", md5: "Sprites_Octopus-Pink.svg" },
  { name: "Raccoon", md5: "Sprites_Raccoon.svg" },
  { name: "Unicorn", md5: "Sprites_Unicorn.svg" },
];
const LEGACY_SPRITES = [
  { name: "Dog", md5: "Dog.svg", expectsGrayscale: false },
  { name: "Marty", md5: "Sprites_Marty.svg", expectsGrayscale: false },
  { name: "Bee", md5: "BeeSprite1.svg", expectsGrayscale: true },
];

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
          && document.querySelector(".watermark")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout: 30_000 }
  );
}

async function addSpriteAndWait(page, sprite) {
  await page.evaluate((spriteMd5, spriteName) => {
    window.ScratchJr.stage.currentPage.addSprite(0.5, spriteMd5, spriteName);
  }, sprite.md5, sprite.name);

  await page.waitForFunction(
    (spriteMd5) => {
      const activeSprite = window.ScratchJr && window.ScratchJr.getSprite();
      const watermark = document.querySelector(".watermark img");
      return Boolean(
        activeSprite
          && activeSprite.md5 === spriteMd5
          && watermark
          && watermark.complete
          && (watermark.naturalWidth > 0 || watermark.width > 0)
      );
    },
    { timeout: 30_000 },
    sprite.md5
  );
}

async function measureGrayscaleMatch(page, sprite) {
  return page.evaluate(async (spriteName, spriteMd5) => {
    const watermark = document.querySelector(".watermark img");
    if (watermark.decode) {
      try {
        await watermark.decode();
      } catch (err) {
        // Some SVG data URLs report as already usable even when decode rejects.
      }
    }

    const original = new Image();
    original.src = `/svglibrary/${spriteMd5}`;
    await original.decode();

    const width = original.naturalWidth;
    const height = original.naturalHeight;
    const filter = window.getComputedStyle(watermark).filter;

    const renderPixels = (image, imageFilter) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.filter = imageFilter;
      ctx.drawImage(image, 0, 0, width, height);
      return ctx.getImageData(0, 0, width, height).data;
    };

    const actualPixels = renderPixels(watermark, filter);
    const expectedPixels = renderPixels(original, "grayscale(1)");
    let comparedPixels = 0;
    let differentPixels = 0;
    let totalChannelDifference = 0;
    let maxChannelDifference = 0;
    let opaquePixels = 0;
    let coloredPixels = 0;

    for (let i = 0; i < actualPixels.length; i += 4) {
      if (actualPixels[i + 3] <= 20 && expectedPixels[i + 3] <= 20) {
        continue;
      }

      comparedPixels += 1;
      let pixelDifference = 0;
      for (let channel = 0; channel < 4; channel += 1) {
        const difference = Math.abs(actualPixels[i + channel] - expectedPixels[i + channel]);
        totalChannelDifference += difference;
        pixelDifference = Math.max(pixelDifference, difference);
        maxChannelDifference = Math.max(maxChannelDifference, difference);
      }
      if (pixelDifference > 2) {
        differentPixels += 1;
      }

      if (actualPixels[i + 3] > 20) {
        opaquePixels += 1;
        const highestChannel = Math.max(actualPixels[i], actualPixels[i + 1], actualPixels[i + 2]);
        const lowestChannel = Math.min(actualPixels[i], actualPixels[i + 1], actualPixels[i + 2]);
        if (highestChannel - lowestChannel > 2) {
          coloredPixels += 1;
        }
      }
    }

    return {
      name: spriteName,
      md5: spriteMd5,
      width,
      height,
      filter,
      opaquePixels,
      meanChannelDifference: comparedPixels === 0 ? 0 : totalChannelDifference / (comparedPixels * 4),
      differentPixelRatio: comparedPixels === 0 ? 0 : differentPixels / comparedPixels,
      maxChannelDifference,
      coloredPixelRatio: opaquePixels === 0 ? 0 : coloredPixels / opaquePixels,
    };
  }, sprite.name, sprite.md5);
}

async function getLegacyWatermarkState(page, sprite) {
  return page.evaluate((spriteName, spriteMd5) => {
    const activeSprite = window.ScratchJr.getSprite();
    const watermark = document.querySelector(".watermark img");
    const legacyWatermark = activeSprite.getSVGimage(activeSprite.watermark);
    const sourceWatermark = activeSprite.getSVGimage(activeSprite.svg);

    return {
      name: spriteName,
      md5: spriteMd5,
      filter: window.getComputedStyle(watermark).filter,
      usesLegacySource: watermark.src === legacyWatermark.src,
      usesOriginalSource: watermark.src === sourceWatermark.src,
    };
  }, sprite.name, sprite.md5);
}

describe("sprite scripts watermark grayscale rendering", () => {
  it(
    "renders affected sprite watermarks from their source SVG in grayscale",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        const metrics = [];
        for (const sprite of AFFECTED_SPRITES) {
          await addSpriteAndWait(page, sprite);
          metrics.push(await measureGrayscaleMatch(page, sprite));
        }

        for (const metric of metrics) {
          expect(metric.filter).toContain("grayscale");
          expect(metric.opaquePixels).toBeGreaterThan(0);
          expect(metric.meanChannelDifference).toBeLessThan(0.5);
          expect(metric.differentPixelRatio).toBeLessThan(0.01);
          expect(metric.coloredPixelRatio).toBeLessThan(0.01);
        }
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );

  it(
    "preserves the legacy watermark path for existing sprites",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        const states = [];
        for (const sprite of LEGACY_SPRITES) {
          await addSpriteAndWait(page, sprite);
          states.push({
            ...await getLegacyWatermarkState(page, sprite),
            expectsGrayscale: sprite.expectsGrayscale,
          });
        }

        for (const state of states) {
          if (state.expectsGrayscale) {
            expect(state.filter).toContain("grayscale");
          } else {
            expect(state.filter).toBe("none");
          }
          expect(state.usesLegacySource).toBe(true);
          expect(state.usesOriginalSource).toBe(false);
        }
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
