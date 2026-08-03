import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import puppeteer from 'puppeteer';
import {spawn} from 'child_process';
import http from 'http';

const PORT = 3031;
const HOST = `http://localhost:${PORT}`;

let server;

async function waitForServer(maxAttempts = 20) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const ok = await new Promise((resolve) => {
            const req = http.get(`${HOST}/`, (res) => {
                res.destroy();
                resolve(true);
            });
            req.on('error', () => resolve(false));
        });
        if (ok) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error('Local server did not start in time');
}

async function waitForEditorReady(page) {
    await page.waitForFunction(() => {
        const backdrop = document.getElementById('backdrop');
        return Boolean(
            window.ScratchJr &&
            ScratchJr.stage &&
            ScratchJr.stage.currentPage &&
            ScratchJr.getActiveScript() &&
            window.cogManager &&
            backdrop &&
            window.getComputedStyle(backdrop).display === 'none'
        );
    }, {timeout: 30_000});
}

beforeAll(async () => {
    server = spawn('python3', ['-m', 'http.server', `${PORT}`, '--directory', 'editions/free/src'], {
        stdio: 'ignore'
    });
    await waitForServer();
}, 30_000);

afterAll(() => {
    if (server) {
        server.kill();
    }
});

describe('Cog rest beats', () => {
    it('accepts 1-9 in the editor and executes a nine-beat rest at the selected tempo', async () => {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        const errors = [];

        page.on('pageerror', (error) => errors.push(error.message || String(error)));
        page.on('console', (message) => {
            if (message.type() === 'error') {
                errors.push(message.text());
            }
        });

        try {
            await page.goto(`${HOST}/editor.html?mode=edit`, {
                waitUntil: 'networkidle2',
                timeout: 30_000
            });
            await waitForEditorReady(page);

            const initialState = await page.evaluate(() => {
                const eventsMap = {
                    tilt: {left: 'tilt-left', right: 'tilt-right', forward: 'tilt-forward', backward: 'tilt-backward'},
                    movementType: {shake: 'shake'},
                    buttonClick: {click: 'button-click'},
                    lightSense: {high: 'light-high', mid: 'light-mid', low: 'light-low'},
                    objectSense: {right: 'object-right', left: 'object-left', none: 'object-none'},
                    steering: {right: 'steering-right', left: 'steering-left'}
                };
                const cog = {
                    id: 'cog-rest-test',
                    sentMessages: [],
                    sendRestMessage(message) {
                        this.sentMessages.push(message);
                    },
                    publishedDataAnalyser: {
                        eventsMap,
                        on() {},
                        removeListener() {}
                    }
                };
                window.cogManager.addCog(cog);
                window.cogManager.wireCogWithBlocks(cog.id);
                window.__cogRestTestCog = cog;

                const scripts = ScratchJr.getActiveScript().owner;
                const head = scripts.insertKeyboardBlock(null, [
                    ['onflag', 'null', 50, 50],
                    ['waitcrotchet', '1', 50, 116]
                ]);
                window.__cogRestTestHead = head;
                window.__cogRestTestBlock = head.next;
                return {
                    blockType: head.next.blocktype,
                    value: head.next.getArgValue(),
                    min: head.next.min,
                    max: head.next.max
                };
            });

            expect(initialState).toEqual({
                blockType: 'waitcrotchet',
                value: '1',
                min: 1,
                max: 9
            });

            const numberField = '#scriptscontainer .numfield h3';
            await page.waitForSelector(numberField);
            await page.click(numberField);
            await page.keyboard.press('9');
            await page.keyboard.press('0');

            expect(await page.evaluate(() => ({
                value: window.__cogRestTestBlock.getArgValue(),
                text: window.__cogRestTestBlock.arg.input.textContent,
                keypadClass: document.querySelector('.picokeyboard').className
            }))).toEqual({
                value: '9',
                text: '9',
                keypadClass: 'picokeyboard on'
            });

            const runtimeState = await page.evaluate(() => {
                ScratchJr.editDone();
                ScratchJr.runtime.stopThreads();
                const thread = ScratchJr.runtime.restartThread(
                    ScratchJr.getSprite(),
                    window.__cogRestTestHead
                );
                const threadIndex = ScratchJr.runtime.threadsRunning.indexOf(thread);

                ScratchJr.runtime.step(threadIndex);
                const initialWaitTimer = thread.waitTimer;
                let ticksUntilComplete = 0;
                while (thread.isRunning && ticksUntilComplete < 200) {
                    ScratchJr.runtime.step(threadIndex);
                    ticksUntilComplete += 1;
                }

                return {
                    initialWaitTimer,
                    ticksUntilComplete,
                    threadCompleted: !thread.isRunning,
                    sentMessages: window.__cogRestTestCog.sentMessages
                };
            });

            expect(runtimeState).toEqual({
                initialWaitTimer: 139.625,
                ticksUntilComplete: 141,
                threadCompleted: true,
                sentMessages: []
            });
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60_000);
});
