import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('editions/free/src');
const MIME_TYPES = {
    '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
    '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.wasm': 'application/wasm'
};
let server;
let host;

beforeAll(async () => {
    server = http.createServer((request, response) => {
        const url = new URL(request.url, 'http://localhost');
        if (url.pathname === '/favicon.ico') {
            response.writeHead(204);
            response.end();
            return;
        }
        const file = path.join(ROOT, decodeURIComponent(url.pathname));
        fs.readFile(file, (error, data) => {
            response.writeHead(error ? 404 : 200, {
                'Content-Type': MIME_TYPES[path.extname(file)] || 'application/octet-stream'
            });
            response.end(error ? 'Missing test asset' : data);
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    host = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
});

describe('Marty colour sensing in the editor', () => {
    it('responds to a held colour quickly, without overlapping scripts or needing another change event', async () => {
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
        try {
            const page = await browser.newPage();
            await page.setViewport({width: 1440, height: 900, deviceScaleFactor: 2});
            const errors = [];
            page.on('pageerror', error => errors.push(error.message || String(error)));
            await page.goto(host + '/editor.html?mode=edit', {waitUntil: 'networkidle2'});
            await page.waitForFunction(() => {
                const backdrop = document.getElementById('backdrop');
                return window.ScratchJr?.stage?.currentPage && ScratchJr.getActiveScript() &&
                    !ScratchJr.onHold && backdrop && getComputedStyle(backdrop).display === 'none';
            });
            if (!await page.evaluate(() => ScratchJr.isMartyModeEnabled)) {
                await page.click('#martyMode');
            }
            await page.waitForFunction(() => ScratchJr.isMartyModeEnabled && ScratchJr.getActiveScript());
            await page.click('#marty-start');

            await page.evaluate(() => {
                const listeners = new Map();
                const marty = {
                    id: 'colour-sensing-test', isVerified: true, isConnected: true,
                    sentMessages: [], raftStateInfo: {addOnInfoValidMs: Date.now()},
                    sendRestMessage(message) { this.sentMessages.push({message, at: Date.now()}); },
                    publishedDataAnalyser: {
                        eventsMap: {colourSensed: Object.fromEntries(
                            ['red', 'green', 'blue', 'purple', 'yellow', 'air', 'unclear'].map(value => [value, value])
                        )},
                        martyState: {colourSensed: 'red'},
                        on(event, callback) { listeners.set(event, callback); },
                        removeListener(event, callback) {
                            if (listeners.get(event) === callback) listeners.delete(event);
                        }
                    }
                };
                window.__colourTestMarty = marty;
                window.__colourTestPackets = setInterval(() => {
                    marty.raftStateInfo.addOnInfoValidMs = Date.now();
                }, 50);
                window.martyManager.addMarty(marty);
                window.martyManager.wireMartyWithBlocks(marty.id);
                const scripts = ScratchJr.getActiveScript().owner;
                window.__redHead = scripts.insertKeyboardBlock(null, [
                    ['martycoloursensed', 'martycoloursensedred', 60, 40],
                    ['martyEyesWide', 'null', 140, 40]
                ]);
                window.__purpleHead = scripts.insertKeyboardBlock(null, [
                    ['martycoloursensed', 'martycoloursensedpurple', 60, 135],
                    ['martyEyesAngry', 'null', 140, 135]
                ]);
                window.__colourTestStarted = Date.now();
            });
            await page.waitForFunction(() => window.__colourTestMarty.sentMessages.length >= 1, {timeout: 1000});
            const first = await page.evaluate(() => window.__colourTestMarty.sentMessages[0]);
            expect(first.message).toBe('traj/eyesWide');
            expect(first.at - await page.evaluate(() => window.__colourTestStarted)).toBeLessThan(250);

            await new Promise(resolve => setTimeout(resolve, 300));
            expect(await page.evaluate(() => window.__colourTestMarty.sentMessages.length)).toBe(1);
            expect(await page.evaluate(() => ScratchJr.runtime.threadsRunning
                .filter(thread => thread.isRunning && thread.firstBlock === window.__redHead).length)).toBe(1);

            // The analyser emits no event at all. The held colour must restart
            // after the first script completes, rather than wait for a new edge.
            await page.waitForFunction(() => window.__colourTestMarty.sentMessages.length >= 2, {timeout: 1500});
            const messages = await page.evaluate(() => window.__colourTestMarty.sentMessages);
            expect(messages[1].message).toBe('traj/eyesWide');
            expect(messages[1].at - first.at).toBeGreaterThanOrEqual(900);
            expect(messages[1].at - first.at).toBeLessThan(1400);

            await page.evaluate(() => {
                window.__colourTestMarty.publishedDataAnalyser.martyState.colourSensed = 'purple';
                window.__colourTestChanged = Date.now();
            });
            await page.waitForFunction(() => window.__colourTestMarty.sentMessages
                .some(value => value.message === 'traj/eyesAngry'), {timeout: 1000});
            expect(await page.evaluate(() => window.__colourTestMarty.sentMessages
                .find(value => value.message === 'traj/eyesAngry').at - window.__colourTestChanged)).toBeLessThan(250);

            await page.evaluate(() => {
                clearInterval(window.__colourTestPackets);
                window.martyManager.removeMarty(window.__colourTestMarty);
                ScratchJr.runtime.stopThreads();
            });
            const countAfterDisconnect = await page.evaluate(() => window.__colourTestMarty.sentMessages.length);
            await new Promise(resolve => setTimeout(resolve, 200));
            expect(await page.evaluate(() => window.__colourTestMarty.sentMessages.length)).toBe(countAfterDisconnect);

            // Read the rendered canvas pixels rather than just inspecting SVG text.
            expect(await page.evaluate(() => {
                const canvas = window.__redHead.blockicon;
                const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i] === 229 && pixels[i + 1] === 31 && pixels[i + 2] === 38 && pixels[i + 3] === 255) {
                        return true;
                    }
                }
                return false;
            })).toBe(true);

            if (process.env.ITEM155_SCREENSHOT_DIR) {
                fs.mkdirSync(process.env.ITEM155_SCREENSHOT_DIR, {recursive: true});
                await page.screenshot({path: path.join(process.env.ITEM155_SCREENSHOT_DIR, 'editor.png')});
                const clip = await page.evaluate(() => {
                    const blocks = [window.__redHead, window.__redHead.next,
                        window.__purpleHead, window.__purpleHead.next];
                    const rects = blocks.map(block => block.div.getBoundingClientRect());
                    const x = Math.floor(Math.min(...rects.map(rect => rect.left)) - 16);
                    const y = Math.floor(Math.min(...rects.map(rect => rect.top)) - 16);
                    return {x, y, width: Math.ceil(Math.max(...rects.map(rect => rect.right)) - x + 16),
                        height: Math.ceil(Math.max(...rects.map(rect => rect.bottom)) - y + 16)};
                });
                await page.screenshot({path: path.join(process.env.ITEM155_SCREENSHOT_DIR, 'colour-event-blocks.png'), clip});
            }
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 60_000);
});
