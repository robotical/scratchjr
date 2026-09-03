import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/painteditor/Path', () => ({default: {}}));
vi.mock('../src/painteditor/Paint', () => ({default: {}}));
vi.mock('../src/painteditor/Layer', () => ({default: {}}));
vi.mock('../src/painteditor/PaintAction', () => ({default: {}}));
vi.mock('../src/painteditor/Transform', () => ({
    default: {getRotationAngle: () => 0}
}));
vi.mock('../src/painteditor/SVGTools', () => ({
    default: {getBoxCenter: () => ({x: 5, y: 10})}
}));
vi.mock('../src/utils/SVG2Canvas', () => ({
    default: {processXMLnode: vi.fn()}
}));
vi.mock('../src/utils/lib', () => ({
    DEGTOR: Math.PI / 180,
    getIdFor: vi.fn(),
    getIdForCamera: vi.fn(),
    gn: vi.fn(),
    setCanvasSize: (canvas, width, height) => {
        canvas.width = width;
        canvas.height = height;
    }
}));

import SVGImage from '../src/painteditor/SVGImage';
import SVG2Canvas from '../src/utils/SVG2Canvas';

function makeContext(canvas) {
    return {
        canvas,
        drawImage: vi.fn(),
        fillRect: vi.fn(),
        restore: vi.fn(),
        rotate: vi.fn(),
        save: vi.fn(),
        translate: vi.fn()
    };
}

function makeImageElement() {
    return {
        getAttribute: (name) => ({
            height: '20',
            width: '10',
            x: '2',
            'xlink:href': 'data:image/png;base64,image-data',
            y: '3'
        })[name]
    };
}

describe('SVG image canvas rendering', () => {
    let innerContext;
    let outerContext;

    beforeEach(() => {
        SVG2Canvas.processXMLnode.mockClear();
        const innerCanvas = {height: 0, style: {}, width: 0};
        innerContext = makeContext(innerCanvas);
        outerContext = makeContext({height: 60, width: 80});
        vi.stubGlobal('document', {
            createElement: (tagName) => {
                if (tagName === 'canvas') {
                    return {
                        getContext: () => innerContext,
                        height: 0,
                        style: {},
                        width: 0
                    };
                }
                if (tagName === 'img') {
                    return {complete: true, src: ''};
                }
                throw new Error(`Unexpected element: ${tagName}`);
            }
        });
    });

    it('leaves transparent pixels untouched for an ordinary embedded image', () => {
        SVGImage.draw(makeImageElement(), null, outerContext);

        expect(innerContext.fillRect).not.toHaveBeenCalled();
        expect(innerContext.drawImage).toHaveBeenCalledOnce();
        expect(SVG2Canvas.processXMLnode).toHaveBeenCalledWith(null, innerContext);
        expect(outerContext.drawImage).toHaveBeenCalledOnce();
    });

    it('preserves the red backing and mask for a camera-filled image', () => {
        const cameraMask = {id: 'pathborder_image_1'};

        SVGImage.draw(makeImageElement(), cameraMask, outerContext);

        expect(innerContext.fillRect).toHaveBeenCalledWith(2, 3, 10, 20);
        expect(innerContext.fillStyle).toBe('#f30');
        expect(innerContext.globalCompositeOperation).toBe('destination-in');
        expect(SVG2Canvas.processXMLnode).toHaveBeenCalledWith(cameraMask, innerContext);
        expect(outerContext.drawImage).toHaveBeenCalledOnce();
    });
});
