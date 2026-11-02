import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import TutorialNarration from '@/tutorial/TutorialNarration';

class Element extends EventTarget {
    constructor () {
        super();
        this.attributes = {};
    }
    setAttribute (name, value) { this.attributes[name] = value; }
}

describe('activity narration controls', () => {
    let controls;
    let buttons;
    let player;
    let getMarty;
    let locale;
    let current;
    let root;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal('window', Object.assign(new EventTarget(), {AudioContext: function () {}}));
        vi.stubGlobal('document', Object.assign(new EventTarget(), {hidden: false}));
        buttons = {
            '#tutorialAudioControls': new Element(),
            '#tutorialReadAloud': new Element(),
            '#tutorialMartyReadAloud': new Element()
        };
        root = {querySelector: selector => buttons[selector]};
        getMarty = vi.fn(() => null);
        locale = 'en';
        current = null;
        player = {
            stop: vi.fn(async owner => {
                if (current && (!owner || owner === current)) {
                    const stopped = current;
                    current = null;
                    stopped('idle');
                }
            }),
            playOnDevice: vi.fn(async (text, language, onState) => {
                await player.stop();
                current = onState;
                onState('loading');
            }),
            play: vi.fn(async (raft, text, language, onState) => {
                await player.stop();
                current = onState;
                onState('speaking');
            })
        };
        controls = new TutorialNarration({root, player, getMarty, getLocale: () => locale});
    });

    afterEach(() => {
        controls.destroy();
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('keeps device read-aloud available without a robot and reveals Marty after connection', () => {
        controls.show('Read this step');
        expect(buttons['#tutorialAudioControls'].hidden).toBe(false);
        expect(buttons['#tutorialReadAloud'].hidden).toBe(false);
        expect(buttons['#tutorialMartyReadAloud'].hidden).toBe(true);
        getMarty.mockReturnValue({id: 'marty'});
        vi.advanceTimersByTime(500);
        expect(buttons['#tutorialMartyReadAloud'].hidden).toBe(false);
        expect(buttons['#tutorialMartyReadAloud'].attributes['aria-label']).toBe('Marty, read this');
    });

    it('starts device playback in the displayed locale and exposes a Stop action while loading', async () => {
        locale = 'el';
        controls.reconcileConnection();
        controls.show('Γεια σου');
        await controls.playDevice();
        expect(player.playOnDevice).toHaveBeenCalledWith('Γεια σου', 'el', controls.onDeviceState);
        expect(buttons['#tutorialReadAloud'].attributes).toMatchObject({
            'aria-busy': 'true', 'aria-pressed': 'true', 'aria-label': 'Stop reading'
        });
        await controls.playDevice();
        expect(buttons['#tutorialReadAloud'].attributes['aria-pressed']).toBe('false');
    });

    it('rechecks the connection at the moment Marty is pressed', async () => {
        getMarty.mockReturnValue({id: 'marty'});
        controls.show('Hello');
        controls.reconcileConnection();
        getMarty.mockReturnValue(null);
        await controls.playMarty();
        expect(player.play).not.toHaveBeenCalled();
        expect(buttons['#tutorialMartyReadAloud'].hidden).toBe(true);
    });

    it('cancels Marty narration when the selected connection changes', async () => {
        getMarty.mockReturnValue({id: 'first'});
        controls.show('Hello');
        await controls.playMarty();
        getMarty.mockReturnValue({id: 'second'});
        vi.advanceTimersByTime(500);
        expect(current).toBeNull();
        expect(buttons['#tutorialMartyReadAloud'].attributes['aria-pressed']).toBe('false');
    });

    it('hides a disconnected Marty without interrupting device narration', async () => {
        getMarty.mockReturnValue({id: 'marty'});
        controls.reconcileConnection();
        controls.show('Hello');
        await controls.playDevice();
        getMarty.mockReturnValue(null);
        vi.advanceTimersByTime(500);
        expect(buttons['#tutorialMartyReadAloud'].hidden).toBe(true);
        expect(current).toBe(controls.onDeviceState);
    });

    it('cancels reading when displayed instructions or a hint change', async () => {
        controls.show('First step');
        await controls.playDevice();
        controls.setText('Here is a hint');
        expect(current).toBeNull();
        await controls.playDevice();
        expect(player.playOnDevice).toHaveBeenLastCalledWith('Here is a hint', 'en', controls.onDeviceState);
        controls.hide();
        expect(current).toBeNull();
        expect(buttons['#tutorialAudioControls'].hidden).toBe(true);
    });

    it('cancels old-language speech before the new locale is used', async () => {
        controls.show('Hello');
        await controls.playDevice();
        locale = 'fr';
        vi.advanceTimersByTime(500);
        expect(current).toBeNull();
        await controls.playDevice();
        expect(player.playOnDevice).toHaveBeenLastCalledWith('Hello', 'fr', controls.onDeviceState);
    });

    it('stops in the background and removes its polling and click handlers on page exit', async () => {
        controls.show('Hello');
        await controls.playDevice();
        document.hidden = true;
        document.dispatchEvent(new Event('visibilitychange'));
        expect(current).toBeNull();
        window.dispatchEvent(new Event('pagehide'));
        getMarty.mockClear();
        player.playOnDevice.mockClear();
        vi.advanceTimersByTime(1000);
        buttons['#tutorialReadAloud'].dispatchEvent(new Event('click'));
        expect(getMarty).not.toHaveBeenCalled();
        expect(player.playOnDevice).not.toHaveBeenCalled();
    });

    it('does not let an old control stop narration started by a new control', async () => {
        controls.show('Old activity');
        await controls.playDevice();
        const next = new TutorialNarration({root, player, getMarty});
        next.show('New activity');
        await next.playDevice();
        controls.destroy();
        expect(current).toBe(next.onDeviceState);
        next.destroy();
    });

    it('hides audio controls for steps without readable instructions', () => {
        controls.show('');
        expect(buttons['#tutorialAudioControls'].hidden).toBe(true);
        expect(buttons['#tutorialReadAloud'].disabled).toBe(true);
    });
});
