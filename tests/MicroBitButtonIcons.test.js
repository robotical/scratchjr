import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

const ICON_DIRECTORY = join('editions', 'free', 'src', 'assets', 'blockicons');
const BUTTON_ICONS = [
    {
        file: 'microbitbuttona.svg',
        sha256: 'e17e4f58f83e59a140479b08a7e9e1f0e178f5159a6f23231c15656b2971b525'
    },
    {
        file: 'microbitbuttonb.svg',
        sha256: '0f40c54399c2f8d9f86bf50fb7d5193ddaa83f66dfa6dbced924d1076d0a2f1f'
    },
    {
        file: 'microbitbuttonab.svg',
        sha256: '64150c9211acb9d795092f139818ffc6afdb48967743f07d404ab49aa960f259'
    }
];

describe('micro:bit button icons', () => {
    BUTTON_ICONS.forEach(({file, sha256}) => {
        it(`${file} uses the supplied button-press artwork`, () => {
            const svg = readFileSync(join(ICON_DIRECTORY, file), 'utf8');
            const digest = createHash('sha256').update(svg).digest('hex');

            expect(digest).toBe(sha256);
            expect(svg).toMatch(/<svg\b[^>]*width="85"[^>]*height="66"/);
            expect(svg).toContain('viewBox="0 0 85 66"');
            expect(svg).not.toMatch(/<text\b/);
        });
    });

    it('uses the supplied start-on-move artwork', () => {
        const svg = readFileSync(join(ICON_DIRECTORY, 'microbitgesturemoved.svg'), 'utf8');
        const digest = createHash('sha256').update(svg).digest('hex');

        expect(digest).toBe('710b3e683c0a47b28e4fdd724494d237c0f61021c7a11d73c793362df95f87fc');
        expect(svg).toMatch(/<svg\b[^>]*width="85"[^>]*height="66"/);
        expect(svg).toContain('viewBox="0 0 85 66"');
    });
});
