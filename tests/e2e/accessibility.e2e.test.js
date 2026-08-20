import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import puppeteer from 'puppeteer';

const PORT = 3012;
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
    const hasVisibleOutline = focusStyles.outlineStyle !== 'none' &&
        focusStyles.outlineWidth > 0 &&
        focusStyles.outlineColor !== 'rgba(0, 0, 0, 0)';
    const hasVisibleBoxShadow = focusStyles.boxShadow && focusStyles.boxShadow !== 'none';
    expect(hasVisibleOutline || hasVisibleBoxShadow).toBe(true);
}

async function expectNamedControls(page, selectors) {
    const missing = await page.evaluate((buttonSelectors) => {
        return buttonSelectors.filter((selector) => {
            const button = document.querySelector(selector);
            return !button || !button.getAttribute('aria-label');
        });
    }, selectors);
    expect(missing).toEqual([]);
}

async function activateSkipLink(page, targetId) {
    await page.focus('#skip-link');
    await page.keyboard.press('Enter');
    await page.waitForFunction((expectedTargetId) => {
        return document.activeElement && document.activeElement.id === expectedTargetId;
    }, { timeout: 5_000 }, targetId);
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
            await page.waitForSelector('#logotab[aria-hidden="true"]');
            await page.waitForSelector('#newproject', { timeout: 30_000 });

            expect(await page.title()).toBe('My Projects - ScratchJr');
            expect(await page.$eval('html', (element) => element.lang)).toBe('en');
            expect(await page.$eval('#skip-link', (element) => element.getAttribute('href'))).toBe('#wrapc');
            expect(await page.$eval('#topbar', (element) => element.getAttribute('role'))).toBe('navigation');
            expect(await page.$eval('#footernav', (element) => element.getAttribute('role'))).toBe('navigation');
            expect(await page.$eval('#wrapc', (element) => element.getAttribute('role'))).toBe('main');
            expect(await page.$eval('#logotab', (element) => element.getAttribute('aria-hidden'))).toBe('true');
            expect(await page.$eval('#logotab', (element) => element.getAttribute('tabindex'))).toBe('-1');
            expect(await page.$eval('#logotab', (element) => {
                const styles = window.getComputedStyle(element);
                return {
                    display: styles.display,
                    visibility: styles.visibility,
                    pointerEvents: styles.pointerEvents,
                };
            })).toEqual({
                display: 'block',
                visibility: 'hidden',
                pointerEvents: 'none',
            });
            expect(await page.$eval('#logotab', (element) => element.getBoundingClientRect().width)).toBeGreaterThan(0);

            await expectNamedControls(page, [
                '#hometab',
                '#geartab',
                '#booktab',
                '#tabicon'
            ]);

            await tabToSelector(page, '#skip-link');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#skip-link'));

            await tabToSelector(page, '#hometab');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#hometab'));

            await activateSkipLink(page, 'wrapc');

            await new Promise((resolve) => setTimeout(resolve, 1200));
            await page.click('#booktab');
            await page.waitForSelector('iframe#htmlcontents', { timeout: 30_000 });
            expect(await page.$eval('iframe#htmlcontents', (element) => element.getAttribute('title'))).toBe('About Blocks Jr');

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
                    path: 'inapp/about.html',
                    title: 'About Blocks Jr',
                    focusSelector: '#skip-link',
                    buttonSelectors: [],
                    decorativeImageSelector: '.about-hero-art img'
                },
                {
                    path: 'inapp/interface.html',
                    title: 'Interface Guide',
                    focusSelector: '#interface-button-save',
                    buttonSelectors: [
                        '#interface-button-save',
                        '#interface-button-extensions',
                        '#interface-button-stage',
                        '#interface-button-green-flag',
                        '#interface-button-duplicate-page',
                        '#interface-button-zoom'
                    ],
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
                    focusSelector: '#blocks-guide-tab-marty',
                    buttonSelectors: [
                        '#blocks-guide-tab-marty',
                        '#blocks-guide-tab-sprite',
                        '#blocks-guide-tab-cog'
                    ],
                    decorativeImageSelector: '.block-guide-icon'
                }
            ];

            for (const guideCase of guideCases) {
                const { page, errors } = await createPage(browser);

                await page.goto(`${HOST}/${guideCase.path}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
                await waitForTitle(page, guideCase.title);
                await page.waitForSelector('#skip-link');
                await page.waitForSelector('#content');

                expect((await page.title()).includes(guideCase.title)).toBe(true);
                expect(await page.$eval('html', (element) => element.lang)).toBe('en');
                expect(await page.$eval('#skip-link', (element) => element.getAttribute('href'))).toBe('#content');
                expect(await page.$eval('#content', (element) => {
                    return element.tagName.toLowerCase() === 'main' || element.getAttribute('role') === 'main';
                })).toBe(true);

                if (guideCase.buttonSelectors.length > 0) {
                    await expectNamedControls(page, guideCase.buttonSelectors);
                }

                const decorativeAlts = await page.$$eval(guideCase.decorativeImageSelector, (images) => {
                    return images.map((image) => image.getAttribute('alt'));
                });
                expect(decorativeAlts.every((alt) => alt === '')).toBe(true);

                await tabToSelector(page, guideCase.focusSelector);
                expectVisibleFocusIndicator(await getFocusStyles(page, guideCase.focusSelector));

                if (guideCase.path === 'inapp/interface.html') {
                    const buttonIds = await page.$$eval('.interface-button', (buttons) => {
                        return buttons.map((button) => button.id);
                    });
                    expect(buttonIds).toHaveLength(24);
                    expect(await page.$$eval('.interface-connector', (connectors) => connectors.length)).toBe(24);
                    expect(await page.$eval('#interface-key-header', (element) => element.textContent)).toBe('1 | Save');

                    for (let index = 0; index < buttonIds.length; index += 1) {
                        const selector = `#${buttonIds[index]}`;
                        await page.click(selector);
                        const selectedFeature = await page.evaluate((buttonSelector) => {
                            const button = document.querySelector(buttonSelector);
                            const connector = document.querySelector(
                                `.interface-connector[data-guide-key="${button.getAttribute('data-guide-key')}"]`
                            );
                            const number = button.querySelector('span');
                            return {
                                ariaCurrent: button.getAttribute('aria-current'),
                                ariaLabel: button.getAttribute('aria-label'),
                                buttonBackground: window.getComputedStyle(button).backgroundColor,
                                connectorIsSelected: connector.classList.contains('interface-connector-selected'),
                                connectorLineLength: connector.querySelector('line').getTotalLength(),
                                description: document.querySelector('#interface-key-description').textContent,
                                header: document.querySelector('#interface-key-header').textContent,
                                numberColor: window.getComputedStyle(number).color,
                                numberText: number.textContent,
                                selectedConnectorCount: document.querySelectorAll(
                                    '.interface-connector-selected'
                                ).length,
                                selectedCount: document.querySelectorAll('.interface-button[aria-current="page"]').length
                            };
                        }, selector);

                        expect(selectedFeature.header).toBe(selectedFeature.ariaLabel);
                        expect(selectedFeature.header.startsWith(`${index + 1} | `)).toBe(true);
                        expect(selectedFeature.header).not.toContain('String missing:');
                        expect(selectedFeature.description.trim().length).toBeGreaterThan(0);
                        expect(selectedFeature.description).not.toContain('String missing:');
                        expect(selectedFeature.ariaCurrent).toBe('page');
                        expect(selectedFeature.numberText).toBe(String(index + 1));
                        expect(selectedFeature.numberColor).not.toBe(selectedFeature.buttonBackground);
                        expect(selectedFeature.connectorIsSelected).toBe(true);
                        expect(selectedFeature.connectorLineLength).toBeGreaterThan(0);
                        expect(selectedFeature.selectedConnectorCount).toBe(1);
                        expect(selectedFeature.selectedCount).toBe(1);
                    }

                    await page.click('#interface-button-extensions');
                    expect(await page.$eval('#interface-key-header', (element) => element.textContent)).toBe('3 | Extensions');
                    expect(await page.$eval('#interface-key-description', (element) => element.textContent)).toContain('micro:bit');
                }

                if (guideCase.path === 'inapp/blocks.html') {
                    const inventory = await page.evaluate(() => {
                        const modeCounts = {};
                        document.querySelectorAll('[data-guide-mode-panel]').forEach((panel) => {
                            modeCounts[panel.getAttribute('data-guide-mode-panel')] =
                                panel.querySelectorAll('.block-guide-card').length;
                        });
                        return {
                            activeMode: document.querySelector('[role="tab"][aria-selected="true"]')
                                .getAttribute('data-guide-mode'),
                            extensionCount: document.querySelectorAll(
                                '#blocks-guide-extension .block-guide-card'
                            ).length,
                            modeCounts,
                            missingCopy: document.body.textContent.includes('String missing:'),
                            tabCount: document.querySelectorAll('[role="tab"]').length
                        };
                    });
                    expect(inventory).toEqual({
                        activeMode: 'marty',
                        extensionCount: 8,
                        modeCounts: {
                            marty: 44,
                            sprite: 31,
                            cog: 19
                        },
                        missingCopy: false,
                        tabCount: 3
                    });

                    await page.click('#blocks-guide-tab-sprite');
                    expect(await page.$eval('#blocks-guide-panel-sprite', (panel) => panel.hidden)).toBe(false);
                    expect(await page.$eval('#blocks-guide-panel-marty', (panel) => panel.hidden)).toBe(true);

                    await page.focus('#blocks-guide-tab-sprite');
                    await page.keyboard.press('ArrowRight');
                    expect(await page.$eval('#blocks-guide-tab-cog', (tab) => tab.getAttribute('aria-selected'))).toBe('true');
                    expect(await page.$eval('#blocks-guide-panel-cog', (panel) => panel.hidden)).toBe(false);

                    for (const modeId of ['marty', 'sprite', 'cog']) {
                        await page.evaluate(() => {
                            window.scrollTo(0, document.documentElement.scrollHeight);
                        });
                        await page.click(`#blocks-guide-tab-${modeId}`);
                        const selectedMode = await page.evaluate((expectedMode) => {
                            const tab = document.querySelector(`[data-guide-mode="${expectedMode}"]`);
                            const panel = document.querySelector(`[data-guide-mode-panel="${expectedMode}"]`);
                            const firstCard = panel.querySelector('.block-guide-card');
                            const tabsShell = document.querySelector('.blocks-guide-tabs-shell');
                            const cardRect = firstCard.getBoundingClientRect();
                            const tabsRect = tabsShell.getBoundingClientRect();
                            return {
                                activeMode: document.querySelector('[role="tab"][aria-selected="true"]')
                                    .getAttribute('data-guide-mode'),
                                firstCardVisible: cardRect.top < window.innerHeight && cardRect.bottom > tabsRect.bottom,
                                panelHidden: panel.hidden,
                                tabSelected: tab.getAttribute('aria-selected')
                            };
                        }, modeId);
                        expect(selectedMode).toEqual({
                            activeMode: modeId,
                            firstCardVisible: true,
                            panelHidden: false,
                            tabSelected: 'true'
                        });
                    }
                }

                await activateSkipLink(page, 'content');

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
            await page.waitForSelector('#sprite-start[aria-label]', { timeout: 30_000 });
            await page.waitForSelector('#pagecc[aria-label]', { timeout: 30_000 });
            await page.waitForSelector('#spritecc[aria-label]', { timeout: 30_000 });
            await page.waitForSelector('#emptypage[aria-label]', { timeout: 30_000 });
            await page.waitForFunction(() => {
                const projectInfoButton = document.getElementById('projectinfo');
                return Boolean(projectInfoButton && !projectInfoButton.disabled);
            }, { timeout: 30_000 });

            expect(await page.title()).toBe('Project Editor - ScratchJr');
            expect(await page.$eval('html', (element) => element.lang)).toBe('en');
            expect(await page.$eval('#skip-link', (element) => element.getAttribute('href'))).toBe('#frame');
            expect(await page.$eval('#frame', (element) => element.getAttribute('role'))).toBe('main');
            expect(await page.$eval('#pagecc', (element) => element.getAttribute('role'))).toBe('group');
            expect(await page.$eval('#pagecc', (element) => element.getAttribute('aria-label'))).toBe('Pages');
            expect(await page.$eval('#spritecc', (element) => element.getAttribute('role'))).toBe('group');
            expect(await page.$eval('#spritecc', (element) => element.getAttribute('aria-label'))).toBe('Characters');
            expect(await page.$eval('#selectors', (element) => element.getAttribute('role'))).toBe('toolbar');
            expect(await page.$eval('#selectors', (element) => element.getAttribute('aria-label'))).toBe('Block Categories');
            expect(await page.$eval('#palette', (element) => element.getAttribute('role'))).toBe('group');
            expect(await page.$eval('#palette', (element) => element.getAttribute('aria-label'))).toBe('Blocks Palette');
            expect(await page.$eval('#scripts', (element) => element.getAttribute('role'))).toBe('group');
            expect(await page.$eval('#scripts', (element) => element.getAttribute('aria-label'))).toBe('Programming Area');
            expect(await page.$eval('#scriptscontainer', (element) => element.getAttribute('role'))).toBe('list');
            expect(await page.$eval('#scriptscontainer', (element) => element.getAttribute('aria-label'))).toBe('Programming Script');

            await activateSkipLink(page, 'frame');

            await expectNamedControls(page, [
                '#projectinfo',
                '#grid',
                '#traceBtn',
                '#go',
                '#resetall',
                '#full',
                '#sprite-start',
                '#sprite-motion',
                '#emptypage'
            ]);
            await tabToSelector(page, '#sprite-start', 50);
            expectVisibleFocusIndicator(await getFocusStyles(page, '#sprite-start'));
            await page.keyboard.press('ArrowRight');
            expect(await page.evaluate(() => document.activeElement.id)).toBe('sprite-motion');
            await page.keyboard.press('Enter');
            await page.waitForFunction(() => {
                const motionButton = document.getElementById('sprite-motion');
                return motionButton && motionButton.getAttribute('aria-pressed') === 'true';
            }, { timeout: 5_000 });
            expect((await getFocusStyles(page, '#sprite-motion')).outlineStyle).toBe('none');
            await page.waitForSelector('#forward_block[role="button"]', { timeout: 30_000 });

            await expectNamedControls(page, ['#forward_block', '#back_block']);
            await page.waitForFunction(() => {
                const buttons = Array.from(document.querySelectorAll('#palette [role="button"]'));
                return buttons.length > 1 && buttons.every((button) => button.getAttribute('aria-label'));
            }, { timeout: 5_000 });

            await page.focus('#forward_block');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#forward_block'));
            await page.keyboard.press('ArrowRight');
            expect(await page.evaluate(() => document.activeElement.getAttribute('data-blocktype'))).toBe('back');

            const blockCountBefore = await page.evaluate(() => window.ScratchJr.getBlocks().length);
            await page.keyboard.press('Enter');
            await page.waitForFunction((before) => {
                return window.ScratchJr.getBlocks().length === before + 1
                    && window.ScratchJr.getBlocks().some((block) => block.blocktype === 'back');
            }, { timeout: 30_000 }, blockCountBefore);
            await page.waitForSelector('#scriptscontainer .keyboard-script-strip[role="button"]', { timeout: 30_000 });
            await expectNamedControls(page, ['#scriptscontainer .keyboard-script-strip[role="button"]']);

            await page.focus('#scriptscontainer .keyboard-script-strip[role="button"]');
            expectVisibleFocusIndicator(await getFocusStyles(page, '#scriptscontainer .keyboard-script-strip[role="button"]'));
            expect(await page.$eval('#scriptscontainer .keyboard-script-strip[role="button"]',
                (element) => element.getAttribute('aria-pressed'))).toBe('true');

            const stripBlockCountBefore = await page.evaluate(() => window.ScratchJr.getBlocks().length);
            await page.focus('#back_block');
            await page.keyboard.press('Enter');
            await page.waitForFunction((before) => {
                return window.ScratchJr.getBlocks().length === before + 1
                    && window.ScratchJr.getActiveScript().owner.gettopblocks().length === 1;
            }, { timeout: 30_000 }, stripBlockCountBefore);

            await page.focus('#scriptscontainer .keyboard-script-strip[role="button"]');
            await page.keyboard.press('Delete');
            await page.waitForFunction(() => {
                return window.ScratchJr.getBlocks().length === 0
                    && document.querySelectorAll('#scriptscontainer .keyboard-script-strip[role="button"]').length === 0;
            }, { timeout: 30_000 });

            await tabToSelector(page, '#emptypage', 80);
            expectVisibleFocusIndicator(await getFocusStyles(page, '#emptypage'));
            await page.keyboard.press('Enter');
            await page.waitForFunction(() => {
                return document.querySelectorAll('#pagecc .pagethumb[role="button"]').length === 3;
            }, { timeout: 30_000 });

            const initialPageIds = await page.$$eval('#pagecc .pagethumb[data-owner]', (thumbs) => {
                return thumbs.map((thumb) => thumb.getAttribute('data-owner'));
            });
            const firstPageId = initialPageIds[0];
            const secondPageId = initialPageIds[1];

            expect(await page.$$eval('#pagecc .pagethumb .thumb-action', (buttons) => buttons.length)).toBe(0);

            const pageOneSpriteCountBefore = await page.evaluate((pageId) => {
                return JSON.parse(document.getElementById(pageId).owner.sprites).length;
            }, firstPageId);
            await page.focus(`.pagethumb[data-owner="${firstPageId}"]`);
            await page.keyboard.press('c');
            await page.waitForFunction((pageId, countBefore) => {
                return JSON.parse(document.getElementById(pageId).owner.sprites).length === countBefore + 1;
            }, { timeout: 30_000 }, firstPageId, pageOneSpriteCountBefore);

            await page.waitForFunction((pageId) => {
                const target = document.querySelector(`.pagethumb[data-owner="${pageId}"]`);
                if (!target) {
                    return false;
                }
                target.focus();
                const activeElement = document.activeElement;
                return activeElement === target;
            }, { timeout: 5_000 }, secondPageId);
            await page.evaluate((pageId) => {
                const target = document.querySelector(`.pagethumb[data-owner="${pageId}"]`);
                target.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'ArrowLeft',
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true
                }));
            }, secondPageId);
            await page.waitForFunction((pageId) => {
                const firstThumb = document.querySelector('#pagecc .pagethumb[data-owner]');
                return firstThumb && firstThumb.getAttribute('data-owner') === pageId;
            }, { timeout: 30_000 }, secondPageId);

            await page.evaluate(() => {
                const pageThumbs = Array.from(document.querySelectorAll('#pagecc .pagethumb[role="button"]'))
                    .filter((thumb) => thumb.id !== 'emptypage');
                pageThumbs[1].focus();
            });
            await page.keyboard.press('Enter');
            await page.waitForFunction((pageId) => {
                const currentThumb = document.querySelector('#pagecc .pagethumb[aria-current="page"]');
                return currentThumb && currentThumb.getAttribute('data-owner') === pageId;
            }, { timeout: 30_000 }, firstPageId);

            await page.focus(`.pagethumb[data-owner="${secondPageId}"]`);
            await page.keyboard.press('Delete');
            await page.waitForFunction((pageId) => {
                return !document.querySelector(`.pagethumb[data-owner="${pageId}"]`)
                    && document.querySelectorAll('#pagecc .pagethumb[data-owner]').length === 1;
            }, { timeout: 30_000 }, secondPageId);

            await page.evaluate(() => {
                window.ScratchJr.stage.currentPage.addSprite(0.5, window.ScratchJr.defaultSprite, 'Helper');
            });
            await page.waitForFunction(() => {
                const visibleThumbs = Array.from(document.querySelectorAll('#spritecc .spritethumb[role="button"]'))
                    .filter((thumb) => window.getComputedStyle(thumb).display !== 'none');
                return visibleThumbs.length >= 2;
            }, { timeout: 30_000 });

            const unnamedSpriteThumbs = await page.$$eval('#spritecc .spritethumb[role="button"]', (thumbs) => {
                return thumbs.filter((thumb) => {
                    return window.getComputedStyle(thumb).display !== 'none' && !thumb.getAttribute('aria-label');
                }).length;
            });
            expect(unnamedSpriteThumbs).toBe(0);

            await page.evaluate(() => {
                const visibleThumbs = Array.from(document.querySelectorAll('#spritecc .spritethumb[role="button"]'))
                    .filter((thumb) => window.getComputedStyle(thumb).display !== 'none');
                visibleThumbs[1].focus();
            });
            await page.keyboard.press('Enter');
            await page.waitForFunction(() => {
                const visibleThumbs = Array.from(document.querySelectorAll('#spritecc .spritethumb[role="button"]'))
                    .filter((thumb) => window.getComputedStyle(thumb).display !== 'none');
                return visibleThumbs.length >= 2
                    && visibleThumbs[1].getAttribute('aria-pressed') === 'true'
                    && visibleThumbs[0].getAttribute('aria-pressed') === 'false';
            }, { timeout: 30_000 });

            const spriteThumbIds = await page.$$eval('#spritecc .spritethumb[data-owner]', (thumbs) => {
                return thumbs
                    .filter((thumb) => window.getComputedStyle(thumb).display !== 'none')
                    .map((thumb) => thumb.getAttribute('data-owner'));
            });
            const deletableSpriteId = spriteThumbIds[1];
            await page.focus(`.spritethumb[data-owner="${deletableSpriteId}"]`);
            await page.keyboard.press('Delete');
            await page.waitForFunction((spriteId) => {
                return !document.querySelector(`.spritethumb[data-owner="${spriteId}"]`);
            }, { timeout: 30_000 }, deletableSpriteId);

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

            const editorUrl = new URL(page.url());
            editorUrl.searchParams.set('tutorial', 'cog-jrblocks-1');
            editorUrl.hash = '';
            await page.goto(editorUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 30_000 });
            await page.waitForSelector('#tutorialMenuBar', { timeout: 40_000 });
            await page.waitForSelector('#nextStep', { timeout: 30_000 });

            await expectNamedControls(page, [
                '#closeTutorial',
                '#keepTutorialProject',
                '#tutorialReadAloud',
                '#tutorialHelp',
                '#previousStep',
                '#nextStep'
            ]);
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
