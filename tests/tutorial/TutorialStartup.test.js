import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    fetchTutorial: vi.fn(),
    createEngine: vi.fn()
}));

vi.mock('@/tutorial/TutorialFetcher', () => ({
    default: {fetchTutorial: mocks.fetchTutorial}
}));
vi.mock('@/tutorial/TutorialEngine', () => ({
    default: class {
        constructor(tutorial) {
            mocks.createEngine(tutorial);
            this.tutorial = tutorial;
            this.currentStep = 0;
        }
    }
}));

import { startTutorialAfterProjectLoad } from '@/tutorial/TutorialStartup';

beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('window', {
        scratchJrPage: 'editor',
        URLSearchParams,
        location: {search: '?tutorial=cog-jrblocks-1'}
    });
    mocks.fetchTutorial.mockReturnValue({id: 'cog-jrblocks-1'});
});

afterEach(() => vi.unstubAllGlobals());

describe('tutorial project-load startup', () => {
    it('preserves tutorial progress when the ready callback is repeated', () => {
        startTutorialAfterProjectLoad();
        const engine = window.tutorialEngine;
        engine.currentStep = 4;
        startTutorialAfterProjectLoad();

        expect(window.tutorialEngine).toBe(engine);
        expect(engine.currentStep).toBe(4);
        expect(mocks.createEngine).toHaveBeenCalledTimes(1);
        expect(mocks.fetchTutorial).toHaveBeenCalledTimes(1);
    });

    it.each(['index', 'home', 'inappTutorials'])('does not start a tutorial on %s', (page) => {
        window.scratchJrPage = page;
        startTutorialAfterProjectLoad();
        expect(mocks.fetchTutorial).not.toHaveBeenCalled();
        expect(mocks.createEngine).not.toHaveBeenCalled();
    });

    it('leaves ordinary project loading alone', () => {
        window.location.search = '?pmd5=123&mode=edit';
        startTutorialAfterProjectLoad();
        expect(mocks.fetchTutorial).not.toHaveBeenCalled();
        expect(window.tutorialEngine).toBeUndefined();
    });

    it('ignores an unrecognized tutorial id', () => {
        mocks.fetchTutorial.mockReturnValue(undefined);
        startTutorialAfterProjectLoad();
        expect(mocks.createEngine).not.toHaveBeenCalled();
        expect(window.tutorialEngine).toBeUndefined();
    });
});
