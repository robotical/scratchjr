import { describe, expect, it } from 'vitest';
import englishMessages from '../editions/free/src/localizations/en.json';

describe('asset library labels', () => {
    it('describes the background library as backgrounds and surfaces', () => {
        expect(englishMessages.LIBRARY_BACKGROUND).toBe('Backgrounds and Surfaces');
    });
});
