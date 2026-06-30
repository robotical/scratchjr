import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProject, mockGn, mockSetProps } = vi.hoisted(() => ({
    mockProject: {
        setProgress: vi.fn(),
        getMediaLoadRatio: vi.fn(() => 72)
    },
    mockGn: vi.fn(id => {
        if (id === 'backdrop') {
            return { className: 'modal-backdrop fade in' };
        }
        return null;
    }),
    mockSetProps: vi.fn((target, props) => Object.assign(target, props))
}));

vi.mock('@/editor/ScratchJr', () => ({
    default: {
        BIRDS_EYE_SPRITE_NAME: "Marty Bird's Eye",
        getSprite: vi.fn(),
        inFullscreen: false,
        isMartyModeEnabled: false,
        onHold: false,
        stage: {
            currentPage: {},
            pages: [],
            pagesdiv: {},
            stagecolor: '#fff'
        },
        stagecolor: '#fff',
        storyStart: vi.fn()
    }
}));
vi.mock('@/editor/ui/Project', () => ({ default: mockProject }));
vi.mock('@/editor/ui/Thumbs', () => ({ default: {} }));
vi.mock('@/editor/ui/UI', () => ({ default: {} }));
vi.mock('@/editor/engine/Sprite', () => ({ default: vi.fn() }));
vi.mock('@/editor/ui/Palette', () => ({ default: {} }));
vi.mock('@/editor/blocks/BlockSpecs', () => ({ default: {} }));
vi.mock('@/tablet/OS', () => ({ default: {} }));
vi.mock('@/tablet/IO', () => ({ default: {} }));
vi.mock('@/tablet/MediaLib', () => ({ default: { keys: {}, path: '' } }));
vi.mock('@/editor/ui/Undo', () => ({ default: {} }));
vi.mock('@/geom/Matrix', () => ({ default: vi.fn() }));
vi.mock('@/geom/Vector', () => ({ default: vi.fn() }));
vi.mock('@/utils/lib', () => ({
    DEGTOR: Math.PI / 180,
    getIdFor: vi.fn(name => name),
    gn: mockGn,
    isTablet: false,
    newDiv: vi.fn(),
    newHTML: vi.fn(),
    setCanvasSizeScaledToWindowDocumentHeight: vi.fn(),
    setProps: mockSetProps
}));

describe('Page background loading', () => {
    let Page;
    let nextImage;
    let createdImage;

    beforeEach(async () => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        nextImage = null;
        createdImage = null;
        global.document = {
            createElement: vi.fn(tag => {
                expect(tag).toBe('img');
                createdImage = nextImage || createImage();
                return createdImage;
            })
        };
        ({ default: Page } = await import('@/editor/engine/Page.js'));
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        delete global.document;
    });

    it('finishes once when a background image emits an error', () => {
        const page = createPage();
        const done = vi.fn();

        Page.prototype.setBackgroundImage.call(page, 'missing-background.svg', done);
        createdImage.onerror();
        createdImage.onload();
        vi.runAllTimers();

        expect(page.clearBackground).toHaveBeenCalledTimes(1);
        expect(done).toHaveBeenCalledTimes(1);
        expect(mockProject.setProgress).not.toHaveBeenCalled();
    });

    it('finishes when a cached broken image is already complete', () => {
        nextImage = createImage({ complete: true, naturalWidth: 0, naturalHeight: 0 });
        const page = createPage();
        const done = vi.fn();

        Page.prototype.setBackgroundImage.call(page, 'cached-broken-background.svg', done);

        expect(page.clearBackground).toHaveBeenCalledTimes(1);
        expect(done).toHaveBeenCalledTimes(1);
        expect(mockProject.setProgress).not.toHaveBeenCalled();
    });

    it('updates progress and finishes once when a background image loads', () => {
        const page = createPage();
        const done = vi.fn();

        Page.prototype.setBackgroundImage.call(page, 'background.svg', done);
        createdImage.onload();
        createdImage.onerror();
        vi.runAllTimers();

        expect(page.clearBackground).not.toHaveBeenCalled();
        expect(mockProject.getMediaLoadRatio).toHaveBeenCalledWith(70);
        expect(mockProject.setProgress).toHaveBeenCalledWith(72);
        expect(done).toHaveBeenCalledTimes(1);
    });

    function createPage() {
        return {
            bkg: {
                appendChild: vi.fn(),
                img: null,
                originalImg: null
            },
            clearBackground: vi.fn()
        };
    }

    function createImage({ complete = false, naturalWidth = 32, naturalHeight = 32 } = {}) {
        return {
            complete,
            naturalHeight,
            naturalWidth,
            onerror: null,
            onload: null,
            style: {},
            cloneNode: vi.fn(() => ({ cloned: true })),
            get src() {
                return this._src;
            },
            set src(value) {
                this._src = value;
            }
        };
    }
});
