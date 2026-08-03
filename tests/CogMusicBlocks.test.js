import {describe, expect, it, vi} from 'vitest';
import CogMusicBlocks from '../src/cog/CogMusicBlocks';

describe('Cog music rests', () => {
    it.each([
        [1, 500],
        [2, 1000],
        [3, 1500],
        [4, 2000],
        [5, 2500],
        [6, 3000],
        [7, 3500],
        [8, 4000],
        [9, 4500]
    ])('waits for %i beats at the default tempo', (beats, expectedDuration) => {
        const cog = {sendRestMessage: vi.fn()};
        const music = new CogMusicBlocks(cog);

        expect(music.rest(beats)).toBe(expectedDuration);
        expect(cog.sendRestMessage).not.toHaveBeenCalled();
    });

    it('scales rest duration with the selected tempo', () => {
        const music = new CogMusicBlocks({sendRestMessage: vi.fn()});

        music.setTempo(60);
        expect(music.rest(9)).toBe(9000);

        music.setTempo(240);
        expect(music.rest(9)).toBe(2250);
    });

    it('keeps invalid and legacy saved arguments within the supported range', () => {
        const music = new CogMusicBlocks({sendRestMessage: vi.fn()});

        expect(music.rest(0)).toBe(500);
        expect(music.rest(10)).toBe(4500);
        expect(music.rest('not-a-number')).toBe(500);
    });
});
