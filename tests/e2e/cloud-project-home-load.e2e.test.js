import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3029;
const HOST = `http://localhost:${PORT}`;
const FIREBASE_ORIGIN = "https://blocksjr-projects-default-rtdb.firebaseio.com/";
const CLOUD_IDS_STORAGE_KEY = "scratchjr.cloud.customIds";

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

function jsonResponse(body) {
  return {
    status: 200,
    contentType: "application/json",
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

async function installFirebaseStub(page, state) {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (!url.startsWith(FIREBASE_ORIGIN)) {
      request.continue();
      return;
    }

    const method = request.method().toUpperCase();
    state.requests.push({ method, url });
    if (method === "OPTIONS") {
      request.respond(jsonResponse(null));
      return;
    }
    if (method === "POST") {
      state.cloudRecord = JSON.parse(request.postData());
      request.respond(jsonResponse({ name: "e2e-cloud-project" }));
      return;
    }
    if (method === "PUT") {
      if (state.failLastAccessedUpdate) {
        request.abort("failed");
        return;
      }
      request.respond(jsonResponse(null));
      return;
    }
    if (method === "GET") {
      const requestedIdParameter = new URL(url).searchParams.get("equalTo");
      const requestedId = requestedIdParameter ? JSON.parse(requestedIdParameter) : null;
      if (!state.cloudRecord || requestedId !== state.cloudRecord.custom_id) {
        request.respond(jsonResponse(null));
        return;
      }

      const record = JSON.parse(JSON.stringify(state.cloudRecord));
      const project = JSON.parse(record.packageData.project);
      project.version = "legacy-e2e-version";
      record.packageData.project = JSON.stringify(project);
      request.respond(jsonResponse({ "e2e-cloud-project": record }));
      return;
    }
    request.abort();
  });
}

async function openPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [];
  const state = {
    cloudRecord: null,
    requests: [],
    failLastAccessedUpdate: false,
    blockedLastAccessErrors: 0,
  };

  page.on("pageerror", (err) => errors.push(err.message || String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      if (state.failLastAccessedUpdate && msg.text().includes("Failed to load resource: net::ERR_FAILED")) {
        state.blockedLastAccessErrors += 1;
        return;
      }
      errors.push(msg.text());
    }
  });
  await installFirebaseStub(page, state);
  await page.goto(`${HOST}/home.html?place=home`, { waitUntil: "networkidle2", timeout: 30_000 });
  return { browser, page, errors, state };
}

async function waitForEditorReady(page, timeout = 30_000) {
  await page.waitForFunction(
    () => {
      const backdrop = document.getElementById("backdrop");
      return Boolean(
        window.ScratchJr
          && window.ScratchJr.stage
          && window.ScratchJr.stage.currentPage
          && document.getElementById("projectinfo")
          && backdrop
          && window.getComputedStyle(backdrop).display === "none"
          && !window.ScratchJr.onHold
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

async function saveCurrentProjectToCloud(page) {
  await page.click("#projectinfo");
  await page.waitForSelector("#infobox.fade.in", { timeout: 30_000 });
  await page.click("#cloudToggleSave");
  await page.click("#infoboxCloudSave");
  await page.waitForFunction(
    (storageKey) => {
      const entries = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      return entries.length === 1;
    },
    { timeout: 30_000 },
    CLOUD_IDS_STORAGE_KEY
  );
  return page.evaluate((storageKey) => {
    return JSON.parse(window.localStorage.getItem(storageKey))[0].customId;
  }, CLOUD_IDS_STORAGE_KEY);
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
        resolve(Object.fromEntries(
          Object.entries(rows[0]).map(([key, value]) => [key.toLowerCase(), value])
        ));
      }
    );
  }), projectId);
}

describe("cloud project loading from My Projects", () => {
  it(
    "imports typed and saved cloud IDs, removes stale entries, and ignores tracking failures",
    async () => {
      const { browser, page, errors, state } = await openPage();

      try {
        const originalProjectId = await createProjectFromHome(page);
        const originalProject = await readProjectRow(page, originalProjectId);
        const generatedCustomId = await saveCurrentProjectToCloud(page);
        expect(generatedCustomId).toHaveLength(3);
        expect(state.cloudRecord).not.toBeNull();

        // Existing cloud projects can have the previously generated eight-character IDs.
        // Keep loading independent of the length currently used for new IDs.
        const legacyCustomId = "Ab3Def8Z";
        state.cloudRecord.custom_id = legacyCustomId;
        state.cloudRecord.packageData.custom_id = legacyCustomId;

        await page.evaluate((storageKey) => window.localStorage.removeItem(storageKey), CLOUD_IDS_STORAGE_KEY);
        await page.goto(`${HOST}/home.html?place=home`, { waitUntil: "networkidle2", timeout: 30_000 });
        await page.waitForSelector("#cloudproject .card-action-open", { timeout: 30_000 });
        await page.click("#cloudproject .card-action-open");
        await page.waitForSelector("#cloud-project-load-dialog[role='dialog']", { timeout: 10_000 });
        expect(await page.$eval(".cloud-project-saved-empty", (element) => element.textContent)).toContain(
          "No saved cloud IDs"
        );

        await page.type("#cloud-project-id-input", legacyCustomId);
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
          page.click("#cloud-project-load-submit"),
        ]);
        await waitForEditorReady(page);

        const importedProjectId = await page.evaluate(() => String(window.ScratchJr.currentProject));
        const importedProject = await readProjectRow(page, importedProjectId);
        expect(importedProjectId).not.toBe(originalProjectId);
        expect(importedProject.name).toBe(originalProject.name);
        expect(importedProject.version).toBe(await page.evaluate(() => window.Settings.scratchJrVersion));

        await page.goto(`${HOST}/home.html?place=home`, { waitUntil: "networkidle2", timeout: 30_000 });
        await page.waitForSelector("#cloudproject .card-action-open", { timeout: 30_000 });
        expect(await page.$$eval(
          "#scrollarea .projectthumb:not(#newproject):not(#cloudproject)",
          (cards) => cards.length
        )).toBe(2);

        await page.click("#cloudproject .card-action-open");
        await page.waitForSelector(`.cloud-project-saved-button[data-cloud-id='${legacyCustomId}']`, {
          timeout: 10_000,
        });

        const updateRequestsBeforeSavedLoad = state.requests.filter(({ method }) => method === "PUT").length;
        state.failLastAccessedUpdate = true;
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30_000 }),
          page.click(`.cloud-project-saved-button[data-cloud-id='${legacyCustomId}']`),
        ]);
        await waitForEditorReady(page);

        const savedButtonImportId = await page.evaluate(() => String(window.ScratchJr.currentProject));
        expect(savedButtonImportId).not.toBe(originalProjectId);
        expect(savedButtonImportId).not.toBe(importedProjectId);
        expect((await readProjectRow(page, savedButtonImportId)).name).toBe(originalProject.name);
        expect(state.requests.filter(({ method }) => method === "PUT").length)
          .toBeGreaterThan(updateRequestsBeforeSavedLoad);
        expect(state.blockedLastAccessErrors).toBeGreaterThan(0);

        state.failLastAccessedUpdate = false;
        await page.evaluate((storageKey) => {
          const entries = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
          entries.push({
            customId: "missing-id",
            projectName: "Unavailable project",
            savedAt: Date.now(),
            lastUsed: Date.now(),
          });
          window.localStorage.setItem(storageKey, JSON.stringify(entries));
        }, CLOUD_IDS_STORAGE_KEY);
        await page.goto(`${HOST}/home.html?place=home`, { waitUntil: "networkidle2", timeout: 30_000 });
        await page.waitForSelector("#cloudproject .card-action-open", { timeout: 30_000 });
        expect(await page.$$eval(
          "#scrollarea .projectthumb:not(#newproject):not(#cloudproject)",
          (cards) => cards.length
        )).toBe(3);

        await page.click("#cloudproject .card-action-open");
        await page.waitForSelector("#cloud-project-load-dialog[role='dialog']", { timeout: 10_000 });
        await page.waitForSelector(".cloud-project-saved-button[data-cloud-id='missing-id']", {
          timeout: 10_000,
        });
        await page.click(".cloud-project-saved-button[data-cloud-id='missing-id']");
        await page.waitForFunction(
          () => {
            const status = document.getElementById("cloud-project-load-status");
            return status && status.getAttribute("role") === "alert" &&
              status.textContent.includes("no longer available");
          },
          { timeout: 10_000 }
        );
        expect(await page.$("#cloud-project-load-dialog")).not.toBeNull();
        expect(await page.$eval("#cloud-project-id-input", (input) => input.disabled)).toBe(false);

        await page.click(".cloud-project-saved-remove[data-cloud-id='missing-id']");
        expect(await page.$(".cloud-project-saved-button[data-cloud-id='missing-id']")).toBeNull();
        expect(await page.$(".cloud-project-saved-remove[data-cloud-id='missing-id']")).toBeNull();
        expect(await page.$(`.cloud-project-saved-button[data-cloud-id='${legacyCustomId}']`)).not.toBeNull();
        expect(await page.evaluate((storageKey) => {
          const entries = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
          return entries.some((entry) => entry.customId === "missing-id");
        }, CLOUD_IDS_STORAGE_KEY)).toBe(false);
        expect(await page.$eval("#cloud-project-load-status", (element) => element.textContent))
          .toContain("Saved cloud ID removed");
        expect(errors).toEqual([]);
      } finally {
        await browser.close();
      }
    },
    120_000
  );
});
