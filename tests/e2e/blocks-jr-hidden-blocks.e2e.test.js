import { afterAll, beforeAll, describe, expect, it } from "vitest";
import puppeteer from "puppeteer";
import { spawn } from "child_process";
import http from "http";

const PORT = 3017;
const HOST = `http://localhost:${PORT}`;

let server;

const waitForServer = () =>
    new Promise((resolve, reject) => {
        const started = Date.now();

        const check = () => {
            http.get(HOST, res => {
                res.resume();
                resolve();
            }).on("error", err => {
                if (Date.now() - started > 10000) {
                    reject(err);
                } else {
                    setTimeout(check, 100);
                }
            });
        };

        check();
    });

const openEditor = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    const errors = [];

    page.on("pageerror", error => errors.push(error.message));
    page.on("console", msg => {
        if (msg.type() === "error") {
            errors.push(msg.text());
        }
    });

    await page.goto(`${HOST}/editor.html?mode=edit`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() =>
        window.ScratchJr &&
        ScratchJr.stage &&
        ScratchJr.stage.currentPage &&
        !ScratchJr.onHold &&
        ScratchJr.getActiveScript &&
        ScratchJr.getActiveScript()
    );

    return { browser, page, errors };
};

const addPinkOctopus = async page => {
    await page.evaluate(() => {
        ScratchJr.stage.currentPage.addSprite(0.5, "Sprites_Octopus-Pink.svg", "Octopus-Pink");
    });

    await page.waitForFunction(() => {
        const sprites = JSON.parse(ScratchJr.stage.currentPage.sprites);
        const spriteId = sprites.find(id => id.indexOf("Octopus-Pink") === 0);
        if (!spriteId) {
            return false;
        }

        const sprite = document.getElementById(spriteId);
        const script = document.getElementById(`${spriteId}_scripts`);
        const thumb = Array.from(document.querySelectorAll("#spritecc .spritethumb"))
            .find(node => node.owner === spriteId);

        return sprite && script && thumb;
    });

    return page.evaluate(() => {
        const sprites = JSON.parse(ScratchJr.stage.currentPage.sprites);
        return sprites.find(id => id.indexOf("Octopus-Pink") === 0);
    });
};

const setCurrentSprite = async (page, spriteId) => {
    await page.evaluate(id => {
        const sprite = document.getElementById(id).owner;
        ScratchJr.stage.currentPage.setCurrentSprite(sprite);
    }, spriteId);

    await page.waitForFunction(id =>
        ScratchJr.stage.currentPage.currentSpriteName === id,
    {}, spriteId);
};

const selectMotionCategory = async page => {
    await page.click("#sprite-motion");
    await page.waitForSelector("#forward_block", { visible: true });
};

const dragForwardBlockToCanvas = async page => {
    const source = await page.$eval("#forward_block", node => {
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
};

const clickSpriteThumb = async (page, spriteId) => {
    await page.click(`#spritecc .spritethumb[data-owner="${spriteId}"]`);
    await page.waitForFunction(id =>
        ScratchJr.stage.currentPage.currentSpriteName === id &&
        window.getComputedStyle(document.getElementById(`${id}_scripts`)).visibility === "visible",
    {}, spriteId);
};

const getSpriteScriptState = async (page, spriteId) =>
    page.evaluate(id => {
        const script = document.getElementById(`${id}_scripts`);
        const blockTypes = script.owner.getBlocks().map(block => block.blocktype);
        const visibleBlockTypes = script.owner.getBlocks()
            .filter(block => window.getComputedStyle(block.div).visibility !== "hidden")
            .map(block => block.blocktype);

        return {
            currentSpriteName: ScratchJr.stage.currentPage.currentSpriteName,
            activeScriptId: ScratchJr.getActiveScript().id,
            scriptVisibility: window.getComputedStyle(script).visibility,
            blockTypes,
            visibleBlockTypes
        };
    }, spriteId);

describe("Blocks Jr hidden block drop regression", () => {
    beforeAll(async () => {
        server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", "editions/free/src"], {
            stdio: "ignore"
        });
        await waitForServer();
    }, 15000);

    afterAll(() => {
        if (server) {
            server.kill();
        }
    });

    it("shows a dropped block when the current sprite changes outside the thumbnail path", async () => {
        const { browser, page, errors } = await openEditor();

        try {
            const octopusId = await addPinkOctopus(page);
            const martyId = await page.evaluate(() =>
                Array.from(document.querySelectorAll("#spritecc .spritethumb"))
                    .filter(node => node.owner && node.owner.indexOf("Marty ") === 0)
                    .find(node => window.getComputedStyle(node).display !== "none").owner
            );

            await clickSpriteThumb(page, martyId);
            await setCurrentSprite(page, octopusId);
            await selectMotionCategory(page);
            await dragForwardBlockToCanvas(page);

            await page.waitForFunction(id => {
                const script = document.getElementById(`${id}_scripts`);
                return script.owner.getBlocks().some(block => block.blocktype === "forward");
            }, {}, octopusId);

            const state = await getSpriteScriptState(page, octopusId);
            expect(state.currentSpriteName).toBe(octopusId);
            expect(state.activeScriptId).toBe(`${octopusId}_scripts`);
            expect(state.blockTypes).toContain("forward");
            expect(state.scriptVisibility).toBe("visible");
            expect(state.visibleBlockTypes).toContain("forward");
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60000);
});
