import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fileURLToPath } from 'url';

function modulePath(relativePath) {
    return fileURLToPath(new URL(relativePath, import.meta.url));
}

const tutorialModules = [
    [modulePath('../../src/tutorial/tutorials-data/cog-and-marty.js'), {
        id: 'cog-and-marty-tutorial',
        platform: 'blocksjr',
        title: 'String missing: COG_AND_MARTY_TUTORIAL_TITLE',
        tutorialSteps: [{
            instructionActions: [{
                text: 'String missing: COG_AND_MARTY_TUTORIAL_STEP'
            }]
        }]
    }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-1.js'), { id: 'cog-jrblocks-1', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-2.js'), { id: 'cog-jrblocks-2', platform: 'host-only' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-3.js'), { id: 'cog-jrblocks-3', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-4.js'), { id: 'cog-jrblocks-4', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-5.js'), { id: 'cog-jrblocks-5', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-6.js'), { id: 'cog-jrblocks-6', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-7.js'), { id: 'cog-jrblocks-7', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-8.js'), { id: 'cog-jrblocks-8', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-9.js'), { id: 'cog-jrblocks-9', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-10.js'), { id: 'cog-jrblocks-10', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-11.js'), { id: 'cog-jrblocks-11', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-12.js'), { id: 'cog-jrblocks-12', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/cog-jrblocks-13.js'), { id: 'cog-jrblocks-13', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-1.js'), { id: 'marty-jr-blocks-1', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-2.js'), { id: 'marty-jr-blocks-2', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-3.js'), { id: 'marty-jr-blocks-3', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-4.js'), { id: 'marty-jr-blocks-4', platform: 'blocksjr' }],
    [modulePath('../../src/tutorial/tutorials-data/marty-jrblocks-tutorials/marty-jrblocks-5.js'), { id: 'marty-jr-blocks-5', platform: 'blocksjr' }]
];

describe('TutorialFetcher', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.doMock(modulePath('../../src/utils/Localization.js'), () => ({
            default: {
                localize: (key) => ({
                    COG_AND_MARTY_TUTORIAL_TITLE: 'Cog and Marty Together',
                    COG_AND_MARTY_TUTORIAL_STEP: 'Start the tutorial'
                }[key] || `String missing: ${key}`)
            }
        }));
        tutorialModules.forEach(([path, tutorial]) => {
            vi.doMock(path, () => ({
                default: tutorial
            }));
        });
    });

    it('filters tutorials by platform and preserves source ordering', async () => {
        const tutorialFetcherModule = await import('@/tutorial/TutorialFetcher.js');
        const TutorialFetcher = tutorialFetcherModule.default;

        expect(TutorialFetcher.fetchTutorials({ platform: 'blocksjr' }).map((tutorial) => tutorial.id)).toEqual([
            'cog-and-marty-tutorial',
            'cog-jrblocks-1',
            'cog-jrblocks-3',
            'cog-jrblocks-4',
            'cog-jrblocks-5',
            'cog-jrblocks-6',
            'cog-jrblocks-7',
            'cog-jrblocks-8',
            'cog-jrblocks-9',
            'cog-jrblocks-10',
            'cog-jrblocks-11',
            'cog-jrblocks-12',
            'cog-jrblocks-13',
            'marty-jr-blocks-1',
            'marty-jr-blocks-2',
            'marty-jr-blocks-3',
            'marty-jr-blocks-4',
            'marty-jr-blocks-5'
        ]);
    });

    it('re-localizes frozen tutorial strings at fetch time', async () => {
        const tutorialFetcherModule = await import('@/tutorial/TutorialFetcher.js');
        const TutorialFetcher = tutorialFetcherModule.default;
        const tutorial = TutorialFetcher.fetchTutorial('cog-and-marty-tutorial');

        expect(tutorial.title).toBe('Cog and Marty Together');
        expect(tutorial.tutorialSteps[0].instructionActions[0].text).toBe('Start the tutorial');
    });
});
