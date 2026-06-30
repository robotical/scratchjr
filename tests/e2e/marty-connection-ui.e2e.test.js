import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/editor/ScratchJr', () => ({
    default: {
        isMartyModeEnabled: false,
        stage: {
            currentPage: {}
        }
    }
}));
vi.mock('@/editor/blocks/BlockSpecs', () => ({ default: {} }));
vi.mock('@/editor/ui/Alert', () => ({ default: {} }));
vi.mock('@/editor/ui/Project', () => ({ default: {} }));
vi.mock('@/editor/ProjectCloud', () => ({ default: {} }));
vi.mock('@/editor/ui/Thumbs', () => ({ default: {} }));
vi.mock('@/editor/ui/Palette', () => ({ default: {} }));
vi.mock('@/editor/ui/Grid', () => ({ default: {} }));
vi.mock('@/editor/engine/Stage', () => ({ default: {} }));
vi.mock('@/editor/ui/ScriptsPane', () => ({ default: {} }));
vi.mock('@/editor/ui/Undo', () => ({ default: {} }));
vi.mock('@/editor/ui/Library', () => ({ default: {} }));
vi.mock('@/tablet/OS', () => ({ default: {} }));
vi.mock('@/tablet/IO', () => ({ default: {} }));
vi.mock('@/tablet/MediaLib', () => ({ default: {} }));
vi.mock('@/painteditor/Paint', () => ({ default: {} }));
vi.mock('@/utils/Events', () => ({ default: {} }));
vi.mock('@/utils/Localization', () => ({
    default: {
        localize: key => key
    }
}));
vi.mock('@/utils/ScratchAudio', () => ({ default: {} }));
vi.mock('@/utils/cloudLocalStore', () => ({
    addStoredCloudId: vi.fn(),
    getStoredCloudIds: vi.fn(() => []),
    removeStoredCloudId: vi.fn(),
    touchStoredCloudId: vi.fn()
}));
vi.mock('@/utils/goToLink', () => ({ default: vi.fn() }));
vi.mock('@/utils/lib', () => ({
    frame: null,
    gn: vi.fn(),
    CSSTransition: vi.fn(),
    localx: vi.fn(),
    newHTML: vi.fn(),
    newButton: vi.fn(),
    scaleMultiplier: 1,
    fullscreenScaleMultiplier: 1,
    getIdFor: vi.fn(),
    isTablet: false,
    newDiv: vi.fn(),
    newTextInput: vi.fn(),
    isAndroid: false,
    getDocumentWidth: vi.fn(() => 1024),
    getDocumentHeight: vi.fn(() => 768),
    setProps: vi.fn(),
    globalx: vi.fn()
}));
vi.mock('@/utils/accessibility', () => ({
    closeDialog: vi.fn(),
    openDialog: vi.fn(),
    registerDialog: vi.fn(),
    setMainLandmark: vi.fn(),
    setPressedState: vi.fn(),
    setSelectedState: vi.fn()
}));
vi.mock('@/html-svgs/cog', () => ({ cogSvg: '<svg></svg>' }));
vi.mock('@/html-svgs/microbit', () => ({ microBitSvg: '<svg></svg>' }));
vi.mock('@/html-svgs/sprite', () => ({ spriteSvg: '<svg></svg>' }));
vi.mock('@/html-svgs/marty', () => ({ martySvg: '<svg></svg>' }));
vi.mock('@/html-svgs/sprite-deselected', () => ({ spriteDeselectedSvg: '<svg></svg>' }));
vi.mock('@/html-svgs/marty-deselected', () => ({ martyDeselectedSvg: '<svg></svg>' }));
vi.mock('@/html-svgs/marty_toggle_on', () => ({ martyToggleOn: '<svg></svg>' }));
vi.mock('@/html-svgs/sprite_toggle_on', () => ({ spriteToggleOn: '<svg></svg>' }));
vi.mock('@/html-svgs/battery-svg', () => ({ batterySvg: () => '<svg id="battery"></svg>' }));
vi.mock('@/html-svgs/signal-svg', () => ({ signalSvg: () => '<svg id="signal"></svg>' }));
vi.mock('@/utils/raft-subscription-helpers', () => ({
    createRaftConnectionIssueDetectedHelper: () => ({
        subscribe: vi.fn(),
        unsubscribe: vi.fn()
    }),
    createRaftConnectionIssueResolvedHelper: () => ({
        subscribe: vi.fn(),
        unsubscribe: vi.fn()
    }),
    raftVerifiedSubscriptionHelper: () => ({
        subscribe: vi.fn(),
        unsubscribe: vi.fn()
    }),
    raftDisconnectedSubscriptionHelper: raft => {
        const helper = {
            subscribe: vi.fn(callback => {
                raft.__disconnectCallback = callback;
            }),
            unsubscribe: vi.fn(() => {
                raft.__disconnectedUnsubscribed = true;
            })
        };
        return helper;
    }
}));
vi.mock('@/utils/truncate-string', () => ({ truncateString: value => value }));
vi.mock('@/editor/ui/Trace', () => ({
    default: {
        clear: vi.fn()
    }
}));

describe('Marty connection UI', () => {
    let UI;
    let ScratchJr;
    let warnSpy;

    beforeEach(async () => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        global.window = {
            applicationManager: {
                disconnectGeneric: vi.fn(raft => {
                    raft.__disconnectCallback();
                })
            },
            martyManager: {
                addMarty: vi.fn(),
                wireMartyWithBlocks: vi.fn(() => {
                    throw new Error('metadata not ready');
                }),
                removeMarty: vi.fn(),
                setMartySensorAvailability: vi.fn()
            },
            microBitManager: {
                addMicroBit: vi.fn(),
                wireMicroBitWithBlocks: vi.fn(),
                removeMicroBit: vi.fn()
            }
        };
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const [uiModule, scratchJrModule] = await Promise.all([
            import('@/editor/ui/UI.js'),
            import('@/editor/ScratchJr')
        ]);
        UI = uiModule.default;
        ScratchJr = scratchJrModule.default;
        ScratchJr.isMartyModeEnabled = false;
        ScratchJr.stage = {
            currentPage: {}
        };
    });

    afterEach(() => {
        warnSpy.mockRestore();
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        delete global.window;
    });

    it('installs the Marty disconnect action before sensor and block metadata are ready', () => {
        const button = createConnectionButton();
        const oldOnClick = vi.fn();
        button.onclick = oldOnClick;
        const raft = createMartyRaft();

        UI.setupMartyConnectionButton(button, raft);

        button.onclick();
        vi.advanceTimersByTime(1000);

        expect(window.applicationManager.disconnectGeneric).toHaveBeenCalledWith(raft);
        expect(window.martyManager.removeMarty).toHaveBeenCalledWith(raft);
        expect(button.onclick).toBe(oldOnClick);
        expect(button.classList.contains('connectButtonConnected')).toBe(false);
        expect(button.querySelector('.iconButtonContainer').classList.contains('notConnectedButtonContainer')).toBe(true);
        expect(raft.__disconnectedUnsubscribed).toBe(true);
    });

    it('switches from Sprite mode to Marty mode after Marty connects', () => {
        const button = createConnectionButton();
        button.onclick = vi.fn();
        const raft = createMartyRaft();

        UI.setupMartyConnectionButton(button, raft);

        expect(ScratchJr.isMartyModeEnabled).toBe(true);
    });

    it('still disconnects Marty after switching back to Sprite mode', () => {
        const button = createConnectionButton();
        const oldOnClick = vi.fn();
        button.onclick = oldOnClick;
        const raft = createMartyRaft();

        UI.setupMartyConnectionButton(button, raft);
        UI.setMartyModeEnabled(false);

        expect(ScratchJr.isMartyModeEnabled).toBe(false);

        button.onclick();
        vi.advanceTimersByTime(1000);

        expect(window.applicationManager.disconnectGeneric).toHaveBeenCalledWith(raft);
        expect(window.martyManager.removeMarty).toHaveBeenCalledWith(raft);
        expect(button.onclick).toBe(oldOnClick);
        expect(button.classList.contains('connectButtonConnected')).toBe(false);
        expect(button.querySelector('.iconButtonContainer').classList.contains('notConnectedButtonContainer')).toBe(true);
    });

    it('clears the Marty button after confirmed host-context removal without waiting for the RAFT event', async () => {
        const button = createConnectionButton();
        const oldOnClick = vi.fn();
        button.onclick = oldOnClick;
        const raft = createMartyRaft();
        window.applicationManager.connectedRaftsContext = [{ id: raft.id }];
        window.applicationManager.disconnectGeneric = vi.fn(() => {
            window.applicationManager.connectedRaftsContext = [];
        });

        UI.setupMartyConnectionButton(button, raft);

        button.onclick();
        await Promise.resolve();
        vi.advanceTimersByTime(1000);

        expect(window.applicationManager.disconnectGeneric).toHaveBeenCalledWith(raft);
        expect(window.martyManager.removeMarty).toHaveBeenCalledWith(raft);
        expect(button.onclick).toBe(oldOnClick);
        expect(button.classList.contains('connectButtonConnected')).toBe(false);
        expect(button.querySelector('.iconButtonContainer').classList.contains('notConnectedButtonContainer')).toBe(true);
        expect(raft.__disconnectedUnsubscribed).toBe(true);
    });

    it('keeps the Marty button connected when the disconnect confirmation is cancelled', async () => {
        const button = createConnectionButton();
        const oldOnClick = vi.fn();
        button.onclick = oldOnClick;
        const raft = createMartyRaft();
        window.applicationManager.connectedRaftsContext = [{ id: raft.id }];
        window.applicationManager.disconnectGeneric = vi.fn();

        UI.setupMartyConnectionButton(button, raft);

        button.onclick();
        vi.advanceTimersByTime(31000);
        await Promise.resolve();

        expect(window.applicationManager.disconnectGeneric).toHaveBeenCalledWith(raft);
        expect(window.martyManager.removeMarty).not.toHaveBeenCalled();
        expect(button.onclick).not.toBe(oldOnClick);
        expect(button.classList.contains('connectButtonConnected')).toBe(true);
        expect(button.querySelector('.iconButtonContainer').classList.contains('connectedButtonContainer')).toBe(true);
    });

    it('uses a friendly message when the micro:bit chooser is cancelled', () => {
        const message = UI.getMicroBitConnectionErrorMessage(
            new DOMException('User cancelled the requestDevice() chooser.', 'NotFoundError')
        );

        expect(message).toBe('No micro:bit was selected. Click Connect again when you are ready.');
    });

    it('registers micro:bit blocks and restores the button after direct disconnect', () => {
        const button = createConnectionButton();
        const oldOnClick = vi.fn();
        button.onclick = oldOnClick;
        const microBit = createMicroBit();

        UI.setupMicroBitConnectionButton(button, microBit);

        expect(window.microBitManager.addMicroBit).toHaveBeenCalledWith(microBit);
        expect(window.microBitManager.wireMicroBitWithBlocks).toHaveBeenCalledWith('microbit-1');
        expect(button.classList.contains('connectButtonConnected')).toBe(true);

        button.onclick();
        vi.advanceTimersByTime(1000);

        expect(microBit.disconnect).toHaveBeenCalled();
        expect(window.microBitManager.removeMicroBit).toHaveBeenCalledWith(microBit);
        expect(button.onclick).toBe(oldOnClick);
        expect(button.classList.contains('connectButtonConnected')).toBe(false);
        expect(button.querySelector('.iconButtonContainer').classList.contains('notConnectedButtonContainer')).toBe(true);
        expect(microBit.__disconnectUnsubscribed).toBe(true);
    });
});

function createMartyRaft() {
    return {
        id: 'marty-1',
        getFriendlyName: () => 'Marty One',
        getBatteryStrength: () => 70,
        getRSSI: () => -45,
        publishedDataAnalyser: {
            connectedSensors: undefined
        }
    };
}

function createConnectionButton() {
    const button = new FakeElement();
    button.children['.iconButtonContainer'] = new FakeElement(['iconButtonContainer', 'notConnectedButtonContainer']);
    button.children['.batteryIndicatorContainer'] = new FakeElement(['batteryIndicatorContainer']);
    button.children['.signalIndicatorContainer'] = new FakeElement(['signalIndicatorContainer']);
    button.children['.raftNameConnectButton'] = new FakeElement(['raftNameConnectButton']);
    return button;
}

function createMicroBit() {
    const microBit = {
        id: 'microbit-1',
        getFriendlyName: () => 'micro:bit One',
        disconnect: vi.fn(() => {
            if (microBit.__disconnectCallback) {
                microBit.__disconnectCallback(microBit);
            }
        }),
        addDisconnectListener: vi.fn(callback => {
            microBit.__disconnectCallback = callback;
            return () => {
                microBit.__disconnectUnsubscribed = true;
            };
        })
    };
    return microBit;
}

class FakeElement {
    constructor(classes = []) {
        this.classList = new FakeClassList(classes);
        this.children = {};
        this.style = {};
        this.attributes = {};
        this.textContent = '';
        this.innerHTML = '';
        this.onclick = null;
    }

    querySelector(selector) {
        return this.children[selector] || null;
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }
}

class FakeClassList {
    constructor(classes = []) {
        this.classes = new Set(classes);
    }

    add(...classes) {
        classes.forEach(className => this.classes.add(className));
    }

    remove(...classes) {
        classes.forEach(className => this.classes.delete(className));
    }

    contains(className) {
        return this.classes.has(className);
    }
}
