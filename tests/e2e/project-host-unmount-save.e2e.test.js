import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3028;
const HOST = `http://localhost:${PORT}`;
const BLOCK_TYPE = "back";

let server;
let browser;

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
  browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
}, 30_000);

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
  if (server) {
    server.kill();
  }
});

async function waitForEditorReady(page) {
  await page.waitForFunction(
    () => {
      const child = document.getElementById("blocks-jr")?.contentWindow;
      const backdrop = child?.document.getElementById("backdrop");
      return Boolean(
        child
          && child.ScratchJr
          && child.ScratchJr.stage
          && child.ScratchJr.stage.currentPage
          && child.document.getElementById("sprite-motion")
          && backdrop
          && child.getComputedStyle(backdrop).display === "none"
          && !child.ScratchJr.onHold
          && child.ScratchJr.getActiveScript()
      );
    },
    { timeout: 30_000 }
  );
}

async function createProjectFromHome(page) {
  await page.goto(`${HOST}/404.html`, { waitUntil: "load", timeout: 30_000 });
  await page.setContent('<object id="blocks-jr" type="text/html" data="/home.html?place=home"></object>');
  await page.waitForFunction(
    () => Boolean(
      document.getElementById("blocks-jr")?.contentDocument
        ?.querySelector("#newproject .card-action-open")
    ),
    { timeout: 30_000 }
  );
  await page.evaluate(() => {
    document.getElementById("blocks-jr").contentDocument
      .querySelector("#newproject .card-action-open").click();
  });
  await waitForEditorReady(page);
  return page.evaluate(
    () => document.getElementById("blocks-jr").contentWindow.ScratchJr.currentProject
  );
}

async function insertMotionBlock(page) {
  await page.evaluate(() => {
    document.getElementById("blocks-jr").contentDocument
      .getElementById("sprite-motion").click();
  });
  await page.waitForFunction(
    (blockType) => Boolean(
      document.getElementById("blocks-jr")?.contentDocument
        ?.querySelector(`#palette [data-blocktype="${blockType}"]`)
    ),
    { timeout: 30_000 },
    BLOCK_TYPE
  );
  await page.evaluate((blockType) => {
    const child = document.getElementById("blocks-jr").contentWindow;
    const blockElement = child.document
      .querySelector(`#palette [data-blocktype="${blockType}"]`);
    child.Palette.insertBlockFromKeyboard(
      blockElement,
      new child.Event("host-unmount-save-test")
    );
  }, BLOCK_TYPE);
  await page.waitForFunction(
    (blockType) => document.getElementById("blocks-jr").contentWindow.ScratchJr
      .getBlocks().some((block) => block.blocktype === blockType),
    { timeout: 30_000 },
    BLOCK_TYPE
  );
}

async function saveCurrentProject(page) {
  return page.evaluate(() => new Promise((resolve) => {
    const child = document.getElementById("blocks-jr").contentWindow;
    child.ScratchJr.changed = true;
    child.ScratchJr.saveProject(null, resolve);
  }));
}

async function readProjectRow(page, projectId) {
  return page.evaluate((id) => new Promise((resolve) => {
    const child = document.getElementById("blocks-jr").contentWindow;
    child.OS.query(
      { stmt: "select * from projects where id = ?", values: [Number(id)] },
      (result) => {
        const rows = JSON.parse(result);
        const row = Object.fromEntries(
          Object.entries(rows[0]).map(([key, value]) => [key.toLowerCase(), value])
        );
        row.json = typeof row.json === "string" ? JSON.parse(row.json) : row.json;
        resolve(row);
      }
    );
  }), projectId);
}

async function replaceEditorObject(page, projectId) {
  await page.evaluate((id) => {
    document.getElementById("blocks-jr").remove();
    const replacement = document.createElement("object");
    replacement.id = "blocks-jr";
    replacement.type = "text/html";
    replacement.data = `/editor.html?pmd5=${id}&mode=edit`;
    document.body.appendChild(replacement);
  }, projectId);
  await waitForEditorReady(page);
}

describe("project persistence across host-style unmount", () => {
  it(
    "persists a recent edit when the embedding host removes the editor document",
    async () => {
      const page = await browser.newPage();
      const errors = [];

      page.on("pageerror", (error) => errors.push(error.message || String(error)));
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push(message.text());
        }
      });

      try {
        const projectId = await createProjectFromHome(page);
        await insertMotionBlock(page);

        // This is the same operation React performs after the host Back handler
        // calls navigate("/"): the embedded Blocks Jr document is destroyed.
        await replaceEditorObject(page, projectId);

        const blockWasPersisted = await page.evaluate(
          (blockType) => document.getElementById("blocks-jr").contentWindow.ScratchJr
            .getBlocks().some((block) => block.blocktype === blockType),
          BLOCK_TYPE
        );
        expect(blockWasPersisted).toBe(true);
        expect(errors).toEqual([]);
      } finally {
        await page.close().catch(() => {});
      }
    },
    120_000
  );

  it(
    "does not replay an older recovery journal over a newer database save",
    async () => {
      const page = await browser.newPage();
      const errors = [];

      page.on("pageerror", (error) => errors.push(error.message || String(error)));
      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push(message.text());
        }
      });

      try {
        const projectId = await createProjectFromHome(page);
        expect(await saveCurrentProject(page)).toBe(true);
        const olderRow = await readProjectRow(page, projectId);

        await insertMotionBlock(page);
        expect(await saveCurrentProject(page)).toBe(true);
        const newerRow = await readProjectRow(page, projectId);

        await page.evaluate(({ id, oldProject, projectCtime, savedAt }) => {
          localStorage.setItem(`scratchjrProjectRecovery:${id}`, JSON.stringify({
            id: String(id),
            json: oldProject,
            projectCtime,
            savedAt,
            version: 1,
          }));
        }, {
          id: projectId,
          oldProject: olderRow.json,
          projectCtime: newerRow.ctime ? String(newerRow.ctime) : null,
          savedAt: Number(newerRow.mtime) - 1,
        });

        await replaceEditorObject(page, projectId);

        const result = await page.evaluate((blockType) => {
          const child = document.getElementById("blocks-jr").contentWindow;
          return {
            blockWasPersisted: child.ScratchJr.getBlocks()
              .some((block) => block.blocktype === blockType),
            recoverySnapshot: localStorage.getItem(
              `scratchjrProjectRecovery:${child.ScratchJr.currentProject}`
            ),
          };
        }, BLOCK_TYPE);
        expect(result).toEqual({
          blockWasPersisted: true,
          recoverySnapshot: null,
        });
        expect(errors).toEqual([]);
      } finally {
        await page.close().catch(() => {});
      }
    },
    120_000
  );
});
