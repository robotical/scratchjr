import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrims } = vi.hoisted(() => ({
    mockPrims: {
        OnMicroBitEvent: vi.fn()
    }
}));

vi.mock('@/editor/engine/Prims', () => ({
    default: mockPrims
}));

vi.mock('../../src/editor/engine/Prims', () => ({
    default: mockPrims
}));

describe('MicroBitBlocks', () => {
    let MicroBitBlocks;
    let Prims;
    let sensorListener;
    let blocks;

    beforeEach(async () => {
        vi.clearAllMocks();
        sensorListener = null;
        blocks = null;
        const [blocksModule, primsModule] = await Promise.all([
            import('@/microbit/MicroBitBlocks.js'),
            import('@/editor/engine/Prims')
        ]);
        MicroBitBlocks = blocksModule.default;
        Prims = primsModule.default;
    });

    afterEach(() => {
        if (blocks) {
            blocks.destroy();
        }
        vi.useRealTimers();
    });

    it('emits individual button events after the combo window', () => {
        vi.useFakeTimers();
        blocks = new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({buttonA: 1}),
            createSensors({buttonA: 0})
        );

        expect(Prims.OnMicroBitEvent).not.toHaveBeenCalled();

        vi.advanceTimersByTime(120);

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitbuttona');
        expect(Prims.OnMicroBitEvent).not.toHaveBeenCalledWith('microbitbuttonab');
    });

    it('emits A+B button events when both buttons are pressed together', () => {
        blocks = new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({buttonA: 1, buttonB: 1}),
            createSensors({buttonA: 0, buttonB: 0})
        );

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitbuttonab');
        expect(Prims.OnMicroBitEvent).not.toHaveBeenCalledWith('microbitbuttona');
        expect(Prims.OnMicroBitEvent).not.toHaveBeenCalledWith('microbitbuttonb');
    });

    it('promotes a near-simultaneous second button press to A+B', () => {
        vi.useFakeTimers();
        blocks = new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({buttonA: 1}),
            createSensors({buttonA: 0})
        );
        vi.advanceTimersByTime(60);
        sensorListener(
            createSensors({buttonA: 1, buttonB: 1}),
            createSensors({buttonA: 1, buttonB: 0})
        );
        vi.advanceTimersByTime(120);

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledTimes(1);
        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitbuttonab');
    });

    it('emits legacy and consolidated movement events on gesture bit transitions', () => {
        blocks = new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({gestureState: 1}),
            createSensors({gestureState: 0})
        );

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitgestureshaken');
        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitonmove');
        expect(Prims.OnMicroBitEvent).toHaveBeenCalledTimes(2);
    });

    it('emits tilt events on every tilted sensor update', () => {
        blocks = new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({tiltX: -180}),
            createSensors({tiltX: 0})
        );
        sensorListener(
            createSensors({tiltX: -180}),
            createSensors({tiltX: -180})
        );

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbittiltany');
        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbittiltleft');
        expect(Prims.OnMicroBitEvent).toHaveBeenCalledTimes(4);
    });

    it('sends matrix rows for display symbols', () => {
        const microBit = createMicroBit();
        blocks = new MicroBitBlocks(microBit);

        blocks.displaySymbol('microbitdisplayheart');

        expect(microBit.displayMatrix).toHaveBeenCalledWith(new Uint8Array([10, 31, 31, 14, 4]));
    });

    it('sends matrix rows for custom display patterns', () => {
        const microBit = createMicroBit();
        blocks = new MicroBitBlocks(microBit);

        blocks.displayPattern('10000/01000/00100/00010/00001');

        expect(microBit.displayMatrix).toHaveBeenCalledWith(new Uint8Array([1, 2, 4, 8, 16]));
    });

    function createMicroBit(sensors = createSensors()) {
        return {
            sensors,
            addSensorListener: vi.fn(callback => {
                sensorListener = callback;
                return vi.fn();
            }),
            isConnected: () => true,
            displayMatrix: vi.fn(),
            displayText: vi.fn(),
            clearDisplay: vi.fn()
        };
    }

    function createSensors(overrides = {}) {
        return {
            tiltX: 0,
            tiltY: 0,
            buttonA: 0,
            buttonB: 0,
            touchPins: [0, 0, 0],
            gestureState: 0,
            ...overrides
        };
    }
});
