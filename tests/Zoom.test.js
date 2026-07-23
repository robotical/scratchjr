import {describe, expect, it} from 'vitest';
import Zoom from '../src/editor/ui/Zoom';

describe('script editor zoom', () => {
    it('zooms out and in persistently in 20% steps', () => {
        const scriptsContainer = {style: {}};
        const zoom = new Zoom(scriptsContainer);

        zoom.zoomOut();
        expect(zoom.zoomLevel).toBe(0.8);
        expect(scriptsContainer.style.transform).toBe('scale(0.8)');

        zoom.zoomOut();
        expect(zoom.zoomLevel).toBe(0.6);
        expect(scriptsContainer.style.transform).toBe('scale(0.6)');

        zoom.zoomIn();
        expect(zoom.zoomLevel).toBe(0.8);
        expect(scriptsContainer.style.transform).toBe('scale(0.8)');
    });

    it('keeps zoom within the supported range', () => {
        const scriptsContainer = {style: {}};
        const zoom = new Zoom(scriptsContainer);

        for (let i = 0; i < 20; i++) {
            zoom.zoomOut();
        }
        expect(zoom.zoomLevel).toBe(0.2);
        expect(scriptsContainer.style.transform).toBe('scale(0.2)');

        for (let i = 0; i < 20; i++) {
            zoom.zoomIn();
        }
        expect(zoom.zoomLevel).toBe(2);
        expect(scriptsContainer.style.transform).toBe('scale(2)');
    });

    it('maps screen coordinates back into the zoomed scripts canvas', () => {
        const scriptsContainer = {
            style: {},
            offsetWidth: 500,
            offsetHeight: 300,
            getBoundingClientRect: () => ({
                left: 100,
                top: 50,
                width: 400,
                height: 240
            })
        };
        const zoom = new Zoom(scriptsContainer);

        expect(zoom.getLocalPoint(scriptsContainer, 260, 170)).toEqual({
            x: 200,
            y: 150
        });
        expect(zoom.getRenderedScale()).toBe(0.8);
    });
});
