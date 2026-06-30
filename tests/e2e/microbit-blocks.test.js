import { beforeEach, describe, expect, it, vi } from 'vitest';

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

    beforeEach(async () => {
        vi.clearAllMocks();
        sensorListener = null;
        const [blocksModule, primsModule] = await Promise.all([
            import('@/microbit/MicroBitBlocks.js'),
            import('@/editor/engine/Prims')
        ]);
        MicroBitBlocks = blocksModule.default;
        Prims = primsModule.default;
    });

    it('emits button events on button press transitions', () => {
        new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({buttonA: 1}),
            createSensors({buttonA: 0})
        );

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitbuttona');
        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitbuttonany');
    });

    it('emits gesture events on gesture bit transitions', () => {
        new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({gestureState: 1}),
            createSensors({gestureState: 0})
        );

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitgestureshaken');
    });

    it('emits tilt events on every tilted sensor update', () => {
        new MicroBitBlocks(createMicroBit());

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

    it('emits pin connected events on touch pin transitions', () => {
        new MicroBitBlocks(createMicroBit());

        sensorListener(
            createSensors({touchPins: [0, 1, 0]}),
            createSensors({touchPins: [0, 0, 0]})
        );

        expect(Prims.OnMicroBitEvent).toHaveBeenCalledWith('microbitpin1');
    });

    it('sends matrix rows for display symbols', () => {
        const microBit = createMicroBit();
        const blocks = new MicroBitBlocks(microBit);

        blocks.displaySymbol('microbitdisplayheart');

        expect(microBit.displayMatrix).toHaveBeenCalledWith(new Uint8Array([10, 31, 31, 14, 4]));
    });

    it('sends matrix rows for custom display patterns', () => {
        const microBit = createMicroBit();
        const blocks = new MicroBitBlocks(microBit);

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
