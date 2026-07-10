import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3020;
const HOST = `http://localhost:${PORT}`;

let server;
let sharedBrowser;

const waitForServer = () =>
    new Promise((resolve, reject) => {
        const started = Date.now();

        const check = () => {
            http.get(HOST, response => {
                response.resume();
                resolve();
            }).on("error", error => {
                if (Date.now() - started > 10000) {
                    reject(error);
                } else {
                    setTimeout(check, 100);
                }
            });
        };

        check();
    });

const openPage = async pathname => {
    const browser = await sharedBrowser.createIncognitoBrowserContext();
    const page = await browser.newPage();
    const errors = [];

    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
        if (message.type() === "error") {
            errors.push(message.text());
        }
    });

    await page.goto(`${HOST}${pathname}`, {
        waitUntil: "networkidle2",
        timeout: 30000
    });

    return { browser, page, errors };
};

const waitForEditorReady = async page => {
    await page.waitForFunction(() => {
        const backdrop = document.getElementById("backdrop");
        return window.ScratchJr &&
            ScratchJr.stage &&
            ScratchJr.stage.currentPage &&
            document.getElementById("martyMode") &&
            document.getElementById("emptypage") &&
            backdrop &&
            window.getComputedStyle(backdrop).display === "none" &&
            !ScratchJr.onHold &&
            ScratchJr.getActiveScript();
    }, { timeout: 30000 });
};

const createProjectFromHome = async page => {
    await page.waitForSelector("#newproject .card-action-open", { timeout: 30000 });
    await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }),
        page.click("#newproject .card-action-open")
    ]);
    await waitForEditorReady(page);
    return page.evaluate(() => ScratchJr.currentProject);
};

const getActiveScriptState = async page =>
    page.evaluate(() => {
        const script = ScratchJr.getActiveScript();
        const blocks = script.owner.getBlocks();
        return {
            pageId: ScratchJr.stage.currentPage.id,
            pageIds: ScratchJr.stage.getPagesID(),
            isMartyModeEnabled: ScratchJr.isMartyModeEnabled,
            spriteId: ScratchJr.stage.currentPage.currentSpriteName,
            scriptId: script.id,
            scriptVisibility: window.getComputedStyle(script).visibility,
            blockTypes: blocks.map(block => block.blocktype),
            visibleBlockTypes: blocks
                .filter(block => window.getComputedStyle(block.div).visibility !== "hidden")
                .map(block => block.blocktype)
        };
    });

const setMartyMode = async (page, enabled) => {
    const currentMode = await page.evaluate(() => ScratchJr.isMartyModeEnabled);
    if (currentMode !== enabled) {
        await page.click("#martyMode");
    }

    await page.waitForFunction(expected => {
        if (ScratchJr.isMartyModeEnabled !== expected || !ScratchJr.getActiveScript()) {
            return false;
        }
        const spriteId = ScratchJr.stage.currentPage.currentSpriteName || "";
        const isBirdsEye = spriteId.indexOf(ScratchJr.BIRDS_EYE_SPRITE_NAME) > -1;
        return expected ? isBirdsEye : !isBirdsEye;
    }, {}, enabled);
};

const reactivateCurrentMartyScript = async page => {
    const pageId = await page.evaluate(() => ScratchJr.stage.currentPage.id);
    await setMartyMode(page, false);
    await setMartyMode(page, true);
    await page.waitForFunction(expectedPageId => {
        const script = ScratchJr.getActiveScript();
        return ScratchJr.stage.currentPage.id === expectedPageId &&
            script &&
            window.getComputedStyle(script).visibility === "visible";
    }, {}, pageId);
};

const createSecondMartyPage = async page => {
    await setMartyMode(page, true);
    const pageOne = await getActiveScriptState(page);
    const pageCount = pageOne.pageIds.length;

    await page.click("#emptypage");
    await page.waitForFunction((firstPageId, count) =>
        ScratchJr.stage.pages.length === count + 1 &&
        ScratchJr.stage.currentPage.id !== firstPageId &&
        ScratchJr.isMartyModeEnabled &&
        ScratchJr.stage.currentPage.currentSpriteName &&
        ScratchJr.stage.currentPage.currentSpriteName.indexOf(ScratchJr.BIRDS_EYE_SPRITE_NAME) > -1 &&
        !ScratchJr.onHold &&
        ScratchJr.getActiveScript(),
    {}, pageOne.pageId, pageCount);

    return {
        pageOne,
        pageTwo: await getActiveScriptState(page)
    };
};

const selectPage = async (page, pageId) => {
    await page.click(`.pagethumb[data-owner="${pageId}"]`);
    await page.waitForFunction(id =>
        ScratchJr.stage.currentPage.id === id && ScratchJr.getActiveScript(),
    {}, pageId);
};

const dragBlockToCanvas = async (page, categorySelector, blockSelector, blockType) => {
    const blockCount = await page.evaluate(() => ScratchJr.getBlocks().length);
    await page.click(categorySelector);
    await page.waitForSelector(blockSelector, { visible: true });

    const source = await page.$eval(blockSelector, node => {
        const rect = node.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    });
    const target = await page.$eval("#scripts", node => {
        const rect = node.getBoundingClientRect();
        return {
            x: rect.left + Math.min(220, rect.width / 2),
            y: rect.top + Math.min(170, rect.height / 2)
        };
    });

    await page.mouse.move(source.x, source.y);
    await page.mouse.down();
    await page.mouse.move(target.x, target.y, { steps: 12 });
    await page.mouse.up();

    await page.waitForFunction((before, type) =>
        ScratchJr.getBlocks().length > before &&
        ScratchJr.getBlocks().some(block => block.blocktype === type),
    {}, blockCount, blockType);

    return getActiveScriptState(page);
};

const dragMartyBlock = page =>
    dragBlockToCanvas(page, "#marty-motion", "#martyStepForward_block", "martyStepForward");

const dragSpriteBlock = page =>
    dragBlockToCanvas(page, "#sprite-motion", "#forward_block", "forward");

const expectVisibleBlock = (state, blockType, pathName) => {
    expect(state.blockTypes, `${pathName}: ${JSON.stringify(state)}`).toContain(blockType);
    expect(state.scriptVisibility, `${pathName}: ${JSON.stringify(state)}`).toBe("visible");
    expect(state.visibleBlockTypes, `${pathName}: ${JSON.stringify(state)}`).toContain(blockType);
};

const readPersistedProject = async (page, projectId) =>
    page.evaluate(id => new Promise(resolve => {
        window.OS.query(
            { stmt: "select * from projects where id = ?", values: [Number(id)] },
            result => {
                const rows = JSON.parse(result);
                if (!rows.length) {
                    resolve(null);
                    return;
                }
                const row = Object.fromEntries(Object.entries(rows[0])
                    .map(([key, value]) => [key.toLowerCase(), value]));
                resolve(typeof row.json === "string" ? JSON.parse(row.json) : row.json);
            }
        );
    }), projectId);

const saveProject = async (page, projectId, currentPageId) => {
    await page.evaluate(() => new Promise(resolve => {
        ScratchJr.changed = true;
        ScratchJr.saveProject(null, resolve);
    }));

    const started = Date.now();
    while (Date.now() - started < 15000) {
        const project = await readPersistedProject(page, projectId);
        if (project && project.currentPage === currentPageId && project.pages.length === 2) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw new Error("Timed out waiting for the multi-page Marty project to persist");
};

describe("Marty script activation paths", () => {
    beforeAll(async () => {
        server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", "editions/free/src"], {
            stdio: "ignore"
        });
        await waitForServer();
        sharedBrowser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        });
    }, 30000);

    afterAll(async () => {
        if (sharedBrowser) {
            await sharedBrowser.close();
        }
        if (server) {
            server.kill();
        }
    });

    it("activates the script after duplicating a page in Marty mode", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            await setMartyMode(page, true);
            const source = await getActiveScriptState(page);

            await page.evaluate(pageId => ScratchJr.stage.duplicatePage(pageId), source.pageId);
            await page.waitForFunction((pageId, count) =>
                ScratchJr.stage.pages.length === count + 1 &&
                ScratchJr.stage.currentPage.id !== pageId &&
                !ScratchJr.stage.duplicatingPage &&
                !ScratchJr.onHold &&
                ScratchJr.getActiveScript(),
            {}, source.pageId, source.pageIds.length);

            expectVisibleBlock(await dragMartyBlock(page), "martyStepForward", "duplicate page");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates the remaining page script after deleting the current page", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            const { pageOne, pageTwo } = await createSecondMartyPage(page);

            await page.evaluate(pageId => ScratchJr.stage.deletePage(pageId), pageTwo.pageId);
            await page.waitForFunction(pageId =>
                ScratchJr.stage.pages.length === 1 &&
                ScratchJr.stage.currentPage.id === pageId &&
                ScratchJr.getActiveScript(),
            {}, pageOne.pageId);

            expectVisibleBlock(await dragMartyBlock(page), "martyStepForward", "delete current page");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates scripts after undoing and redoing page navigation", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            const { pageOne, pageTwo } = await createSecondMartyPage(page);
            await selectPage(page, pageOne.pageId);
            await reactivateCurrentMartyScript(page);

            await page.click("#id_undo");
            await page.waitForFunction(pageId => ScratchJr.stage.currentPage.id === pageId,
                {}, pageTwo.pageId);
            const undoState = await getActiveScriptState(page);

            await reactivateCurrentMartyScript(page);
            await page.click("#id_redo");
            await page.waitForFunction(pageId => ScratchJr.stage.currentPage.id === pageId,
                {}, pageOne.pageId);
            const redoState = await dragMartyBlock(page);

            expect({
                undo: undoState.scriptVisibility,
                redo: redoState.scriptVisibility
            }).toEqual({ undo: "visible", redo: "visible" });
            expectVisibleBlock(redoState, "martyStepForward", "redo page navigation");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates scripts after undoing and redoing page ordering", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            const { pageOne, pageTwo } = await createSecondMartyPage(page);

            await page.evaluate(pageId => {
                const thumb = document.querySelector(`.pagethumb[data-owner="${pageId}"]`);
                thumb.dispatchEvent(new KeyboardEvent("keydown", {
                    key: "ArrowLeft",
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true
                }));
            }, pageTwo.pageId);
            await page.waitForFunction(pageId => ScratchJr.stage.getPagesID()[0] === pageId,
                {}, pageTwo.pageId);

            await page.click("#id_undo");
            await page.waitForFunction((firstId, currentId) =>
                ScratchJr.stage.getPagesID()[0] === firstId &&
                ScratchJr.stage.currentPage.id === currentId,
            {}, pageOne.pageId, pageTwo.pageId);
            const undoState = await getActiveScriptState(page);

            await reactivateCurrentMartyScript(page);
            await page.click("#id_redo");
            await page.waitForFunction((firstId, currentId) =>
                ScratchJr.stage.getPagesID()[0] === firstId &&
                ScratchJr.stage.currentPage.id === currentId,
            {}, pageTwo.pageId, pageTwo.pageId);
            const redoState = await dragMartyBlock(page);

            expect({
                undo: undoState.scriptVisibility,
                redo: redoState.scriptVisibility
            }).toEqual({ undo: "visible", redo: "visible" });
            expectVisibleBlock(redoState, "martyStepForward", "redo page ordering");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates scripts when undoing and redoing a page deletion", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            const { pageOne, pageTwo } = await createSecondMartyPage(page);

            await page.evaluate(pageId => ScratchJr.stage.deletePage(pageId), pageTwo.pageId);
            await page.waitForFunction(pageId =>
                ScratchJr.stage.pages.length === 1 && ScratchJr.stage.currentPage.id === pageId,
            {}, pageOne.pageId);
            await reactivateCurrentMartyScript(page);

            await page.click("#id_undo");
            await page.waitForFunction(() =>
                ScratchJr.stage.pages.length === 2 &&
                document.getElementById("id_redo").className.indexOf("enable") > -1 &&
                ScratchJr.getActiveScript());
            await page.waitFor(1000);
            const undoState = await getActiveScriptState(page);

            await page.click("#id_redo");
            await page.waitForFunction(pageId =>
                ScratchJr.stage.pages.length === 1 &&
                ScratchJr.stage.currentPage.id === pageId &&
                ScratchJr.getActiveScript(),
            {}, pageOne.pageId);
            await page.waitFor(500);
            const redoState = await (await page.evaluate(() => ScratchJr.isMartyModeEnabled) ?
                dragMartyBlock(page) : dragSpriteBlock(page));

            expect({
                undo: undoState.scriptVisibility,
                redo: redoState.scriptVisibility
            }).toEqual({
                undo: "visible",
                redo: "visible"
            });
            expectVisibleBlock(
                redoState,
                redoState.isMartyModeEnabled ? "martyStepForward" : "forward",
                "redo page deletion"
            );
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates the destination script after a go-to-page transition", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            const { pageOne } = await createSecondMartyPage(page);

            await page.evaluate(() => ScratchJr.stage.gotoPage(1));
            await page.waitForFunction(pageId => ScratchJr.stage.currentPage.id === pageId,
                {}, pageOne.pageId);

            expectVisibleBlock(await dragMartyBlock(page), "martyStepForward", "go to page");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates the destination script after fullscreen page navigation", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            const { pageOne } = await createSecondMartyPage(page);

            await page.click("#full");
            await page.waitForFunction(() => ScratchJr.inFullscreen);
            await page.$eval("#prevpage", button => button.click());
            await page.waitForFunction(pageId => ScratchJr.stage.currentPage.id === pageId,
                {}, pageOne.pageId);
            await page.$eval("#full", button => button.click());
            await page.waitForFunction(() => !ScratchJr.inFullscreen);

            expectVisibleBlock(await dragMartyBlock(page), "martyStepForward", "fullscreen navigation");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);

    it("activates the saved current script after reloading a multi-page Marty project", async () => {
        const { browser, page, errors } = await openPage("/home.html?place=home");
        try {
            const projectId = await createProjectFromHome(page);
            const { pageOne } = await createSecondMartyPage(page);
            await selectPage(page, pageOne.pageId);
            await reactivateCurrentMartyScript(page);
            expectVisibleBlock(await dragMartyBlock(page), "martyStepForward", "pre-save state");
            await saveProject(page, projectId, pageOne.pageId);

            await page.reload({ waitUntil: "networkidle2", timeout: 30000 });
            await waitForEditorReady(page);
            await page.waitForFunction(pageId =>
                ScratchJr.stage.currentPage.id === pageId && ScratchJr.isMartyModeEnabled,
            {}, pageOne.pageId);

            expectVisibleBlock(await dragMartyBlock(page), "martyStepForward", "project reload");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 120000);

    it("reactivates the original script after duplicate-page error recovery", async () => {
        const { browser, page, errors } = await openPage("/editor.html?mode=edit");
        try {
            await waitForEditorReady(page);
            await setMartyMode(page, false);
            const source = await getActiveScriptState(page);

            const recovery = await page.evaluate(pageId => {
                const pages = ScratchJr.stage.pages;
                const originalPush = pages.push;
                pages.push = function () {
                    throw new Error("injected duplicate-page failure");
                };
                try {
                    ScratchJr.stage.duplicatePage(pageId);
                    return { caught: false };
                } catch (error) {
                    return {
                        caught: true,
                        message: error.message,
                        currentPageId: ScratchJr.stage.currentPage.id
                    };
                } finally {
                    pages.push = originalPush;
                }
            }, source.pageId);

            expect(recovery).toMatchObject({
                caught: true,
                message: "injected duplicate-page failure",
                currentPageId: source.pageId
            });
            await page.waitForFunction(pageId =>
                ScratchJr.stage.currentPage.id === pageId &&
                !ScratchJr.stage.duplicatingPage &&
                !ScratchJr.onHold,
            {}, source.pageId);

            expectVisibleBlock(await dragSpriteBlock(page), "forward", "duplicate error recovery");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);
});
