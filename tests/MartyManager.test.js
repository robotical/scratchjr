import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/editor/engine/Prims', () => ({ default: {} }));
vi.mock('@/marty/MartyBlocks', () => ({ default: class MartyBlocks {} }));

import MartyManager from '@/marty/MartyManager';

const STANDARD_SENSOR_BLOCKS = [
    'martycoloursensed',
    'martyobstaclesensed'
];

describe('Marty sensor block visibility', () => {
    let logSpy;

    beforeEach(() => {
        global.window = {};
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        logSpy.mockRestore();
        delete global.window;
    });

    it('always exposes the standard colour and obstacle sensor blocks', () => {
        const manager = new MartyManager();

        expect(manager.getVisibleMartySensorBlocks()).toEqual(STANDARD_SENSOR_BLOCKS);

        manager.addMarty({ id: 'marty-1' });
        manager.setMartySensorAvailability('marty-1', {
            colour: false,
            obstacle: false,
            light: false,
            noise: false
        });

        expect(manager.getVisibleMartySensorBlocks()).toEqual(STANDARD_SENSOR_BLOCKS);
    });

    it('only exposes the optional light and noise blocks when those sensors are available', () => {
        const manager = new MartyManager();
        manager.addMarty({ id: 'marty-1' });

        manager.setMartySensorAvailability('marty-1', {
            light: true,
            noise: false
        });
        expect(manager.getVisibleMartySensorBlocks()).toEqual([
            ...STANDARD_SENSOR_BLOCKS,
            'martylightsensed'
        ]);

        manager.setMartySensorAvailability('marty-1', {
            light: false,
            noise: true
        });
        expect(manager.getVisibleMartySensorBlocks()).toEqual([
            ...STANDARD_SENSOR_BLOCKS,
            'martynoisesensed'
        ]);

        manager.setMartySensorAvailability('marty-1', {
            light: true,
            noise: true
        });
        expect(manager.getVisibleMartySensorBlocks()).toEqual([
            ...STANDARD_SENSOR_BLOCKS,
            'martylightsensed',
            'martynoisesensed'
        ]);
    });

    it('returns to the standard blocks when the active Marty disconnects', () => {
        const manager = new MartyManager();
        const marty = { id: 'marty-1' };
        manager.addMarty(marty);
        manager.setMartySensorAvailability(marty.id, {
            light: true,
            noise: true
        });

        manager.removeMarty(marty);

        expect(manager.getVisibleMartySensorBlocks()).toEqual(STANDARD_SENSOR_BLOCKS);
    });
});
