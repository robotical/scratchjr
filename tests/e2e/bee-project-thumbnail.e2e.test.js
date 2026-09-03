import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3036;
const HOST = `http://localhost:${PORT}`;

let server;

async function waitForServer(maxAttempts = 20) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const ok = await new Promise((resolve) => {
      const request = http.get(`${HOST}/`, (response) => {
        response.destroy();
        resolve(true);
      });
      request.on("error", () => resolve(false));
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

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
      );
    },
    { timeout: 30_000 }
  );
}

describe("Bee project thumbnails", () => {
  it(
    "keeps transparent sprite pixels free of the camera-fill red backing",
    async () => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      const errors = [];

      page.on("pageerror", (error) => errors.push(error.message || String(error)));
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push(message.text());
        }
      });

      try {
        await page.goto(`${HOST}/home.html?place=home`, {
          waitUntil: "networkidle2",
          timeout: 30_000,
        });
        await page.waitForSelector("#newproject .card-action-open", { timeout: 30_000 });
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
          page.click("#newproject .card-action-open"),
        ]);
        await waitForEditorReady(page);

        const projectId = await page.evaluate(() => String(window.ScratchJr.currentProject));
        await page.evaluate(() => {
          window.ScratchJr.stage.currentPage.addSprite(0.35, "BeeSprite1.svg", "Bee");
        });
        await page.waitForFunction(
          () => {
            const sprite = window.ScratchJr && window.ScratchJr.getSprite();
            if (!sprite || sprite.md5 !== "BeeSprite1.svg" || !sprite.outline) {
              return false;
            }
            return sprite.outline.getContext("2d").getImageData(0, 0, 1, 1).data[3] === 0;
          },
          { timeout: 30_000 }
        );

        const persisted = await page.evaluate(() => new Promise((resolve) => {
          window.ScratchJr.changed = true;
          window.ScratchJr.saveProject(null, resolve);
        }));
        expect(persisted).toBe(true);

        await page.goto(`${HOST}/home.html?place=home`, {
          waitUntil: "networkidle2",
          timeout: 30_000,
        });
        const projectCard = `[id="${projectId}"]`;
        await page.waitForSelector(`${projectCard} .aproject img`, { timeout: 30_000 });
        await page.waitForFunction(
          (selector) => {
            const image = document.querySelector(`${selector} .aproject img`);
            return Boolean(image && image.complete && image.naturalWidth > 0);
          },
          { timeout: 30_000 },
          projectCard
        );

        const redPixelCount = await page.$eval(`${projectCard} .aproject img`, (image) => {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let count = 0;
          for (let index = 0; index < pixels.length; index += 4) {
            if (
              pixels[index] > 245
                && pixels[index + 1] < 10
                && pixels[index + 2] < 10
                && pixels[index + 3] > 245
            ) {
              count += 1;
            }
          }
          return count;
        });

        expect(redPixelCount).toBe(0);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );
});
