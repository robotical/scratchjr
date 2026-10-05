import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('editions/free/src');
const MIME_TYPES = {
    '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
    '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png',
    '.wasm': 'application/wasm'
};
let server;
let host;

beforeAll(async () => {
    server = http.createServer((request, response) => {
        const url = new URL(request.url, 'http://localhost');
        if (url.pathname === '/__host') {
            const tutorial = encodeURIComponent(url.searchParams.get('tutorial'));
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end('<!doctype html><html><body style="margin:0">' +
                '<object type="text/html" style="width:100%;height:100vh" ' +
                `data="/index.html?tutorial=${tutorial}"></object></body></html>`);
            return;
        }
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
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    host = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
});

async function getEditorFrame(page) {
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
        const frame = page.frames().find((candidate) => candidate.url().includes('/editor.html'));
        if (frame) {
            return frame;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error('Tutorial did not reach its editor document');
}

describe('tutorial startup waits for editor assets', () => {
    for (const tutorialId of ['cog-jrblocks-1', 'marty-jr-blocks-1']) {
        for (const embedded of [false, true]) {
            it(`${tutorialId} survives a delayed asset (${embedded ? 'embedded activity link' : 'direct editor'})`, async () => {
                const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
                let heldRequest;
                try {
                    const page = await browser.newPage();
                    await page.setViewport({width: 1022, height: 478, deviceScaleFactor: 2});
                    const errors = [];
                    page.on('pageerror', (error) => errors.push(error.message || String(error)));
                    page.on('console', (message) => {
                        if (message.type() === 'error') {
                            errors.push(message.text());
                        }
                    });
                    const assetHeld = new Promise((resolve) => {
                        page.on('request', (request) => {
                            if (request.url().endsWith('/assets/balloon.svg')) {
                                heldRequest = request;
                                resolve();
                            } else {
                                request.continue();
                            }
                        });
                    });
                    await page.setRequestInterception(true);
                    const entry = embedded ? `/__host?tutorial=${tutorialId}` :
                        `/editor.html?pmd5=-1&mode=edit&tutorial=${tutorialId}`;
                    await page.goto(host + entry, {waitUntil: 'domcontentloaded', timeout: 30_000});
                    // Wait until the editor really requests its blocking asset, then
                    // keep it blocked beyond the former one-second startup timer.
                    let assetTimeout;
                    try {
                        await Promise.race([
                            assetHeld,
                            new Promise((_, reject) => {
                                assetTimeout = setTimeout(() => reject(new Error('Asset was not requested')), 30_000);
                            })
                        ]);
                    } finally {
                        clearTimeout(assetTimeout);
                    }
                    const frame = await getEditorFrame(page);
                    await new Promise((resolve) => setTimeout(resolve, 1800));
                    expect(errors).toEqual([]);
                    expect(await frame.evaluate(() => Boolean(window.tutorialEngine))).toBe(false);
                    expect(await frame.$('#tutorialMenuBar')).toBeNull();

                    await heldRequest.continue();
                    heldRequest = null;
                    await frame.waitForFunction(() => {
                        const backdrop = document.getElementById('backdrop');
                        return window.tutorialEngine && window.ScratchJr.stage.currentPage &&
                            window.ScratchJr.getActiveScript() && backdrop &&
                            window.getComputedStyle(backdrop).display === 'none';
                    }, {timeout: 30_000});
                    expect(await frame.evaluate(() => window.tutorialEngine.tutorial.id)).toBe(tutorialId);
                    expect(await frame.$$('#tutorialMenuBar')).toHaveLength(1);
                    expect(await frame.$('#tutorialInstructor')).not.toBeNull();
                    expect(await frame.$eval('#tutorialTitle', (node) => node.textContent.trim()))
                        .not.toContain('String missing');
                    await frame.click('#nextStep');
                    await frame.waitForFunction(() => window.tutorialEngine.currentStep === 1);
                    expect(await frame.$eval('#tutorialProgressBar', (node) => node.textContent))
                        .toContain('2 /');
                    expect(errors).toEqual([]);
                } finally {
                    if (heldRequest) {
                        await heldRequest.abort().catch(() => {});
                    }
                    await browser.close();
                }
            }, 90_000);
        }
    }
});
