import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {ActivityNarrationPlayer, getNarrationMarty, splitNarrationText} from '@/tutorial/ActivityNarrationPlayer';

vi.mock('@/utils/host-raft-lookup', () => ({
    getApplicationManager: () => global.window.narrationTestManager
}));

describe('activity narration ownership', () => {
    let raft;
    let player;
    let context;
    let source;
    let originalSynthesis;
    let originalUtterance;
    let originalFetch;
    const normalVoice = () => {
        window.speechSynthesis = {speak: vi.fn(), cancel: vi.fn()};
        window.SpeechSynthesisUtterance = vi.fn(function (text) { this.text = text; });
        return window.speechSynthesis;
    };
    const states = vi.fn();
    const settle = async () => {
        for (let i = 0; i < 20; i++) await Promise.resolve();
    };

    beforeEach(() => {
        vi.useFakeTimers();
        global.window = {};
        states.mockReset();
        originalSynthesis = window.speechSynthesis;
        originalUtterance = window.SpeechSynthesisUtterance;
        originalFetch = global.fetch;
        raft = {
            id: 'marty-1', type: 'Marty', isVerified: true, connectionMethod: 'PhoneBLE',
            streamAudio: vi.fn().mockResolvedValue(undefined),
            sendRestMessage: vi.fn().mockResolvedValue({rslt: 'ok'})
        };
        window.narrationTestManager = {connectedRafts: {[raft.id]: raft}, connectedRaftsContext: []};
        source = {connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn()};
        context = {
            resume: vi.fn().mockResolvedValue(undefined), close: vi.fn().mockResolvedValue(undefined),
            createBufferSource: vi.fn().mockReturnValue(source), destination: {}
        };
        player = new ActivityNarrationPlayer({
            load: vi.fn().mockResolvedValue(new ArrayBuffer(4)),
            decode: vi.fn().mockResolvedValue({duration: 3}),
            encode: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
            createContext: vi.fn().mockReturnValue(context),
            loadMartyFallback: vi.fn().mockResolvedValue([new ArrayBuffer(4)]),
            join: vi.fn().mockResolvedValue({duration: 3})
        });
    });

    afterEach(async () => {
        await player.stop();
        window.speechSynthesis = originalSynthesis;
        window.SpeechSynthesisUtterance = originalUtterance;
        global.fetch = originalFetch;
        vi.useRealTimers();
        delete global.window;
    });

    test('requires a verified physical Marty and disambiguates multiple robots', () => {
        expect(getNarrationMarty()).toBe(raft);
        raft.isVerified = false;
        expect(getNarrationMarty()).toBeNull();
        raft.isVerified = true;
        const other = {...raft, id: 'marty-2'};
        window.narrationTestManager.connectedRafts[other.id] = other;
        expect(getNarrationMarty()).toBeNull();
        window.narrationTestManager.connectedRaftsContext = [{id: other.id, isSelected: true}];
        expect(getNarrationMarty()).toBe(other);
    });

    test('streams the entire narration through the robot profile and supports stop', async () => {
        const text = 'Read all these instructions. '.repeat(20);
        await player.play(raft, text, 'en', states);
        expect(player.load).toHaveBeenCalledWith(text, 'en', expect.any(Object));
        expect(player.encode).toHaveBeenCalledWith({duration: 3}, raft);
        expect(raft.streamAudio).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]), true, 3000);
        expect(states).toHaveBeenLastCalledWith('speaking');
        expect(raft.sendRestMessage).toHaveBeenCalledWith('led/LEDeye/pattern/pinwheel');
        expect(raft.sendRestMessage.mock.invocationCallOrder[0]).toBeLessThan(raft.streamAudio.mock.invocationCallOrder[0]);
        await player.stop(states);
        expect(raft.sendRestMessage).toHaveBeenCalledWith('audio/stop');
        expect(raft.sendRestMessage).toHaveBeenLastCalledWith('led/LEDeye/off');
        expect(states).toHaveBeenLastCalledWith('idle');
    });

    test('stopping before a late speech response prevents physical playback', async () => {
        let finish;
        player.load.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
        const playing = player.play(raft, 'Hello', 'en', states);
        await settle();
        await player.stop(states);
        finish(new ArrayBuffer(4));
        await playing;
        expect(raft.streamAudio).not.toHaveBeenCalled();
        expect(raft.sendRestMessage).not.toHaveBeenCalled();
    });

    test('closing immediately cancels playback before generation starts', async () => {
        const playing = player.play(raft, 'Hello', 'en', states);
        await player.stop(states);
        await playing;
        expect(player.load).not.toHaveBeenCalled();
        expect(raft.streamAudio).not.toHaveBeenCalled();
    });

    test('a new connection with the same ID cannot receive an old narration or stop command', async () => {
        let finishDecode;
        player.decode.mockImplementation(() => new Promise(resolve => { finishDecode = resolve; }));
        const playing = player.play(raft, 'Hello', 'en', states);
        await settle();
        window.narrationTestManager.connectedRafts[raft.id] = {...raft};
        finishDecode({duration: 3});
        await playing;
        expect(raft.streamAudio).not.toHaveBeenCalled();
        expect(raft.sendRestMessage).not.toHaveBeenCalled();
    });

    test('shows a retry state when the robot reports streaming backpressure', async () => {
        raft.subscribe = vi.fn();
        raft.unsubscribe = vi.fn();
        await player.play(raft, 'Hello', 'en', states);
        const observer = raft.subscribe.mock.calls[0][0];
        observer.notify('conn', 12, 'STREAMING_ISSUE');
        await settle();
        expect(raft.sendRestMessage).toHaveBeenCalledWith('audio/stop');
        expect(raft.unsubscribe).toHaveBeenCalledWith(observer);
        expect(states).toHaveBeenLastCalledWith('error');
    });

    test('waits for an outstanding speaker stop before starting a new recording', async () => {
        await player.play(raft, 'First step', 'en', states);
        let finishStop;
        raft.sendRestMessage.mockImplementation(command => command === 'audio/stop' ?
            new Promise(resolve => { finishStop = resolve; }) : Promise.resolve({rslt: 'ok'}));
        const stopping = player.stop();
        const next = player.play(raft, 'Second step', 'en', states);
        await settle();
        expect(player.load).toHaveBeenCalledTimes(1);
        finishStop({rslt: 'ok'});
        await stopping;
        await next;
        expect(player.load).toHaveBeenCalledTimes(2);
        raft.sendRestMessage.mockResolvedValue({rslt: 'ok'});
    });

    test('falls back to the existing voice service while keeping narration on Marty', async () => {
        player.load.mockRejectedValue(new Error('Server unavailable'));
        const synthesis = normalVoice();
        await player.play(raft, 'Hello', 'en', states);
        expect(player.loadMartyFallback).toHaveBeenCalledWith('Hello', 'en', expect.any(Object));
        expect(raft.streamAudio).toHaveBeenCalledTimes(1);
        expect(synthesis.speak).not.toHaveBeenCalled();
        expect(states).toHaveBeenLastCalledWith('speaking');
    });

    test('uses normal Marty narration after an Azure timeout', async () => {
        player.load.mockImplementation((text, locale, signal) => new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => reject(Object.assign(new Error(), {name: 'AbortError'})));
        }));
        const playing = player.play(raft, 'Hello', 'en', states);
        await settle();
        vi.advanceTimersByTime(25000);
        await playing;
        expect(player.loadMartyFallback).toHaveBeenCalledTimes(1);
        expect(raft.streamAudio).toHaveBeenCalledTimes(1);
        expect(states).toHaveBeenLastCalledWith('speaking');
    });

    test('turns the eyes off when the recording finishes naturally', async () => {
        await player.play(raft, 'Hello', 'en', states);
        vi.advanceTimersByTime(3800);
        await settle();
        expect(raft.sendRestMessage.mock.calls.map(call => call[0])).toEqual([
            'led/LEDeye/pattern/pinwheel', 'led/LEDeye/off'
        ]);
        expect(states).toHaveBeenLastCalledWith('idle');
    });

    test('clears the pinwheel even if stopping the speaker fails', async () => {
        await player.play(raft, 'Hello', 'en', states);
        raft.sendRestMessage.mockImplementation(command => command === 'audio/stop' ?
            Promise.reject(new Error('Speaker unavailable')) : Promise.resolve({rslt: 'ok'}));
        await expect(player.stop()).rejects.toThrow('Speaker unavailable');
        expect(raft.sendRestMessage).toHaveBeenLastCalledWith('led/LEDeye/off');
    });

    test('clears the pinwheel on a failed stream', async () => {
        raft.streamAudio.mockResolvedValue(false);
        await expect(player.play(raft, 'Hello', 'en', states)).rejects.toThrow('Marty rejected narration');
        expect(raft.sendRestMessage).toHaveBeenLastCalledWith('led/LEDeye/off');
    });

    test('cancels during the pinwheel request and clears it after its late completion', async () => {
        let finishPattern;
        raft.sendRestMessage.mockImplementation(command => command.endsWith('pinwheel') ?
            new Promise(resolve => { finishPattern = resolve; }) : Promise.resolve({rslt: 'ok'}));
        const playing = player.play(raft, 'Hello', 'en', states);
        await settle();
        const stopping = player.stop();
        finishPattern({rslt: 'ok'});
        await stopping;
        await playing;
        expect(raft.streamAudio).not.toHaveBeenCalled();
        expect(raft.sendRestMessage).toHaveBeenLastCalledWith('led/LEDeye/off');
    });

    test('still narrates when LED eyes are unavailable', async () => {
        raft.sendRestMessage.mockResolvedValue({rslt: 'fail'});
        await player.play(raft, 'Hello', 'en', states);
        expect(raft.streamAudio).toHaveBeenCalled();
        // Leave a successful speaker stop for cleanup; unsupported LEDs are best effort.
        raft.sendRestMessage.mockResolvedValue({rslt: 'ok'});
    });

    test('plays Azure audio on the device without a robot or MP3 re-encoding', async () => {
        window.narrationTestManager.connectedRafts = {};
        const playing = player.playOnDevice('Γεια σου', 'el', states);
        expect(context.resume).toHaveBeenCalledTimes(1);
        expect(player.load).not.toHaveBeenCalled();
        await playing;
        expect(player.load).toHaveBeenCalledWith('Γεια σου', 'el', expect.any(Object));
        expect(source.start).toHaveBeenCalledTimes(1);
        expect(player.encode).not.toHaveBeenCalled();
        expect(raft.sendRestMessage).not.toHaveBeenCalled();
        expect(raft.streamAudio).not.toHaveBeenCalled();
        expect(states).toHaveBeenLastCalledWith('speaking');
    });

    test('device completion releases its audio context and returns to idle', async () => {
        await player.playOnDevice('Hello', 'en', states);
        source.onended();
        await settle();
        expect(context.close).toHaveBeenCalledTimes(1);
        expect(source.disconnect).toHaveBeenCalledTimes(1);
        expect(source.stop).not.toHaveBeenCalled();
        expect(states).toHaveBeenLastCalledWith('idle');
    });

    test('stopping device generation prevents late playback and closes the context', async () => {
        let finish;
        player.load.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
        const playing = player.playOnDevice('Hello', 'en', states);
        await settle();
        await player.stop();
        finish(new ArrayBuffer(4));
        await playing;
        expect(source.start).not.toHaveBeenCalled();
        expect(context.close).toHaveBeenCalledTimes(1);
    });

    test('switching from Marty to the device stops the robot and clears its eyes first', async () => {
        await player.play(raft, 'Hello', 'en', states);
        await player.playOnDevice('Hello', 'en', vi.fn());
        expect(raft.sendRestMessage.mock.calls.map(call => call[0])).toEqual([
            'led/LEDeye/pattern/pinwheel', 'audio/stop', 'led/LEDeye/off'
        ]);
        expect(raft.sendRestMessage.mock.invocationCallOrder[2]).toBeLessThan(source.start.mock.invocationCallOrder[0]);
    });

    test('switching from the device to Marty releases the device speaker', async () => {
        await player.playOnDevice('Hello', 'en', states);
        await player.play(raft, 'Hello', 'en', vi.fn());
        expect(source.stop).toHaveBeenCalledTimes(1);
        expect(context.close).toHaveBeenCalledTimes(1);
        expect(source.stop.mock.invocationCallOrder[0]).toBeLessThan(raft.streamAudio.mock.invocationCallOrder[0]);
    });

    test('times out a suspended device audio context and releases it', async () => {
        context.resume.mockImplementation(() => new Promise(() => {}));
        const playing = player.playOnDevice('Hello', 'en', states);
        const assertion = expect(playing).rejects.toThrow('timed out');
        await settle();
        vi.advanceTimersByTime(25000);
        await assertion;
        expect(context.close).toHaveBeenCalledTimes(1);
        expect(player.load).not.toHaveBeenCalled();
        expect(states).toHaveBeenLastCalledWith('idle');
    });

    test.each(['Narration request failed (429)', 'Narration request failed (503)', 'Failed to fetch'])(
        'silently uses the normal device voice after %s', async message => {
            const synthesis = normalVoice();
            player.load.mockRejectedValue(new Error(message));
            await player.playOnDevice('Γεια σου', 'el', states);
            expect(synthesis.speak).toHaveBeenCalledTimes(1);
            const utterance = synthesis.speak.mock.calls[0][0];
            expect(utterance.text).toBe('Γεια σου');
            expect(utterance.lang).toBe('el');
            expect(context.close).toHaveBeenCalledTimes(1);
            expect(source.start).not.toHaveBeenCalled();
            expect(states).toHaveBeenLastCalledWith('speaking');
            utterance.onend();
            await settle();
            expect(states).toHaveBeenLastCalledWith('idle');
        }
    );

    test('falls back to the normal device voice when Azure times out', async () => {
        const synthesis = normalVoice();
        player.load.mockImplementation(() => new Promise(() => {}));
        const playing = player.playOnDevice('Hello', 'en', states);
        await settle();
        vi.advanceTimersByTime(25000);
        await playing;
        expect(synthesis.speak).toHaveBeenCalledTimes(1);
        expect(states).toHaveBeenLastCalledWith('speaking');
    });

    test('can use normal device speech when Web Audio is unavailable', async () => {
        const synthesis = normalVoice();
        player.createContext.mockImplementation(() => { throw new Error('Audio playback unavailable'); });
        await player.playOnDevice('Hello', 'en', states);
        expect(synthesis.speak).toHaveBeenCalledTimes(1);
        expect(states).toHaveBeenLastCalledWith('speaking');
    });

    test('stopping a pending Azure request never starts fallback from its late failure', async () => {
        const synthesis = normalVoice();
        let reject;
        player.load.mockImplementation(() => new Promise((resolve, fail) => { reject = fail; }));
        const playing = player.playOnDevice('Hello', 'en', states);
        await settle();
        await player.stop();
        reject(new Error('Late quota failure'));
        await playing;
        expect(synthesis.speak).not.toHaveBeenCalled();
        expect(player.loadMartyFallback).not.toHaveBeenCalled();
    });

    test('a panel change during fallback cleanup prevents the normal voice starting', async () => {
        const synthesis = normalVoice();
        player.load.mockRejectedValue(new Error('Quota exhausted'));
        let close;
        context.close.mockImplementation(() => new Promise(resolve => { close = resolve; }));
        const playing = player.playOnDevice('Old step', 'en', states);
        await settle();
        await player.stop(states);
        close();
        await playing;
        expect(synthesis.speak).not.toHaveBeenCalled();
    });

    test('normal device speech is cancelled when switching to Marty', async () => {
        const synthesis = normalVoice();
        player.load.mockRejectedValueOnce(new Error('Azure unavailable'));
        await player.playOnDevice('Hello', 'en', states);
        const utterance = synthesis.speak.mock.calls[0][0];
        const onEnd = utterance.onend;
        synthesis.cancel.mockClear();
        const nextStates = vi.fn();
        await player.play(raft, 'Next step', 'en', nextStates);
        expect(synthesis.cancel).toHaveBeenCalled();
        expect(utterance.onend).toBeNull();
        onEnd();
        expect(nextStates).toHaveBeenLastCalledWith('speaking');
    });

    test('normal Marty requests preserve every character across the service limit', async () => {
        const text = 'Long activity instructions 😀. '.repeat(15);
        const chunks = splitNarrationText(text);
        expect(chunks.length).toBeGreaterThan(1);
        expect(chunks.join('')).toBe(text);
        expect(chunks.every(chunk => Array.from(chunk).length <= 128)).toBe(true);
        global.fetch = vi.fn().mockResolvedValue({ok: true, arrayBuffer: async () => new ArrayBuffer(4)});
        player.load.mockRejectedValue(new Error('Azure quota exhausted'));
        player = new ActivityNarrationPlayer({
            load: player.load, decode: player.decode, encode: player.encode, join: player.join
        });
        await player.play(raft, text, 'en', states);
        const requestedText = global.fetch.mock.calls.map(call => new URL(call[0]).searchParams.get('text'));
        expect(requestedText.join('')).toBe(text);
        expect(player.join).toHaveBeenCalledWith(new Array(chunks.length).fill({duration: 3}));
        expect(raft.streamAudio).toHaveBeenCalledTimes(1);
    });

    test('failed normal Marty requests are marked silent and stop cleanly', async () => {
        player.load.mockRejectedValue(new Error('Azure quota exhausted'));
        player.loadMartyFallback.mockRejectedValue(new Error('Fallback unavailable'));
        await expect(player.play(raft, 'Hello', 'en', states)).rejects.toMatchObject({silent: true});
        expect(raft.streamAudio).not.toHaveBeenCalled();
        expect(states).toHaveBeenLastCalledWith('idle');
    });
});
