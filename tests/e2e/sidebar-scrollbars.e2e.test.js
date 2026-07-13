import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 3022;
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

async function openEditor() {
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
    await page.goto(`${HOST}/editor.html?mode=edit`, {
        waitUntil: 'networkidle2',
        timeout: 30_000
    });
    await page.waitForFunction(() => {
        const backdrop = document.getElementById('backdrop');
        return Boolean(
            window.ScratchJr &&
            window.ScratchJr.stage &&
            document.getElementById('spritecc') &&
            document.getElementById('pagecc') &&
            document.getElementById('scrollbar') &&
            document.getElementById('pagescrollbar') &&
            backdrop &&
            window.getComputedStyle(backdrop).display === 'none'
        );
    }, { timeout: 30_000 });
    return { browser, page, errors };
}

describe('editor sidebar scrollbars', () => {
    it('shows and synchronizes persistent scrollbars when sprites and pages overflow', async () => {
        const { browser, page, errors } = await openEditor();

        try {
            const naturalSpriteState = await page.evaluate(() => {
                const spriteContainer = document.getElementById('spriteScrollContainer');
                const addSprite = document.getElementById('addsprite');
                return {
                    addButtonScrollsWithPanel: addSprite.parentNode === spriteContainer,
                    overflow: spriteContainer.scrollHeight - spriteContainer.clientHeight,
                    scrollbarVisible: document.getElementById('scrollbar').classList.contains('on')
                };
            });
            expect(naturalSpriteState.addButtonScrollsWithPanel).toBe(true);
            if (naturalSpriteState.overflow <= 1) {
                expect(naturalSpriteState.scrollbarVisible).toBe(false);
            }

            await page.evaluate(() => {
                const spriteSpacer = document.createElement('div');
                spriteSpacer.id = 'sprite-scroll-test-spacer';
                spriteSpacer.style.height = '800px';
                document.getElementById('spritecc').appendChild(spriteSpacer);

                const pageSpacer = document.createElement('div');
                pageSpacer.id = 'page-scroll-test-spacer';
                pageSpacer.style.height = '800px';
                document.getElementById('pagelist').appendChild(pageSpacer);
            });

            await page.waitForFunction(() =>
                document.getElementById('scrollbar').classList.contains('on') &&
                document.getElementById('pagescrollbar').classList.contains('on')
            );

            const initialState = await page.evaluate(() => ({
                spriteRole: document.getElementById('scrollbar').getAttribute('role'),
                spriteLabel: document.getElementById('scrollbar').getAttribute('aria-label'),
                spriteControls: document.getElementById('scrollbar').getAttribute('aria-controls'),
                pageRole: document.getElementById('pagescrollbar').getAttribute('role'),
                pageLabel: document.getElementById('pagescrollbar').getAttribute('aria-label'),
                pageControls: document.getElementById('pagescrollbar').getAttribute('aria-controls'),
                spriteThumbHeight: document.getElementById('sbthumb').offsetHeight,
                pageThumbHeight: document.getElementById('pagesbthumb').offsetHeight,
                addSpriteTop: document.getElementById('addsprite').getBoundingClientRect().top
            }));
            expect(initialState).toEqual({
                spriteRole: 'scrollbar',
                spriteLabel: 'Characters',
                spriteControls: 'spriteScrollContainer',
                pageRole: 'scrollbar',
                pageLabel: 'Pages',
                pageControls: 'pagecc',
                spriteThumbHeight: expect.any(Number),
                pageThumbHeight: expect.any(Number),
                addSpriteTop: expect.any(Number)
            });
            expect(initialState.spriteThumbHeight).toBeGreaterThan(0);
            expect(initialState.pageThumbHeight).toBeGreaterThan(0);

            await page.evaluate(() => {
                const spriteContainer = document.querySelector('#library .spritethumbs');
                const pageContainer = document.getElementById('pagecc');
                spriteContainer.scrollTop = spriteContainer.scrollHeight;
                pageContainer.scrollTop = pageContainer.scrollHeight;
            });
            await page.waitForFunction(() =>
                Number(document.getElementById('scrollbar').getAttribute('aria-valuenow')) > 0 &&
                Number(document.getElementById('pagescrollbar').getAttribute('aria-valuenow')) > 0
            );

            const scrolledState = await page.evaluate(() => ({
                spriteThumbTop: document.getElementById('sbthumb').offsetTop,
                pageThumbTop: document.getElementById('pagesbthumb').offsetTop,
                spriteValue: Number(document.getElementById('scrollbar').getAttribute('aria-valuenow')),
                pageValue: Number(document.getElementById('pagescrollbar').getAttribute('aria-valuenow')),
                addSpriteTop: document.getElementById('addsprite').getBoundingClientRect().top
            }));
            expect(scrolledState.spriteThumbTop).toBeGreaterThan(0);
            expect(scrolledState.pageThumbTop).toBeGreaterThan(0);
            expect(scrolledState.spriteValue).toBeGreaterThan(0);
            expect(scrolledState.pageValue).toBeGreaterThan(0);
            expect(scrolledState.addSpriteTop).toBeLessThan(initialState.addSpriteTop);

            await page.evaluate(() => {
                document.getElementById('pagecc').scrollTop = 0;
            });
            const pageScrollBar = await page.$('#pagescrollbar');
            const pageScrollBarBox = await pageScrollBar.boundingBox();
            await page.mouse.click(
                pageScrollBarBox.x + (pageScrollBarBox.width / 2),
                pageScrollBarBox.y + pageScrollBarBox.height - 2
            );
            await page.waitForFunction(() => document.getElementById('pagecc').scrollTop > 0);

            await page.focus('#pagescrollbar');
            await page.keyboard.press('Home');
            await page.waitForFunction(() => document.getElementById('pagecc').scrollTop === 0);
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 45_000);
});
