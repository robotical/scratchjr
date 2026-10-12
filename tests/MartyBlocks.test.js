import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {EventEmitter} from 'events';

vi.mock('@/editor/engine/Prims', () => ({default: {OnMartyEvent: vi.fn()}}));

import Prims from '@/editor/engine/Prims';
import MartyBlocks from '@/marty/MartyBlocks';
import MartyManager from '@/marty/MartyManager';

describe('Marty colour sensing', () => {
    let marty;
    let blocks;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        global.window = {addEventListener: vi.fn(), removeEventListener: vi.fn()};
        global.document = {hidden: false};
        const analyser = new EventEmitter();
        analyser.eventsMap = {
            colourSensed: Object.fromEntries(['red', 'green', 'blue', 'purple', 'yellow', 'air', 'unclear']
                .map(colour => [colour, colour]))
        };
        analyser.martyState = {colourSensed: 'red'};
        marty = {
            id: 'marty-1', isVerified: true, isConnected: true,
            publishedDataAnalyser: analyser,
            raftStateInfo: {addOnInfoValidMs: Date.now()}
        };
        blocks = new MartyBlocks(marty);
    });

    afterEach(() => {
        blocks.destroy();
        vi.useRealTimers();
        delete global.window;
        delete global.document;
    });

    it('checks a held colour within 100 ms without waiting for another colour-change event', () => {
        vi.advanceTimersByTime(99);
        expect(Prims.OnMartyEvent).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(Prims.OnMartyEvent).toHaveBeenCalledWith('martycoloursensedred');
        vi.advanceTimersByTime(100);
        expect(Prims.OnMartyEvent).toHaveBeenCalledTimes(2);
    });

    it('still dispatches colour-change events immediately', () => {
        marty.publishedDataAnalyser.emit('blue');
        expect(Prims.OnMartyEvent).toHaveBeenCalledExactlyOnceWith('martycoloursensedblue');
    });

    it.each(['red', 'green', 'blue', 'purple', 'yellow', 'air', 'unclear'])(
        'uses the confirmed %s state', colour => {
            marty.publishedDataAnalyser.martyState.colourSensed = colour;
            vi.advanceTimersByTime(100);
            expect(Prims.OnMartyEvent).toHaveBeenCalledExactlyOnceWith(
                'martycoloursensed' + (['air', 'unclear'].includes(colour) ? 'none' : colour)
            );
        }
    );

    it('ignores raw readings while the host has no confirmed colour', () => {
        delete marty.publishedDataAnalyser.martyState;
        marty.publishedDataAnalyser.lastColourReading = {classifiedColour: 'red'};
        vi.advanceTimersByTime(100);
        expect(Prims.OnMartyEvent).not.toHaveBeenCalled();
    });

    it.each(['hidden', 'disconnected', 'unverified', 'stale', 'future', 'empty'])(
        'does not poll a %s sensor', condition => {
            if (condition === 'hidden') document.hidden = true;
            if (condition === 'disconnected') marty.isConnected = false;
            if (condition === 'unverified') marty.isVerified = false;
            if (condition === 'stale') marty.raftStateInfo.addOnInfoValidMs -= 500;
            if (condition === 'future') marty.raftStateInfo.addOnInfoValidMs += 1000;
            if (condition === 'empty') marty.raftStateInfo.addOnInfoValidMs = 0;
            vi.advanceTimersByTime(100);
            expect(Prims.OnMartyEvent).not.toHaveBeenCalled();
        }
    );

    it('stops polling and removes the exact event listeners on disconnect', () => {
        blocks.destroy();
        blocks.destroy();
        expect(marty.publishedDataAnalyser.eventNames()).toEqual([]);
        marty.publishedDataAnalyser.emit('red');
        vi.advanceTimersByTime(1000);
        expect(Prims.OnMartyEvent).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    it('cleans up when the editor leaves the page', () => {
        const [, onPageHide] = window.addEventListener.mock.calls[0];
        onPageHide();
        vi.advanceTimersByTime(100);
        expect(Prims.OnMartyEvent).not.toHaveBeenCalled();
        expect(marty.publishedDataAnalyser.eventNames()).toEqual([]);
    });

    it('replaces the previous poller when the same Marty is rewired', () => {
        const manager = new MartyManager();
        manager.addMarty(marty);
        marty.blocks = blocks;
        manager.wireMartyWithBlocks(marty.id);
        blocks = marty.blocks;
        vi.advanceTimersByTime(100);
        expect(Prims.OnMartyEvent).toHaveBeenCalledTimes(1);
        expect(marty.publishedDataAnalyser.listenerCount('red')).toBe(1);
    });
});
