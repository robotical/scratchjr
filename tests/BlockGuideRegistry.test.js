import { describe, expect, it } from 'vitest';
import {
    BLOCK_GUIDE_EXTENSION,
    BLOCK_GUIDE_METADATA,
    BLOCK_GUIDE_MODES,
    getDocumentedBlockIds
} from '../src/editor/blocks/BlockGuideRegistry';
import {
    COG_PALETTES,
    MARTY_PALETTES,
    MICROBIT_PALETTES,
    SPRITE_PALETTES
} from '../src/editor/blocks/BlockPaletteRegistry';

function flattenPalettes (palettes) {
    return palettes.reduce((all, category) => all.concat(category), [])
        .filter((blockId) => blockId !== 'space');
}

describe('Blocks Guide registry', () => {
    it('mirrors every block family that the editor can expose', () => {
        const expectedIds = new Set([
            ...flattenPalettes(SPRITE_PALETTES),
            ...flattenPalettes(MARTY_PALETTES),
            ...flattenPalettes(COG_PALETTES),
            ...flattenPalettes(MICROBIT_PALETTES),
            'playsnd',
            'playusersnd',
            'gotopage'
        ]);
        const documentedIds = new Set(getDocumentedBlockIds());

        expect([...documentedIds].sort()).toEqual([...expectedIds].sort());
        expect(documentedIds.size).toBe(88);
        expect(Object.keys(BLOCK_GUIDE_METADATA).sort()).toEqual([...expectedIds].sort());
    });

    it('keeps the requested modes self-contained and in editor order', () => {
        expect(BLOCK_GUIDE_MODES.map((mode) => mode.id)).toEqual(['marty', 'sprite', 'cog']);
        expect(BLOCK_GUIDE_MODES.map((mode) => mode.blockCount)).toEqual([44, 31, 19]);
        expect(BLOCK_GUIDE_MODES[0].categories.map((category) => category.id)).toEqual(
            ['start', 'motion', 'looks', 'sound', 'control', 'end']
        );
        expect(BLOCK_GUIDE_MODES[1].categories.map((category) => category.id)).toEqual(
            ['start', 'motion', 'looks', 'sound', 'control', 'end']
        );
        expect(BLOCK_GUIDE_MODES[2].categories.map((category) => category.id)).toEqual(
            ['start', 'looks', 'sound']
        );
        expect(BLOCK_GUIDE_EXTENSION.blockCount).toBe(7);
    });

    it('provides visible copy and artwork for every documented block', () => {
        Object.entries(BLOCK_GUIDE_METADATA).forEach(([blockId, item]) => {
            expect(item.title, `${blockId} title`).toBeTruthy();
            expect(item.description, `${blockId} description`).toBeTruthy();
            expect(Boolean(item.icon || item.symbol), `${blockId} artwork`).toBe(true);
        });
        expect(BLOCK_GUIDE_METADATA.microbittilted.icon)
            .toBe('../assets/blockicons/microbittiltright.svg');
    });
});
