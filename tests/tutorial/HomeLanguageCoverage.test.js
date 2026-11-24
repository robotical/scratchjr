import {readFileSync} from 'node:fs';
import {describe, expect, it, vi} from 'vitest';
import IntlMessageFormat from 'intl-messageformat';
import {BLOCK_GUIDE_METADATA} from '../../src/editor/blocks/BlockGuideRegistry';
import BlockSpecs from '../../src/editor/blocks/BlockSpecs';
import TutorialFetcher from '../../src/tutorial/TutorialFetcher';
import english from '../../editions/free/src/localizations/en.json';

const state = vi.hoisted(() => ({locale: null, messages: null}));
vi.mock('@/tablet/IO', () => ({default: {}}));
vi.mock('@/editor/engine/Prims', () => ({LINEAR_GRADIENT_COLOUR: 0}));
vi.mock('@/utils/Localization', () => ({
    default: {
        localize(key, args) {
            // The lesson definitions are imported before the selected language has loaded.
            if (!state.messages) return 'String missing: ' + key;
            const text = state.messages[key];
            if (!text) throw new Error(`Missing ${state.locale} translation for ${key}`);
            return new IntlMessageFormat(text, state.locale).format(args);
        }
    }
}));

const homeLanguages = ['ar', 'en', 'el', 'it', 'nl', 'fr', 'de', 'bg', 'da', 'no', 'cs', 'es', 'sv', 'fi'];

describe.each(homeLanguages)('Blocks Jr in %s', locale => {
    it('resolves the palette, guide, connection installer and all student-led lesson strings', () => {
        const messages = JSON.parse(readFileSync(new URL(
            `../../editions/free/src/localizations/${locale}.json`, import.meta.url
        ), 'utf8'));
        state.locale = locale;
        state.messages = messages;
        for (const key of ['A11Y_CONNECT_DEVICE', 'A11Y_DISCONNECT_DEVICE']) {
            expect(new IntlMessageFormat(messages[key], locale).format({NAME: 'Cog-123'})).toContain('Cog-123');
        }
        const labels = BlockSpecs.blockDesc({getArgValue: () => 1}, {name: 'Marty'});
        expect(BlockSpecs.blockDesc({getArgValue: () => null}, {name: 'Marty'}).playsnd)
            .toBe(messages.BLOCK_GUIDE_PLAY_SOUND);
        for (const [id, block] of Object.entries(BLOCK_GUIDE_METADATA)) {
            expect(labels[id], id).toBeTruthy();
            for (const key of [block.titleKey, block.descriptionKey, block.noteKey].filter(Boolean)) {
                expect(messages[key]?.trim(), key).toBeTruthy();
            }
        }
        for (const key of Object.keys(english).filter(key => key.startsWith('MICROBIT_INSTALLER_'))) {
            expect(messages[key]?.trim(), key).toBeTruthy();
            expect(() => new IntlMessageFormat(messages[key], locale).format({PERCENT: 50})).not.toThrow();
        }
        const lessonIds = new Set([
            ...Array.from({length: 13}, (_, i) => 'cog-jrblocks-' + (i + 1)),
            ...Array.from({length: 5}, (_, i) => 'marty-jr-blocks-' + (i + 1)),
            'cog-and-marty-tutorial'
        ]);
        for (const [key, source] of Object.entries(english)) {
            if (!/^(COG_JRBLOCKS(?:[1-9]|1[0-3])_|MARTY_JRBLOCKS[1-5]_|COG_AND_MARTY_)/.test(key)) continue;
            expect(messages[key]?.trim(), key).toBeTruthy();
            if (locale !== 'en' && source.trim().includes(' ')) {
                expect(messages[key].trim().toLowerCase(), key).not.toEqual(source.trim().toLowerCase());
            }
        }
        const tutorials = TutorialFetcher.fetchTutorials({platform: 'blocksjr'}).filter(lesson => lessonIds.has(lesson.id));
        expect(tutorials).toHaveLength(19);
        for (const tutorial of tutorials) {
            expect(tutorial.title).toBeTruthy();
            expect(tutorial.description).toBeTruthy();
            if (locale !== 'en') expect(tutorial.description).not.toMatch(/^We'll |^Learn |^Make a /);
            expect(tutorial.tutorialSteps.length).toBeGreaterThan(0);
            expect(JSON.stringify(tutorial)).not.toContain('String missing:');
            expect(TutorialFetcher.fetchTutorial(tutorial.id)).toEqual(tutorial);
        }
        if (locale !== 'en') {
            for (const key of ['BLOCK_GUIDE_WAIT_DESCRIPTION', 'BLOCK_DESC_MICROBIT_DISPLAY_HEART',
                'MICROBIT_INSTALLER_MESSAGE_CHOICE']) {
                expect(messages[key], key).not.toEqual(english[key]);
            }
        }
    });
});
