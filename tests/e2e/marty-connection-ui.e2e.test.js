import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { newHTMLMock } = vi.hoisted(() => ({
    newHTMLMock: vi.fn()
}));

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
    newHTML: newHTMLMock,
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
    createRaftConnectionIssueDetectedHelper: raft => ({
        subscribe: vi.fn(callback => {
            raft.__connectionIssueDetectedCallback = callback;
        }),
        unsubscribe: vi.fn(() => {
            raft.__connectionIssueDetectedUnsubscribed = true;
        })
    }),
    createRaftConnectionIssueResolvedHelper: raft => ({
        subscribe: vi.fn(callback => {
            raft.__connectionIssueResolvedCallback = callback;
        }),
        unsubscribe: vi.fn(() => {
            raft.__connectionIssueResolvedUnsubscribed = true;
        })
    }),
    raftVerifiedSubscriptionHelper: raft => {
        let callback;
        return {
            subscribe: vi.fn(nextCallback => {
                callback = nextCallback;
                raft.__verifiedCallbacks = raft.__verifiedCallbacks || [];
                raft.__verifiedCallbacks.push(callback);
            }),
            unsubscribe: vi.fn(() => {
                raft.__verifiedUnsubscribeCount = (raft.__verifiedUnsubscribeCount || 0) + 1;
                raft.__verifiedCallbacks = (raft.__verifiedCallbacks || []).filter(item => item !== callback);
            })
        };
    },
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
            cogManager: {
                addCog: vi.fn(),
                wireCogWithBlocks: vi.fn(),
                removeCog: vi.fn()
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
        newHTMLMock.mockImplementation((type, className, parent) => {
            const element = new FakeElement(className ? [className] : []);
            if (parent) {
                parent.appendChild(element);
            }
            return element;
        });
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

    it('uses one verified subscription instance and cleans it up after setup', () => {
        const button = createConnectionButton();
        const raft = createCogRaft();
        const setupConnectionButton = vi.fn();

        UI.setupConnectionButtonWhenVerified(button, raft, setupConnectionButton);

        expect(raft.__verifiedCallbacks).toHaveLength(1);
        const verifiedCallback = raft.__verifiedCallbacks[0];
        raft.isVerified = true;
        verifiedCallback();
        verifiedCallback();

        expect(setupConnectionButton).toHaveBeenCalledTimes(1);
        expect(setupConnectionButton).toHaveBeenCalledWith(button, raft);
        expect(raft.__verifiedUnsubscribeCount).toBe(1);
        expect(raft.__verifiedCallbacks).toHaveLength(0);
    });

    it('sets up an already verified Cog even when its verified event was missed', () => {
        const button = createConnectionButton();
        const raft = createCogRaft();
        const setupConnectionButton = vi.fn();
        raft.isVerified = true;

        UI.setupConnectionButtonWhenVerified(button, raft, setupConnectionButton);

        expect(setupConnectionButton).toHaveBeenCalledWith(button, raft);
        expect(raft.__verifiedUnsubscribeCount).toBe(1);
        expect(raft.__verifiedCallbacks).toHaveLength(0);
    });

    it('reconciles an existing verified Cog after the host application manager is injected', () => {
        const cogButton = createConnectionButton();
        const martyButton = createConnectionButton();
        const raft = createCogRaft();
        raft.isVerified = true;
        const setupCogSpy = vi.spyOn(UI, 'setupCogConnectionButton').mockImplementation(() => {});
        window.applicationManager = undefined;

        expect(UI.reconcileConnectionButtonsWhenApplicationManagerReady(cogButton, martyButton)).toBe(false);
        window.applicationManager = {
            getTheCurrentlySelectedDeviceOrFirstOfItsKind: vi.fn(type => type === 'Cog' ? raft : undefined)
        };
        vi.advanceTimersByTime(100);

        expect(setupCogSpy).toHaveBeenCalledWith(cogButton, raft);
        expect(raft.__verifiedUnsubscribeCount).toBe(1);
        setupCogSpy.mockRestore();
    });

    it('disconnects and clears a stale Cog when the connection issue countdown expires', () => {
        const button = createConnectionButton();
        const raft = createCogRaft();
        window.applicationManager.disconnectGeneric = vi.fn((disconnectedRaft, onDisconnected) => {
            onDisconnected();
        });

        UI.setupCogConnectionButton(button, raft);
        raft.__connectionIssueDetectedCallback();

        expect(button.querySelector('.connIssueOverlay').textContent).toBe('A11Y_CONNECTION_LOST 60');
        expect(button.style.pointerEvents).toBe('none');

        vi.advanceTimersByTime(59000);
        expect(window.applicationManager.disconnectGeneric).not.toHaveBeenCalled();
        expect(button.querySelector('.connIssueOverlay').textContent).toBe('A11Y_CONNECTION_LOST 1');

        vi.advanceTimersByTime(1000);

        expect(window.applicationManager.disconnectGeneric).toHaveBeenCalledWith(raft, expect.any(Function), true);
        expect(window.cogManager.removeCog).toHaveBeenCalledWith(raft);
        expect(button.querySelector('.connIssueOverlay')).toBeNull();
        expect(button.style.pointerEvents).toBe('auto');
        expect(button.classList.contains('connectButtonConnected')).toBe(false);
        expect(raft.__connectionIssueDetectedUnsubscribed).toBe(true);
        expect(raft.__connectionIssueResolvedUnsubscribed).toBe(true);
    });

    it('cancels the Cog countdown when the connection issue resolves', () => {
        const button = createConnectionButton();
        const raft = createCogRaft();

        UI.setupCogConnectionButton(button, raft);
        raft.__connectionIssueDetectedCallback();
        vi.advanceTimersByTime(30000);
        raft.__connectionIssueResolvedCallback();
        vi.advanceTimersByTime(31000);

        expect(window.applicationManager.disconnectGeneric).not.toHaveBeenCalled();
        expect(button.querySelector('.connIssueOverlay')).toBeNull();
        expect(button.style.pointerEvents).toBe('auto');

        raft.__disconnectCallback();
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

function createCogRaft() {
    return {
        id: 'cog-1',
        isVerified: false,
        hasVerifiedConnection() {
            return this.isVerified;
        },
        getFriendlyName: () => 'Cog One',
        getBatteryStrength: () => 70,
        getRSSI: () => -45
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
        this.childNodes = [];
        this.style = {};
        this.attributes = {};
        this.textContent = '';
        this.innerHTML = '';
        this.onclick = null;
    }

    querySelector(selector) {
        if (this.children[selector]) {
            return this.children[selector];
        }
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            return this.childNodes.find(child => child.classList.contains(className)) || null;
        }
        return null;
    }

    appendChild(child) {
        if (!this.childNodes.includes(child)) {
            this.childNodes.push(child);
        }
        child.parentNode = this;
        return child;
    }

    removeChild(child) {
        this.childNodes = this.childNodes.filter(item => item !== child);
        child.parentNode = null;
        return child;
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
