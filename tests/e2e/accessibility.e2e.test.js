import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import puppeteer from 'puppeteer';

const PORT = 3011;
const HOST = `http://localhost:${PORT}`;
const AXE_SOURCE = fs.readFileSync(
    path.resolve(process.cwd(), 'node_modules/axe-core/axe.min.js'),
    'utf8'
);
const SETTINGS_PATH = path.resolve(process.cwd(), 'editions/free/src/settings.json');
const BASE_SETTINGS = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
const AXE_OPTIONS = {
    runOnly: {
        type: 'rule',
        values: [
            'aria-dialog-name',
            'button-name',
            'document-title',
            'frame-title',
            'html-has-lang',
            'image-alt',
            'landmark-one-main',
            'region'
        ]
    }
};

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

async function createPage(browser, options = {}) {
    const { shareEnabled = false } = options;
    const page = await browser.newPage();
    const errors = [];

    page.on('pageerror', (err) => {
        errors.push(err.message || String(err));
    });
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    if (shareEnabled) {
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url().endsWith('/settings.json')) {
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        ...BASE_SETTINGS,
                        shareEnabled: true
                    })
                });
                return;
            }
            request.continue();
        });
    }

    return { page, errors };
}

async function injectAxe(page) {
    const hasAxe = await page.evaluate(() => Boolean(window.axe));
    if (!hasAxe) {
        await page.addScriptTag({ content: AXE_SOURCE });
    }
}

async function runAxe(page, selector = 'html') {
    await injectAxe(page);
    return page.evaluate(async (targetSelector, options) => {
        const target = targetSelector ? document.querySelector(targetSelector) : document;
        return window.axe.run(target || document, options);
    }, selector, AXE_OPTIONS);
}

function expectNoAxeViolations(results) {
    const summary = results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length
    }));
    expect(summary).toEqual([]);
}

async function waitForTitle(page, text) {
    await page.waitForFunction((expected) => document.title.includes(expected), {}, text);
}

async function tabToSelector(page, selector, maxTabs = 20) {
    for (let index = 0; index < maxTabs; index += 1) {
        await page.keyboard.press('Tab');
        const activeMatches = await page.evaluate((targetSelector) => {
            const active = document.activeElement;
            return Boolean(active && active.matches && active.matches(targetSelector));
        }, selector);
        if (activeMatches) {
            return;
        }
    }
    throw new Error(`Failed to tab to ${selector}`);
}

async function getFocusStyles(page, selector) {
    return page.$eval(selector, (element) => {
        const styles = window.getComputedStyle(element);
        return {
            outlineStyle: styles.outlineStyle,
            outlineWidth: parseFloat(styles.outlineWidth) || 0,
            outlineColor: styles.outlineColor,
            boxShadow: styles.boxShadow
        };
    });
}

function expectVisibleFocusIndicator(focusStyles) {
    expect(focusStyles.outlineStyle).not.toBe('none');
    expect(focusStyles.outlineWidth).toBeGreaterThan(0);
    expect(focusStyles.outlineColor).not.toBe('rgba(0, 0, 0, 0)');
}

async function expectNamedButtons(page, selectors) {
    const missing = await page.evaluate((buttonSelectors) => {
        return buttonSelectors.filter((selector) => {
            const button = document.querySelector(selector);
            return !button || !button.getAttribute('aria-label');
        });
    }, selectors);
    expect(missing).toEqual([]);
}

beforeEach(async () => {
    server = spawn('python3', ['-m', 'http.server', `${PORT}`, '--directory', 'editions/free/src'], {
        stdio: 'ignore'
    });
    await waitForServer();
}, 30_000);

afterEach(() => {
    if (server) {
        server.kill();
        server = null;
    }
});

describe('Accessibility shell audit', () => {
    it(
        'keeps the home shell accessible and titles the guide iframe',
        async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const { page, errors } = await createPage(browser);

            await page.goto(`${HOST}/home.html`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await waitForTitle(page, 'My Projects');
            await page.waitForSelector('#skip-link');
            await page.waitForSelector('#logotab[aria-label]');
            await page.waitForSelector('#newproject', { timeout: 30_000 });

            expect(await page.title()).toBe('My Projects - ScratchJr');
            expect(await page.$eval('html', (element) => element.lang)).toBe('en');
            expect(await page.$eval('#skip-link', (element) => element.getAttribute('href'))).toBe('#wrapc');
            expect(await page.$eval('#topbar', (element) => element.getAttribute('role'))).toBe('navigation');
            expect(await page.$eval('#footernav', (element) => element.getAttribute('role'))).toBe('navigation');
            expect(await page.$eval('#wrapc', (element) => element.getAttribute('role'))).toBe('main');

            await expectNamedButtons(page, [
                '#logotab',
                '#hometab',
                '#geartab',
                '#booktab',
                '#tabicon'
            ]);

            await tabToSelector(page, '#skip-link');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#skip-link'));

            await tabToSelector(page, '#logotab');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#logotab'));

            await new Promise((resolve) => setTimeout(resolve, 1200));
            await page.click('#booktab');
            await page.waitForSelector('iframe#htmlcontents', { timeout: 30_000 });
            expect(await page.$eval('iframe#htmlcontents', (element) => element.getAttribute('title'))).toBe('About ScratchJr');

            expectNoAxeViolations(await runAxe(page));
            expect(errors).toEqual([]);

            await browser.close();
        },
        90_000
    );

    it(
        'keeps the guide pages accessible',
        async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });

            const guideCases = [
                {
                    path: 'inapp/interface.html',
                    title: 'Interface Guide',
                    focusSelector: '#interface-button-save',
                    buttonSelectors: ['#interface-button-save', '#interface-button-stage', '#interface-button-green-flag'],
                    decorativeImageSelector: '.ipad-project-view'
                },
                {
                    path: 'inapp/paint.html',
                    title: 'Paint Editor Guide',
                    focusSelector: '#paint-button-undo',
                    buttonSelectors: ['#paint-button-undo', '#paint-button-redo', '#paint-button-save'],
                    decorativeImageSelector: '.ipad-project-view'
                },
                {
                    path: 'inapp/blocks.html',
                    title: 'Blocks Guide',
                    focusSelector: '#skip-link',
                    buttonSelectors: [],
                    decorativeImageSelector: '.block-image'
                }
            ];

            for (const guideCase of guideCases) {
                const { page, errors } = await createPage(browser);

                await page.goto(`${HOST}/${guideCase.path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
                await waitForTitle(page, guideCase.title);
                await page.waitForSelector('#skip-link');
                await page.waitForSelector('#content[role="main"]');

                expect((await page.title()).includes(guideCase.title)).toBe(true);
                expect(await page.$eval('html', (element) => element.lang)).toBe('en');
                expect(await page.$eval('#skip-link', (element) => element.getAttribute('href'))).toBe('#content');
                expect(await page.$eval('#content', (element) => element.getAttribute('role'))).toBe('main');

                if (guideCase.buttonSelectors.length > 0) {
                    await expectNamedButtons(page, guideCase.buttonSelectors);
                }

                const decorativeAlts = await page.$$eval(guideCase.decorativeImageSelector, (images) => {
                    return images.map((image) => image.getAttribute('alt'));
                });
                expect(decorativeAlts.every((alt) => alt === '')).toBe(true);

                await tabToSelector(page, guideCase.focusSelector);
                expectVisibleFocusIndicator(await getFocusStyles(page, guideCase.focusSelector));

                expectNoAxeViolations(await runAxe(page));
                expect(errors).toEqual([]);
                await page.close();
            }

            await browser.close();
        },
        120_000
    );

    it(
        'keeps the editor shell dialogs accessible',
        async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const { page, errors } = await createPage(browser, { shareEnabled: true });

            await page.goto(`${HOST}/home.html`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await page.waitForSelector('#newproject .card-action-open', { timeout: 30_000 });
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30_000 }),
                page.$eval('#newproject .card-action-open', (button) => button.click())
            ]);

            await waitForTitle(page, 'Project Editor');
            await page.waitForSelector('#projectinfo[aria-label]', { timeout: 30_000 });
            await page.waitForSelector('#grid[aria-label]', { timeout: 30_000 });
            await page.waitForSelector('#skip-link');
            await page.waitForFunction(() => {
                const projectInfoButton = document.getElementById('projectinfo');
                return Boolean(projectInfoButton && !projectInfoButton.disabled);
            }, { timeout: 30_000 });

            expect(await page.title()).toBe('Project Editor - ScratchJr');
            expect(await page.$eval('html', (element) => element.lang)).toBe('en');
            expect(await page.$eval('#skip-link', (element) => element.getAttribute('href'))).toBe('#frame');
            expect(await page.$eval('#frame', (element) => element.getAttribute('role'))).toBe('main');

            await expectNamedButtons(page, ['#projectinfo', '#grid', '#traceBtn', '#go', '#resetall', '#full']);
            await tabToSelector(page, '#projectinfo');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#projectinfo'));

            expectNoAxeViolations(await runAxe(page));

            await page.focus('#projectinfo');
            await page.keyboard.press('Enter');
            await page.waitForSelector('#infobox[role="dialog"]', { timeout: 30_000 });
            expect(await page.$eval('#infobox', (element) => element.getAttribute('aria-modal'))).toBe('true');
            await page.waitForFunction(() => {
                const dialog = document.getElementById('infobox');
                return Boolean(dialog && dialog.contains(document.activeElement));
            }, { timeout: 5_000 });

            await page.waitForSelector('#infoboxParentsSectionButton', { timeout: 30_000 });
            await page.click('#infoboxParentsSectionButton');
            await page.waitForSelector('#parentalgate[role="dialog"]', { timeout: 30_000 });
            expect(await page.$eval('#parentalgate', (element) => element.getAttribute('aria-modal'))).toBe('true');
            await page.waitForFunction(() => {
                const active = document.activeElement;
                return Boolean(active && active.classList && active.classList.contains('parentalgatechoice'));
            }, { timeout: 5_000 });

            await page.evaluate(() => {
                const buttons = document.querySelectorAll('#parentalgate .parentalgatechoice');
                buttons[buttons.length - 1].focus();
            });
            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => document.activeElement.classList.contains('paintdone'))).toBe(true);

            await page.click('#parentalgate .paintdone');
            await page.waitForFunction(() => !document.getElementById('parentalgate'));
            expect(await page.evaluate(() => document.activeElement.id)).toBe('infoboxParentsSectionButton');

            await page.keyboard.press('Escape');
            await page.waitForFunction(() => {
                const dialog = document.getElementById('infobox');
                return dialog && dialog.className.indexOf(' in') === -1;
            });
            expect(await page.evaluate(() => document.activeElement.id)).toBe('projectinfo');

            const editorUrl = page.url();
            await page.goto(`${editorUrl}&tutorial=cog-jrblocks-1`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await page.waitForSelector('#tutorialMenuBar', { timeout: 40_000 });
            await page.waitForSelector('#nextStep', { timeout: 30_000 });

            await expectNamedButtons(page, ['#closeTutorial', '#tutorialReadAloud', '#tutorialHelp', '#previousStep', '#nextStep']);
            await tabToSelector(page, '#closeTutorial');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#closeTutorial'));

            expectNoAxeViolations(await runAxe(page));

            await page.focus('#nextStep');
            await page.keyboard.press('Enter');
            await page.waitForSelector('.tutorialImage', { timeout: 30_000 });
            await page.$eval('.tutorialImage', (image) => image.click());
            await page.waitForFunction(() => {
                const modal = document.getElementById('tutorialModal');
                return modal && window.getComputedStyle(modal).display === 'block';
            });

            expect(await page.$eval('#tutorialModal', (element) => element.getAttribute('role'))).toBe('dialog');
            expect(await page.$eval('#tutorialModal', (element) => element.getAttribute('aria-modal'))).toBe('true');
            await page.waitForFunction(() => {
                const active = document.activeElement;
                return Boolean(active && active.classList && active.classList.contains('closeModal'));
            }, { timeout: 5_000 });

            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => document.activeElement.classList.contains('closeModal'))).toBe(true);

            await page.keyboard.press('Escape');
            await page.waitForFunction(() => {
                const modal = document.getElementById('tutorialModal');
                return modal && window.getComputedStyle(modal).display === 'none';
            });
            expect(await page.evaluate(() => document.activeElement.id)).toBe('nextStep');

            expect(errors).toEqual([]);
            await browser.close();
        },
        150_000
    );
});
