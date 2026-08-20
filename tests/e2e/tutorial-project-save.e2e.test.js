import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';

const PORT = 3026;
const HOST = `http://localhost:${PORT}`;
const TUTORIAL_PATH = '/editor.html?pmd5=-1&mode=edit&tutorial=marty-jr-blocks-1' +
    '&tutorialReturnPlace=book&tutorialReturnSubmenu=tutorials';
const TUTORIAL_TITLE = '1. Getting Marty Moving';

let server;

async function waitForServer(maxAttempts = 20) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        const ok = await new Promise((resolve) => {
            const request = http.get(`${HOST}/`, (response) => {
                response.destroy();
                resolve(true);
            });
            request.on('error', () => resolve(false));
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

async function openTutorial() {
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

    await page.goto(`${HOST}${TUTORIAL_PATH}`, {waitUntil: 'networkidle2', timeout: 30_000});
    await waitForTutorialReady(page);
    return {browser, page, errors};
}

async function waitForTutorialReady(page) {
    await page.waitForFunction(
        () => {
            const backdrop = document.getElementById('backdrop');
            return Boolean(
                window.ScratchJr &&
                window.ScratchJr.stage &&
                window.ScratchJr.stage.currentPage &&
                window.ScratchJr.getActiveScript() &&
                window.tutorialEngine &&
                document.getElementById('keepTutorialProject') &&
                backdrop &&
                window.getComputedStyle(backdrop).display === 'none'
            );
        },
        {timeout: 30_000}
    );
}

async function insertPaletteBlock(page) {
    await page.waitForSelector('#palette [data-blocktype]', {timeout: 30_000});
    const blockType = await page.evaluate(() => {
        const blockElement = document.querySelector('#palette [data-blocktype]');
        const selectedBlockType = blockElement.getAttribute('data-blocktype');
        window.Palette.insertBlockFromKeyboard(blockElement, new Event('tutorial-project-save-test'));
        return selectedBlockType;
    });
    await page.waitForFunction(
        (expectedBlockType) => window.ScratchJr.getBlocks()
            .some((block) => block.blocktype === expectedBlockType),
        {timeout: 30_000},
        blockType
    );
    return blockType;
}

async function keepTutorialProject(page) {
    await Promise.all([
        page.waitForNavigation({waitUntil: 'networkidle2', timeout: 30_000}),
        page.evaluate(() => document.getElementById('keepTutorialProject').click())
    ]);
    await page.waitForSelector('#scrollarea .projectthumb:not(#newproject):not(#cloudproject)', {
        timeout: 30_000
    });
}

async function getSavedProjectCards(page) {
    return page.$$eval(
        '#scrollarea .projectthumb:not(#newproject):not(#cloudproject)',
        (cards) => cards.map((card) => ({
            id: card.id,
            name: card.querySelector('.projecttitle h4').textContent.trim()
        }))
    );
}

describe('keeping tutorial projects', () => {
    it('saves partial tutorial work locally and reopens it as a normal editable project', async () => {
        const {browser, page, errors} = await openTutorial();

        try {
            expect(await page.$eval('#keepTutorialProject', (button) => button.textContent.trim()))
                .toBe('Keep this project');
            expect(await page.$eval('#keepTutorialProject', (button) => Boolean(
                button.querySelector('.tutorialKeepProjectIcon[aria-hidden="true"]')
            ))).toBe(true);
            expect(await page.evaluate(() => window.ScratchJr.currentProject)).toBeUndefined();

            const savedBlockType = await insertPaletteBlock(page);
            await keepTutorialProject(page);

            const cards = await getSavedProjectCards(page);
            expect(cards).toHaveLength(1);
            expect(cards[0].name).toBe(TUTORIAL_TITLE);

            await Promise.all([
                page.waitForNavigation({waitUntil: 'networkidle2', timeout: 30_000}),
                page.click(`[id="${cards[0].id}"] .card-action-open`)
            ]);
            await page.waitForFunction(
                (projectId, blockType) => Boolean(
                    window.ScratchJr &&
                    String(window.ScratchJr.currentProject) === projectId &&
                    !window.tutorialEngine &&
                    window.ScratchJr.stage &&
                    window.ScratchJr.stage.currentPage &&
                    window.ScratchJr.getActiveScript() &&
                    window.ScratchJr.getBlocks().some((block) => block.blocktype === blockType)
                ),
                {timeout: 30_000},
                cards[0].id,
                savedBlockType
            );

            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 120_000);

    it('uses a unique local name when the same tutorial is kept more than once', async () => {
        const {browser, page, errors} = await openTutorial();

        try {
            await keepTutorialProject(page);
            await page.goto(`${HOST}${TUTORIAL_PATH}`, {waitUntil: 'networkidle2', timeout: 30_000});
            await waitForTutorialReady(page);
            await keepTutorialProject(page);

            const cards = await getSavedProjectCards(page);
            expect(cards.map((card) => card.name).sort()).toEqual([
                TUTORIAL_TITLE,
                `${TUTORIAL_TITLE} 2`
            ]);
            expect(new Set(cards.map((card) => card.id)).size).toBe(2);
            expect(errors).toEqual([]);
        } finally {
            await browser.close();
        }
    }, 120_000);
});
