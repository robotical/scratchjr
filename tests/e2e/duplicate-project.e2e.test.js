import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3030;
const HOST = `http://localhost:${PORT}`;
const ORIGINAL_BLOCK = "back";
const COPY_ONLY_BLOCK = "forward";

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

async function openPage() {
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

  await page.goto(`${HOST}/home.html?place=home`, { waitUntil: "networkidle2", timeout: 30_000 });
  return { browser, page, errors };
}

async function waitForEditorReady(page, timeout = 30_000) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && document.getElementById("sprite-motion")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
          && window.ScratchJr.getActiveScript()
      );
    },
    { timeout }
  );
}

async function createProjectFromHome(page) {
  await page.waitForSelector("#newproject .card-action-open", { timeout: 30_000 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
    page.click("#newproject .card-action-open"),
  ]);
  await waitForEditorReady(page);
  return page.evaluate(() => String(window.ScratchJr.currentProject));
}

async function insertMotionBlock(page, blockType) {
  await page.click("#sprite-motion");
  await page.waitForFunction(
    (type) => Boolean(document.querySelector(`#palette [data-blocktype="${type}"]`)),
    { timeout: 30_000 },
    blockType
  );
  await page.evaluate((type) => {
    const blockElement = document.querySelector(`#palette [data-blocktype="${type}"]`);
    window.Palette.insertBlockFromKeyboard(blockElement, new Event("duplicate-project-e2e"));
  }, blockType);
  await page.waitForFunction(
    (type) => window.ScratchJr.getBlocks().some((block) => block.blocktype === type),
    { timeout: 30_000 },
    blockType
  );
}

async function saveProject(page) {
  const persisted = await page.evaluate(() => new Promise((resolve) => {
    window.ScratchJr.changed = true;
    window.ScratchJr.saveProject(null, resolve);
  }));
  expect(persisted).toBe(true);
}

async function readProjectRow(page, projectId) {
  return page.evaluate((id) => new Promise((resolve) => {
    window.OS.query(
      { stmt: "select * from projects where id = ?", values: [Number(id)] },
      (result) => {
        const rows = JSON.parse(result);
        if (!rows.length) {
          resolve(null);
          return;
        }
        const row = Object.fromEntries(
          Object.entries(rows[0]).map(([key, value]) => [key.toLowerCase(), value])
        );
        row.json = typeof row.json === "string" ? JSON.parse(row.json) : row.json;
        row.thumbnail = typeof row.thumbnail === "string" ? JSON.parse(row.thumbnail) : row.thumbnail;
        resolve(row);
      }
    );
  }), projectId);
}

function projectHasBlock(project, blockType) {
  if (!project || !project.json || !Array.isArray(project.json.pages)) {
    return false;
  }
  return project.json.pages.some((pageId) => {
    const page = project.json[pageId];
    return page && Array.isArray(page.sprites) && page.sprites.some((spriteId) => {
      const sprite = page[spriteId];
      return sprite && Array.isArray(sprite.scripts) && sprite.scripts.some((strip) => {
        return Array.isArray(strip)
          && strip.some((block) => Array.isArray(block) && block[0] === blockType);
      });
    });
  });
}

describe("project duplication", () => {
  it(
    "creates a uniquely named copy whose later saves do not change the original",
    async () => {
      const { browser, page, errors } = await openPage();

      try {
        const originalProjectId = await createProjectFromHome(page);
        await insertMotionBlock(page, ORIGINAL_BLOCK);
        await saveProject(page);
        const originalBeforeCopy = await readProjectRow(page, originalProjectId);

        await page.goto(`${HOST}/home.html?place=home`, { waitUntil: "networkidle2", timeout: 30_000 });
        const originalCard = `[id="${originalProjectId}"]`;
        await page.waitForSelector(`${originalCard} .project-duplicate-button`, { timeout: 30_000 });
        expect(await page.$eval(
          `${originalCard} .project-duplicate-button`,
          (button) => button.getAttribute("aria-label")
        )).toBe(`Duplicate project ${originalBeforeCopy.name}`);

        await page.click(`${originalCard} .project-duplicate-button`);
        await page.waitForFunction(
          (sourceId) => {
            const cards = Array.from(document.querySelectorAll(
              "#scrollarea .projectthumb:not(#newproject):not(#cloudproject)"
            ));
            return cards.length === 2 && cards.some((card) => card.id !== sourceId);
          },
          { timeout: 30_000 },
          originalProjectId
        );

        const duplicateProjectId = await page.evaluate((sourceId) => {
          const cards = Array.from(document.querySelectorAll(
            "#scrollarea .projectthumb:not(#newproject):not(#cloudproject)"
          ));
          const duplicate = cards.find((card) => card.id !== sourceId);
          return duplicate ? duplicate.id : null;
        }, originalProjectId);
        expect(duplicateProjectId).not.toBeNull();
        expect(duplicateProjectId).not.toBe(originalProjectId);

        const duplicateBeforeEdit = await readProjectRow(page, duplicateProjectId);
        expect(duplicateBeforeEdit.name).toBe("Project 2");
        expect(duplicateBeforeEdit.json).toEqual(originalBeforeCopy.json);
        expect(duplicateBeforeEdit.thumbnail).toEqual(originalBeforeCopy.thumbnail);
        expect(await page.$eval("#project-action-status", (status) => status.textContent)).toContain(
          `as ${duplicateBeforeEdit.name}`
        );

        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
          page.click(`[id="${duplicateProjectId}"] .card-action-open`),
        ]);
        await waitForEditorReady(page);
        expect(await page.evaluate(() => String(window.ScratchJr.currentProject))).toBe(duplicateProjectId);

        await insertMotionBlock(page, COPY_ONLY_BLOCK);
        await saveProject(page);

        const originalAfterCopyEdit = await readProjectRow(page, originalProjectId);
        const duplicateAfterEdit = await readProjectRow(page, duplicateProjectId);
        expect(projectHasBlock(originalAfterCopyEdit, ORIGINAL_BLOCK)).toBe(true);
        expect(projectHasBlock(originalAfterCopyEdit, COPY_ONLY_BLOCK)).toBe(false);
        expect(projectHasBlock(duplicateAfterEdit, ORIGINAL_BLOCK)).toBe(true);
        expect(projectHasBlock(duplicateAfterEdit, COPY_ONLY_BLOCK)).toBe(true);
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );
});
