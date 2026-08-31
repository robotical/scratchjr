import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {microBitSvg} from '../src/html-svgs/microbit';

const ASSET_DIRECTORY = join('editions', 'free', 'src', 'assets');
const SOURCE_ASSET = join(ASSET_DIRECTORY, 'microbit-small.svg');
const SOURCE_SHA256 = '14969a60ff02ae6d1fe734ed2af0fe4256166daf076c23230fe4f36075c21646';
const DERIVATIVE_ASSETS = [
    join('categories', 'MicroBitStartOn.svg'),
    join('categories', 'MicroBitStartOff.svg'),
    join('categories', 'MicroBitLooksOn.svg'),
    join('categories', 'MicroBitLooksOff.svg'),
    join('blockicons', 'microbittiltany.svg'),
    join('blockicons', 'microbittiltright.svg'),
    join('blockicons', 'microbittiltleft.svg'),
    join('blockicons', 'microbittiltbackward.svg'),
    join('blockicons', 'microbittiltforward.svg')
];
const TILT_ASSETS = DERIVATIVE_ASSETS.filter((file) => file.includes('microbittilt'));

describe('MartyBlocks micro:bit artwork', () => {
    it('keeps an exact copy of the MartyBlocks microbit-small source asset', () => {
        const sourceSvg = readFileSync(SOURCE_ASSET, 'utf8').trimEnd();
        const digest = createHash('sha256').update(sourceSvg).digest('hex');

        expect(digest).toBe(SOURCE_SHA256);
        expect(sourceSvg).toContain('<g id="microbit-block-icon"');
    });

    it('uses the exact source artwork in connection and extension UI', () => {
        const sourceSvg = readFileSync(SOURCE_ASSET, 'utf8')
            .trimEnd()
            .replace(/^<\?xml[^>]*>\s*/, '')
            .replace(/(<svg\b[^>]*)(>)/, '$1 role="img" aria-label="micro:bit"$2');

        expect(microBitSvg.trim()).toBe(sourceSvg);
    });

    DERIVATIVE_ASSETS.forEach((file) => {
        it(`${file} embeds the canonical artwork for image and canvas rendering`, () => {
            const svg = readFileSync(join(ASSET_DIRECTORY, file), 'utf8');

            expect(svg).toContain('data-microbit-source="microbit-small"');
            expect(svg).toContain(`data-microbit-source-sha256="${SOURCE_SHA256}"`);
            expect(svg).toContain('fill="#414757"');
            expect(svg).toContain('fill="#4C97FF"');
            expect(svg).toContain('fill="#FFBF00"');
            expect(svg).not.toContain('../microbit-small.svg');
        });
    });

    it('keeps the micro:bit artwork enlarged consistently across tilt variants', () => {
        TILT_ASSETS.forEach((file) => {
            const svg = readFileSync(join(ASSET_DIRECTORY, file), 'utf8');

            expect(svg).toContain('transform="translate(42.5 31) scale(1.15) translate(-20 -20)"');
        });
    });
});
