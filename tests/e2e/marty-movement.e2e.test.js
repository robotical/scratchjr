import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ApplicationManagerMock from '@/utils/ApplicationManagerMock';

const noop = () => {};

vi.mock('@/editor/ScratchJr', () => {
    const runtime = {
        threadsRunning: [],
        restartThread: vi.fn((spr, block) => ({ spr, firstBlock: block, isRunning: true })),
        isScriptRunningForThatBlock: vi.fn(() => false)
    };

    return {
        default: {
            runtime,
            stage: null,
            startCurrentPageStrips: vi.fn(),
            stopStrips: vi.fn(),
            updateRunStopButtons: vi.fn()
        }
    };
});

vi.mock('@/utils/ScratchAudio', () => ({
    default: {
        sndFX: vi.fn()
    }
}));

vi.mock('@/editor/ui/UI', () => ({ default: {} }));
vi.mock('@/editor/ui/Grid', () => ({ default: { size: 24 } }));
vi.mock('@/utils/lib', () => ({
    gn: () => null,
    rgbToHex: value => value
}));

describe('Marty movement blocks', () => {
    let Prims;
    let MartyBlocks;
    let mockMarty;
    let consoleSpy;
    let appManager;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        vi.useFakeTimers();
        global.window = { navigator: { userAgent: '' } };
        global.document = { documentElement: {} };
        consoleSpy = vi.spyOn(console, 'log').mockImplementation(noop);

        const [primsModule, martyBlocksModule] = await Promise.all([
            import('@/editor/engine/Prims.js'),
            import('@/marty/MartyBlocks.js')
        ]);
        Prims = primsModule.default;
        MartyBlocks = martyBlocksModule.default;
        Prims.init();

        appManager = new ApplicationManagerMock();
        window.applicationManager = appManager;
        mockMarty = createMartyFromApplicationManagerMock(appManager);
        Prims.martyBlocks = new MartyBlocks(mockMarty);
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        vi.runAllTimers();
        vi.useRealTimers();
    });

    it('keeps one-to-one steps for a simple walk cycle', () => {
        const head = buildBlocks([
            ['martyStepForward', 1],
            ['martyStepLeft', 1],
            ['martyStepRight', 1],
            ['martyStepBackward', 1]
        ]);
        const sprite = new TestSprite();
        runScript(Prims, head, sprite);

        expect(sentCommands(mockMarty)).toEqual([
            'traj/step/1/?moveTime=1500&stepLength=25',
            'traj/sidestep/1/?side=0&moveTime=1500&stepLength=35',
            'traj/sidestep/1/?side=1&moveTime=1500&stepLength=35',
            'traj/step/1/?moveTime=1500&stepLength=-25'
        ]);
        expect(loggedActions(consoleSpy)).toEqual([
            'stepForward',
            'stepLeft',
            'stepRight',
            'stepBackward'
        ]);
        expect(sprite.xcoor).toBeCloseTo(0, 5);
        expect(sprite.ycoor).toBeCloseTo(0, 5);
    });

    it('turn blocks respect their arguments and complete the sequence', () => {
        const head = buildBlocks([
            ['martyTurnLeft', 1],
            ['martyTurnRight', 1]
        ]);
        const sprite = new TestSprite();
        runScript(Prims, head, sprite);

        expect(sentCommands(mockMarty)).toEqual([
            'traj/step/1/?moveTime=1500&turn=10&stepLength=1',
            'traj/step/1/?moveTime=1500&turn=-10&stepLength=1'
        ]);
        expect(loggedActions(consoleSpy)).toEqual([
            'turnLeft',
            'turnRight'
        ]);
        expect(sprite.angle).toBeCloseTo(0, 5);
    });

    it('does not resend commands when previous timeouts fire mid-sequence', () => {
        const head = buildBlocks([
            ['martyStepForward', 1],
            ['martyStepLeft', 1],
            ['martyStepRight', 1],
            ['martyStepBackward', 1]
        ]);
        const sprite = new TestSprite();
        runScript(Prims, head, sprite, { advanceMsPerTick: 200 });

        expect(sentCommands(mockMarty)).toEqual([
            'traj/step/1/?moveTime=1500&stepLength=25',
            'traj/sidestep/1/?side=0&moveTime=1500&stepLength=35',
            'traj/sidestep/1/?side=1&moveTime=1500&stepLength=35',
            'traj/step/1/?moveTime=1500&stepLength=-25'
        ]);
    });
});

function runScript(Prims, head, sprite, options = {}) {
    const { advanceMsPerTick = 0 } = options;
    const strip = {
        spr: sprite,
        thisblock: head,
        firstBlock: head,
        oldblock: null,
        stack: [],
        firstTime: true,
        count: -1,
        waitTimer: 0,
        distance: -1,
        vector: { x: 0, y: 0 },
        called: [],
        isRunning: true,
        cmdSent: false
    };

    let ticks = 0;
    const maxTicks = 10000;

    while (strip.thisblock && ticks < maxTicks) {
        if (strip.waitTimer > 0) {
            strip.waitTimer -= 1;
            ticks += 1;
            if (advanceMsPerTick) {
                vi.advanceTimersByTime(advanceMsPerTick);
            }
            continue;
        }
        const prim = Prims.table[strip.thisblock.blocktype];
        if (!prim) {
            throw new Error(`No prim registered for ${strip.thisblock.blocktype}`);
        }
        prim(strip);
        ticks += 1;
        if (advanceMsPerTick) {
            vi.advanceTimersByTime(advanceMsPerTick);
        }
    }

    if (ticks >= maxTicks) {
        throw new Error('Script execution did not finish');
    }

    return strip;
}

function buildBlocks(sequence) {
    const blocks = sequence.map(([type, arg]) => new TestBlock(type, arg));
    for (let i = 0; i < blocks.length - 1; i += 1) {
        blocks[i].next = blocks[i + 1];
        blocks[i + 1].previousBlock = blocks[i];
    }
    return blocks[0] || null;
}

class TestBlock {
    constructor(type, argValue) {
        this.blocktype = type;
        this.argValue = argValue;
        this.next = null;
        this.previousBlock = null;
    }

    getArgValue() {
        return this.argValue;
    }

    findFirst() {
        let node = this;
        while (node.previousBlock) {
            node = node.previousBlock;
        }
        return node;
    }

    closeBalloon() {
        // no-op stub for compatibility with Thread.stop
    }
}

class TestSprite {
    constructor() {
        this.xcoor = 0;
        this.ycoor = 0;
        this.angle = 0;
        this.speed = 1;
    }

    setPos(x, y) {
        this.xcoor = x;
        this.ycoor = y;
    }

    setHeading(angle) {
        this.angle = angle;
    }

    closeBalloon() {
        // no-op stub for compatibility with Thread.stop
    }
}

function createMartyFromApplicationManagerMock(appManager) {
    const raft = appManager.getTheCurrentlySelectedDeviceOrFirstOfItsKind('Marty');
    raft.sendRestMessage = vi.fn();
    raft.getRaftVersion = () => '2.0.0';
    raft.publishedDataAnalyser = {
        eventsMap: {
            colourSensed: {
                red: 'red',
                green: 'green',
                blue: 'blue',
                purple: 'purple',
                yellow: 'yellow',
                air: 'air',
                unclear: 'unclear'
            },
            objectSense: {
                near: 'near',
                none: 'none'
            },
            lightSense: {
                none: 'light-none',
                mid: 'light-mid',
                high: 'light-high'
            },
            noiseSense: {
                high: 'noise-high',
                low: 'noise-low'
            }
        },
        on: vi.fn()
    };
    return raft;
}

function sentCommands(fakeMarty) {
    return fakeMarty.sendRestMessage.mock.calls.map(args => args[0]);
}

function loggedActions(spy) {
    return spy.mock.calls
        .filter(call => typeof call[0] === 'string' && call[0].startsWith('[MartyBlocks]'))
        .map(call => call[1]?.action);
}
