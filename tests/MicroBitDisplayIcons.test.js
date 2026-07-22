import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

const ASSET_DIRECTORY = join('editions', 'free', 'src', 'assets');
const DISPLAY_BLOCK_ASSETS = [
    join('blockicons', 'microbitdisplayheart.svg'),
    join('blockicons', 'microbitdisplayhappy.svg'),
    join('blockicons', 'microbitdisplaytext.svg'),
    join('blockicons', 'microbitdisplayclear.svg')
];

describe('micro:bit display artwork', () => {
    DISPLAY_BLOCK_ASSETS.forEach((file) => {
        it(`${file} uses a display-only treatment`, () => {
            const svg = readFileSync(join(ASSET_DIRECTORY, file), 'utf8');

            expect(svg).toContain('data-microbit-display="true"');
            expect(svg).toContain('transform="translate(-5 0)"');
            expect(svg).toContain('fill="#414757"');
            expect(svg).not.toMatch(/#35c1df/i);
            expect(svg).not.toMatch(/#4c97ff/i);
            expect(svg).not.toMatch(/#ffbf00/i);
        });
    });

    DISPLAY_BLOCK_ASSETS.filter((file) => !file.endsWith('microbitdisplayclear.svg')).forEach((file) => {
        it(`${file} uses white for lit LEDs`, () => {
            const svg = readFileSync(join(ASSET_DIRECTORY, file), 'utf8');

            expect(svg).toContain('#FFFFFF');
        });
    });

    it('shows clear display as a fully unlit 5x5 matrix without an X', () => {
        const svg = readFileSync(join(ASSET_DIRECTORY, 'blockicons', 'microbitdisplayclear.svg'), 'utf8');

        expect(svg.match(/rx="0\.8"/g)).toHaveLength(25);
        expect(svg).not.toContain('data-led-state="on"');
        expect(svg).not.toContain('#FFFFFF');
        expect(svg).not.toContain('<path');
    });

    ['MicroBitLooksOn.svg', 'MicroBitLooksOff.svg'].forEach((file) => {
        it(`${file} keeps the full micro:bit category artwork`, () => {
            const svg = readFileSync(join(ASSET_DIRECTORY, 'categories', file), 'utf8');

            expect(svg).not.toContain('data-microbit-display="true"');
            expect(svg).toContain('data-microbit-source="microbit-small"');
            expect(svg).toMatch(/#4c97ff/i);
            expect(svg).toMatch(/#ffbf00/i);
        });
    });

    it('uses the same white LED colour for the custom preview and editor', () => {
        const blockArg = readFileSync(join('src', 'editor', 'blocks', 'BlockArg.js'), 'utf8');
        const editorCss = readFileSync(join('editions', 'free', 'src', 'css', 'editor.css'), 'utf8');

        expect(blockArg).toContain('drawMicroBitDisplay');
        expect(blockArg).toMatch(/drawMicroBitDisplay\(ctx,.*?, 13, 8, 49, 49\);/);
        expect(blockArg).toContain("enabled ? '#FFFFFF' : '#7C87A5'");
        expect(blockArg).not.toContain('drawMicroBitBoard');
        expect(editorCss).toMatch(/\.microbitMatrixCell\.on\s*\{[^}]*background:\s*#FFFFFF;/s);
    });

    it('overlays the paintbrush artwork while retaining the editor arrow', () => {
        const blockArg = readFileSync(join('src', 'editor', 'blocks', 'BlockArg.js'), 'utf8');
        const blockSpecs = readFileSync(join('src', 'editor', 'blocks', 'BlockSpecs.js'), 'utf8');

        expect(blockSpecs).toContain(
            "BlockSpecs.paintbrush = BlockSpecs.getImageFrom('assets/paint/paintbrush', 'svg');"
        );
        expect(blockArg).toContain('this.button = this.addPressButton();');
        expect(blockArg).toContain('this.drawMicroBitEditorIndicator(ctx, scale);');
        expect(blockArg).toContain('ctx.drawImage(paintbrush, 38, 28, 30, 30);');
    });
});
