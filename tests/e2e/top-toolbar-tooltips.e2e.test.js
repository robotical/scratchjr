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
    "renders bounded app-owned tooltips for hover and keyboard focus",
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

        const invalidTooltips = await page.evaluate((buttonIds) => {
          return buttonIds
            .map((id) => {
              const button = document.getElementById(id);
              const label = button.getAttribute("aria-label") || "";
              return {
                id,
                ariaLabel: label,
                nativeTitle: button.getAttribute("title"),
                tooltip: button.getAttribute("data-tooltip") || "",
              };
            })
            .filter(
              (button) =>
                button.nativeTitle !== null ||
                button.tooltip !== button.ariaLabel
            );
        }, TOP_TOOLBAR_BUTTON_IDS);

        expect(invalidTooltips).toEqual([]);

        const initialActionLabels = await page.evaluate(() => ({
          background: document.getElementById("setbkg").getAttribute("data-tooltip"),
          run: document.getElementById("go").getAttribute("data-tooltip"),
        }));
        expect(initialActionLabels).toEqual({
          background: "Change Background",
          run: "Run project",
        });

        const runningActionLabels = await page.evaluate(() => {
          const runtime = window.ScratchJr.runtime;
          const previousThreads = runtime.threadsRunning;
          runtime.threadsRunning = [{
            isRunning: true,
            firstBlock: { blocktype: "onflag" },
          }];
          window.ScratchJr.updateRunStopButtons();

          const go = document.getElementById("go");
          const labels = {
            ariaLabel: go.getAttribute("aria-label"),
            tooltip: go.getAttribute("data-tooltip"),
          };

          runtime.threadsRunning = previousThreads;
          window.ScratchJr.updateRunStopButtons();
          return labels;
        });
        expect(runningActionLabels).toEqual({
          ariaLabel: "Stop project",
          tooltip: "Stop project",
        });

        await page.click("#martyMode");
        await page.waitForFunction(
          () => document.getElementById("setbkg").getAttribute("data-tooltip") === "Change surface",
          { timeout: 5_000 }
        );
        const martyBackgroundLabels = await page.$eval("#setbkg", (button) => ({
          ariaLabel: button.getAttribute("aria-label"),
          tooltip: button.getAttribute("data-tooltip"),
        }));
        expect(martyBackgroundLabels).toEqual({
          ariaLabel: "Change surface",
          tooltip: "Change surface",
        });

        await page.hover("#grid");
        await new Promise((resolve) => setTimeout(resolve, 200));

        const hoverTooltip = await page.$eval("#grid", (button) => {
          const style = window.getComputedStyle(button, "::after");
          return {
            content: style.content,
            opacity: style.opacity,
            visibility: style.visibility,
            maxWidth: style.maxWidth,
          };
        });

        expect(hoverTooltip.content).toContain("Grid");
        expect(hoverTooltip.opacity).toBe("1");
        expect(hoverTooltip.visibility).toBe("visible");
        expect(hoverTooltip.maxWidth).toBe("240px");

        await page.mouse.move(0, 0);
        await page.focus("#traceBtn");
        await new Promise((resolve) => setTimeout(resolve, 200));

        const focusedTooltip = await page.$eval("#traceBtn", (button) => {
          const style = window.getComputedStyle(button, "::after");
          return {
            focused: document.activeElement === button,
            opacity: style.opacity,
            visibility: style.visibility,
          };
        });

        expect(focusedTooltip.focused).toBe(true);
        expect(focusedTooltip.opacity).toBe("1");
        expect(focusedTooltip.visibility).toBe("visible");
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
