import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

const ICON_DIRECTORY = join('editions', 'free', 'src', 'assets', 'blockicons');
const BUTTON_ICONS = [
    {file: 'microbitbuttona.svg', handCount: 1},
    {file: 'microbitbuttonb.svg', handCount: 1},
    {file: 'microbitbuttonab.svg', handCount: 2}
];

describe('micro:bit button icons', () => {
    BUTTON_ICONS.forEach(({file, handCount}) => {
        it(`${file} uses hands instead of letter labels`, () => {
            const svg = readFileSync(join(ICON_DIRECTORY, file), 'utf8');
            const hands = svg.match(/<use href="#button-press-hand"/g) || [];

            expect(svg).not.toMatch(/<text\b/);
            expect(svg).toContain('fill="#34332b"');
            expect(svg).toContain('fill="#fff"');
            expect(hands).toHaveLength(handCount);
        });
    });
});
