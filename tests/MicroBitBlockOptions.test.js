import {describe, expect, it} from 'vitest';
import {
    MICROBIT_DEFAULT_TILT_OPTION,
    MICROBIT_LEGACY_TILT_ANY_OPTION,
    MICROBIT_TILT_OPTIONS,
    resolveMicroBitTiltIcon
} from '../src/microbit/MicroBitBlockOptions';

describe('micro:bit block options', () => {
    it('offers only directional tilt choices for new blocks', () => {
        expect(MICROBIT_TILT_OPTIONS).toEqual([
            'microbittiltright',
            'microbittiltleft',
            'microbittiltbackward',
            'microbittiltforward'
        ]);
        expect(MICROBIT_DEFAULT_TILT_OPTION).toBe('microbittiltright');
        expect(MICROBIT_TILT_OPTIONS).not.toContain(MICROBIT_LEGACY_TILT_ANY_OPTION);
    });

    it('keeps the tilt-any artwork for legacy saved arguments', () => {
        expect(resolveMicroBitTiltIcon('microbittiltany', MICROBIT_TILT_OPTIONS))
            .toBe('microbittiltany');
        expect(resolveMicroBitTiltIcon('tilt_any', MICROBIT_TILT_OPTIONS))
            .toBe('microbittiltany');
        expect(resolveMicroBitTiltIcon('tiltright', MICROBIT_TILT_OPTIONS))
            .toBe('microbittiltright');
    });

    it('falls back safely when an unknown tilt argument is loaded', () => {
        expect(resolveMicroBitTiltIcon('unknown', MICROBIT_TILT_OPTIONS))
            .toBe(MICROBIT_DEFAULT_TILT_OPTION);
    });
});
