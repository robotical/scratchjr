import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3023;
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

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr &&
          ScratchJr.stage &&
          ScratchJr.stage.currentPage &&
          ScratchJr.getActiveScript() &&
          backdrop &&
          window.getComputedStyle(backdrop).display === "none"
      );
    },
    { timeout: 30_000 }
  );
}

beforeAll(async () => {
  server = spawn(
    "python3",
    ["-m", "http.server", `${PORT}`, "--directory", "editions/free/src"],
    { stdio: "ignore" }
  );
  await waitForServer();
}, 30_000);

afterAll(() => {
  if (server) {
    server.kill();
  }
});

describe("numeric keypad block deletion", () => {
  it(
    "cleans up the keypad when Backspace deletes the edited Cog rest block",
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
        await page.goto(`${HOST}/editor.html?mode=edit`, {
          waitUntil: "networkidle2",
          timeout: 30_000,
        });
        await waitForEditorReady(page);

        await page.evaluate(() => {
          const scripts = ScratchJr.getActiveScript().owner;
          const block = scripts.insertKeyboardBlock(null, [
            ["waitcrotchet", "1", 50, 50],
          ]);
          block.div.focus();
        });

        const numberField =
          "#scriptscontainer .keyboard-script-strip h3";
        await page.waitForSelector(numberField);
        await page.click(numberField);

        expect(
          await page.evaluate(() => ({
            activeBlock: ScratchJr.activeFocus?.daddy?.blocktype,
            keypadClass: document.querySelector(".picokeyboard")?.className,
            focusedStrip: document.activeElement?.classList.contains(
              "keyboard-script-strip"
            ),
          }))
        ).toEqual({
          activeBlock: "waitcrotchet",
          keypadClass: "picokeyboard on",
          focusedStrip: true,
        });

        await page.keyboard.press("Backspace");
        await page.waitForFunction(() => ScratchJr.getBlocks().length === 0);

        await page.click("#scriptscontainer");

        expect(
          await page.evaluate(() => ({
            keypadClass: document.querySelector(".picokeyboard")?.className,
            hasActiveFocus: Boolean(ScratchJr.activeFocus),
            hasGlobalKeyHandler: typeof window.onkeydown === "function",
          }))
        ).toEqual({
          keypadClass: "picokeyboard off",
          hasActiveFocus: false,
          hasGlobalKeyHandler: false,
        });
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    60_000
  );
});
