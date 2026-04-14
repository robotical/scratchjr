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
  });

  const frame = page.frames().find((entry) => entry.url().includes("/inapp/tutorials.html"));
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
