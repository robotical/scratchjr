import { describe, expect, it } from 'vitest';
import englishMessages from '../editions/free/src/localizations/en.json';

describe('micro:bit block descriptions', () => {
    it('uses concise palette and accessibility labels', () => {
        expect({
            cogButton: englishMessages.BLOCK_DESC_ON_TOUCH_Cog,
            button: englishMessages.BLOCK_DESC_MICROBIT_ON_BUTTON,
            gesture: englishMessages.BLOCK_DESC_MICROBIT_ON_GESTURE,
            tilt: englishMessages.BLOCK_DESC_MICROBIT_ON_TILT,
            heart: englishMessages.BLOCK_DESC_MICROBIT_DISPLAY_HEART,
            happy: englishMessages.BLOCK_DESC_MICROBIT_DISPLAY_HAPPY,
            text: englishMessages.BLOCK_DESC_MICROBIT_DISPLAY_TEXT,
            custom: englishMessages.BLOCK_DESC_MICROBIT_DISPLAY_CUSTOM,
            clear: englishMessages.BLOCK_DESC_MICROBIT_CLEAR_DISPLAY
        }).toEqual({
            cogButton: 'START ON BUTTON',
            button: 'START ON BUTTON',
            gesture: 'START ON GESTURE',
            tilt: 'START ON TILT',
            heart: 'DISPLAY HEART',
            happy: 'DISPLAY HAPPY FACE',
            text: 'DISPLAY TEXT',
            custom: 'DISPLAY CUSTOM PATTERN',
            clear: 'CLEAR DISPLAY'
        });
    });
});
