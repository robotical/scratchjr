import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3013;
const HOST = `http://localhost:${PORT}`;

const TOP_TOOLBAR_BUTTON_IDS = [
  "full",
  "grid",
  "traceBtn",
  "traceClear",
  "setbkg",
  "addtext",
  "resetall",
  "go",
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

  return { browser, page, errors };
}

describe("top toolbar tooltips", () => {
  it(
    "exposes hover tooltip titles for the top-center editor icons",
    async () => {
      const { browser, page, errors } = await openEditor();

      try {
        await page.waitForSelector("#stageframe", { timeout: 30_000 });
        await page.waitForFunction(
          (buttonIds) =>
            buttonIds.every((id) => {
              const button = document.getElementById(id);
              return button && button.tagName === "BUTTON" && button.getAttribute("aria-label");
            }),
          { timeout: 30_000 },
          TOP_TOOLBAR_BUTTON_IDS
        );

        const buttonsWithoutTooltips = await page.evaluate((buttonIds) => {
          return buttonIds
            .map((id) => {
              const button = document.getElementById(id);
              const label = button.getAttribute("aria-label") || "";
              return {
                id,
                ariaLabel: label,
                title: button.getAttribute("title") || "",
              };
            })
            .filter((button) => button.title !== button.ariaLabel);
        }, TOP_TOOLBAR_BUTTON_IDS);

        expect(buttonsWithoutTooltips).toEqual([]);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
