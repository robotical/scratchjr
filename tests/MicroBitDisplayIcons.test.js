import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

const ASSET_DIRECTORY = join('editions', 'free', 'src', 'assets');
const DISPLAY_BLOCK_ASSETS = [
    {
        file: join('blockicons', 'microbitdisplayheart.svg'),
        sha256: 'b12535dcce9d82ac7a0864350f3b233fa13567f99658bd0a16086898d2a98ef6'
    },
    {
        file: join('blockicons', 'microbitdisplayhappy.svg'),
        sha256: '0d57963fd277a98ce74432932c3c947469f97b81f666b21aa2e08ee9e52b4ca5'
    },
    {
        file: join('blockicons', 'microbitdisplaytext.svg'),
        sha256: 'dd3ce8e73c5522e8ba892df5025c10a2e29abe69433499567ce9f3a58c86a7d8'
    },
    {
        file: join('blockicons', 'microbitdisplayclear.svg'),
        sha256: '13f770c0440c68755f1a9510feb3006cc3e6eb3b58b7769fdda35e22335c6ac5'
    },
    {
        file: join('blockicons', 'microbitdisplaycustom.svg'),
        sha256: '0cd57758e84747856a122b56f6db0edcbe75ea924ae6cb3ba03c7c1c7e535627'
    }
];

describe('micro:bit display artwork', () => {
    DISPLAY_BLOCK_ASSETS.forEach(({file, sha256}) => {
        it(`${file} uses the supplied display artwork`, () => {
            const svg = readFileSync(join(ASSET_DIRECTORY, file), 'utf8');
            const digest = createHash('sha256').update(svg).digest('hex');

            expect(digest).toBe(sha256);
            expect(svg).toMatch(/<svg\b[^>]*width="76"[^>]*height="66"/);
            expect(svg).toContain('viewBox="0 0 76 66"');
            expect(svg.match(/<rect\b/g)).toHaveLength(26);
        });
    });

    DISPLAY_BLOCK_ASSETS
        .filter(({file}) => !file.endsWith('microbitdisplayclear.svg') &&
            !file.endsWith('microbitdisplaycustom.svg'))
        .forEach(({file}) => {
            it(`${file} uses the supplied light colour for lit LEDs`, () => {
                const svg = readFileSync(join(ASSET_DIRECTORY, file), 'utf8');

                expect(svg).toContain('#ececec');
            });
        });

    it('shows the supplied clear-display badge', () => {
        const svg = readFileSync(join(ASSET_DIRECTORY, 'blockicons', 'microbitdisplayclear.svg'), 'utf8');

        expect(svg).toContain('#ef3e23');
        expect(svg).toContain('#fff');
        expect(svg).toContain('<circle');
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

    it('keeps the placed custom block preview in sync with the editor', () => {
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
        expect(blockSpecs).toContain(
            "BlockSpecs.getImageFrom('assets/blockicons/microbitdisplaycustom', 'svg')"
        );
        expect(blockArg).toContain('if (this.daddy.inpalette)');
        expect(blockArg).toContain('this.daddy.drawMyIcon(ctx, 0, 0);');
        expect(blockArg).toContain('this.button = this.addPressButton();');
        expect(blockArg).toContain('this.drawMicroBitEditorIndicator(ctx, scale);');
        expect(blockArg).toContain('ctx.drawImage(paintbrush, 38, 28, 30, 30);');
    });
});
