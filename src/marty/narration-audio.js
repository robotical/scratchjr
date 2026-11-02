import lamejs from '../vendor/lame-all';

// Matches MartyBlocks' encoder and honours the host's browser/native BLE profile.
export const encodeNarrationAudio = (audio, raft) => {
    const profile = (raft && typeof raft.getSoundStreamingProfile === 'function' &&
        raft.getSoundStreamingProfile()) || {};
    const sampleRate = profile.sampleRate || 44100;
    const bitRate = profile.bitRate || 64;
    const avgFlag = typeof profile.avgFlag === 'boolean' ? profile.avgFlag : true;
    const ratio = audio.sampleRate / sampleRate;
    const input = audio.getChannelData(0);
    const samples = new Int16Array(Math.floor(audio.length / ratio));
    for (let i = 0; i < samples.length; i++) {
        samples[i] = Math.max(-1, Math.min(1, input[Math.floor(i * ratio)])) * 32767;
    }
    const encoder = new lamejs.Mp3Encoder(1, sampleRate, bitRate, avgFlag);
    const chunks = [];
    for (let i = 0; i < samples.length; i += 1152) {
        const chunk = encoder.encodeBuffer(samples.subarray(i, i + 1152));
        if (chunk.length) chunks.push(chunk);
    }
    const tail = encoder.flush();
    if (tail.length) chunks.push(tail);
    const data = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
    }
    return data;
};
