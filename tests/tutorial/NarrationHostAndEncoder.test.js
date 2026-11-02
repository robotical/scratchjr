import {afterEach, describe, expect, it, vi} from 'vitest';
import {getApplicationManager} from '@/utils/host-raft-lookup';
import {encodeNarrationAudio} from '@/marty/narration-audio';

afterEach(() => vi.unstubAllGlobals());

describe('narration host lookup', () => {
    it('finds the real host through nested editor documents instead of using a local mock', () => {
        const manager = {connectedRafts: {marty: {id: 'marty'}}};
        vi.stubGlobal('window', {applicationManager: {}, parent: {applicationManager: manager}});
        expect(getApplicationManager()).toBe(manager);
    });

    it('tolerates inaccessible cross-origin parents and checks the object owner document', () => {
        const manager = {connectedRafts: {marty: {}}};
        const editor = {frameElement: {ownerDocument: {defaultView: {applicationManager: manager}}}};
        Object.defineProperty(editor, 'parent', {get: () => { throw new Error('Cross origin'); }});
        vi.stubGlobal('window', editor);
        expect(getApplicationManager()).toBe(manager);
    });
});

describe('Marty narration encoding', () => {
    it.each([
        {sampleRate: 16000, bitRate: 16, avgFlag: false},
        {sampleRate: 44100, bitRate: 64, avgFlag: true}
    ])('encodes audio with the host streaming profile $sampleRate/$bitRate', profile => {
        const sampleRate = 24000;
        const samples = new Float32Array(sampleRate);
        for (let i = 0; i < samples.length; i++) samples[i] = Math.sin(i * 2 * Math.PI * 440 / sampleRate) * .3;
        const raft = {getSoundStreamingProfile: vi.fn(() => profile)};
        const encoded = encodeNarrationAudio({sampleRate, length: samples.length, getChannelData: () => samples}, raft);
        expect(raft.getSoundStreamingProfile).toHaveBeenCalled();
        expect(encoded).toBeInstanceOf(Uint8Array);
        expect(encoded.length).toBeGreaterThan(1000);
        // MP3 sync word proves this is encoded audio, rather than streamed PCM bytes.
        expect(encoded[0]).toBe(255);
        expect(encoded[1] & 224).toBe(224);
    });
});
