import {describe, expect, it} from 'vitest';
import {
    DEFAULT_MICROBIT_MATRIX_PATTERN,
    normalizeMicroBitMatrixPattern
} from '../src/microbit/MicroBitMatrixPattern';

describe('micro:bit matrix patterns', () => {
    it('defaults new custom display blocks to a blank screen', () => {
        expect(DEFAULT_MICROBIT_MATRIX_PATTERN).toBe('00000/00000/00000/00000/00000');
        expect(normalizeMicroBitMatrixPattern()).toBe(DEFAULT_MICROBIT_MATRIX_PATTERN);
    });

    it('preserves valid patterns loaded from existing projects', () => {
        const existingPattern = '00100/01110/10101/00100/00100';

        expect(normalizeMicroBitMatrixPattern(existingPattern)).toBe(existingPattern);
    });
});
