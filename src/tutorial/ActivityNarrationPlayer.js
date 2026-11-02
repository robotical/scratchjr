// Playback lifecycle ported from MartyBlocks 4.0.80; host and encoder adapters are local.
/* global AbortController */
import {getApplicationManager} from '../utils/host-raft-lookup';
import {encodeNarrationAudio} from '../marty/narration-audio';

/* eslint-disable no-console */
const log = {warn: (...args) => console.warn(...args)};
/* eslint-enable no-console */

const NARRATION_URL = 'https://appv2-analytics-server.robotical.io/activity-narration';
const NORMAL_MARTY_VOICE_URL = 'https://synthesis-service.scratch.mit.edu/synth';
const audioCache = new Map();
const abortError = () => Object.assign(new Error('Narration cancelled'), {name: 'AbortError'});

export const getNarrationMarty = () => {
    const manager = getApplicationManager();
    if (!manager) return null;
    const martys = Object.values(manager.connectedRafts || {}).filter(raft =>
        raft.type === 'Marty' && raft.isVerified === true &&
        ['WebBLE', 'PhoneBLE', 'WebSocket'].includes(raft.connectionMethod) &&
        typeof raft.streamAudio === 'function' && typeof raft.sendRestMessage === 'function'
    );
    const selected = (manager.connectedRaftsContext || []).find(raft => raft.isSelected);
    return martys.find(raft => selected && raft.id === selected.id) ||
        (martys.length === 1 ? martys[0] : null);
};

const ownsMarty = raft => {
    const manager = getApplicationManager();
    return Boolean(manager && manager.connectedRafts[raft.id] === raft && raft.isVerified);
};

const createAudioContext = () => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) throw new Error('Audio playback unavailable');
    return new AudioContextConstructor();
};

const decodeAudio = async (buffer, playbackContext = null) => {
    const context = playbackContext || createAudioContext();
    try {
        return await new Promise((resolve, reject) => {
            const result = context.decodeAudioData(buffer.slice(0), resolve, reject);
            if (result && typeof result.then === 'function') result.then(resolve, reject);
        });
    } finally {
        if (!playbackContext) await context.close();
    }
};

const loadAudio = async (text, locale, signal) => {
    const key = JSON.stringify([text, locale]);
    if (audioCache.has(key)) return audioCache.get(key).slice(0);
    const response = await fetch(NARRATION_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text, locale}),
        signal
    });
    if (!response.ok) throw new Error(`Narration request failed (${response.status})`);
    const audio = await response.arrayBuffer();
    if (signal.aborted) throw abortError();
    audioCache.set(key, audio);
    if (audioCache.size > 24) audioCache.delete(audioCache.keys().next().value);
    return audio.slice(0);
};

// The existing speech-block service accepts at most 128 characters per request.
export const splitNarrationText = text => {
    const remaining = Array.from(text);
    const chunks = [];
    while (remaining.length > 128) {
        let end = 128;
        for (let i = 127; i >= 64; i--) {
            if (/\s/.test(remaining[i])) {
                end = i + 1;
                break;
            }
        }
        chunks.push(remaining.splice(0, end).join(''));
    }
    if (remaining.length) chunks.push(remaining.join(''));
    return chunks;
};

const loadNormalMartyAudio = async (text, locale, signal) => {
    const locales = {
        ar: 'arb',
        zh: 'cmn-CN',
        da: 'da-DK',
        nl: 'nl-NL',
        en: 'en-US',
        fr: 'fr-FR',
        de: 'de-DE',
        hi: 'hi-IN',
        is: 'is-IS',
        it: 'it-IT',
        ja: 'ja-JP',
        ko: 'ko-KR',
        nb: 'nb-NO',
        pl: 'pl-PL',
        pt: locale.toLowerCase() === 'pt-pt' ? 'pt-PT' : 'pt-BR',
        ro: 'ro-RO',
        ru: 'ru-RU',
        es: locale.toLowerCase() === 'es-419' ? 'es-US' : 'es-ES',
        sv: 'sv-SE',
        tr: 'tr-TR',
        cy: 'cy-GB'
    };
    const language = locales[locale.toLowerCase().split('-')[0]] || 'en-US';
    const chunks = splitNarrationText(text);
    const recordings = new Array(chunks.length);
    let next = 0;
    const worker = async () => {
        while (next < chunks.length) {
            if (signal.aborted) throw abortError();
            const index = next++;
            const key = JSON.stringify(['normal', chunks[index], language]);
            if (!audioCache.has(key)) {
                const url = `${NORMAL_MARTY_VOICE_URL}?locale=${language}&gender=male&text=${
                    encodeURIComponent(chunks[index])}`;
                const response = await fetch(url, {signal});
                if (!response.ok) throw new Error(`Normal narration request failed (${response.status})`);
                const buffer = await response.arrayBuffer();
                if (signal.aborted) throw abortError();
                audioCache.set(key, buffer);
                if (audioCache.size > 24) audioCache.delete(audioCache.keys().next().value);
            }
            recordings[index] = audioCache.get(key).slice(0);
        }
    };
    await Promise.all(Array.from({length: Math.min(3, chunks.length)}, worker));
    return recordings;
};

const joinAudioBuffers = async buffers => {
    if (buffers.length === 1) return buffers[0];
    const context = createAudioContext();
    try {
        const rate = buffers[0].sampleRate;
        if (buffers.some(buffer => buffer.sampleRate !== rate)) throw new Error('Incompatible narration sample rates');
        const channels = Math.max(...buffers.map(buffer => buffer.numberOfChannels));
        const length = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
        const joined = context.createBuffer(channels, length, rate);
        let offset = 0;
        for (const buffer of buffers) {
            for (let channel = 0; channel < channels; channel++) {
                const samples = buffer.getChannelData(Math.min(channel, buffer.numberOfChannels - 1));
                joined.getChannelData(channel).set(samples, offset);
            }
            offset += buffer.length;
        }
        return joined;
    } finally {
        await context.close();
    }
};

// Decode/resume/bridge promises can finish after the user has stopped or changed panels.
const untilCancelled = (promise, signal) => new Promise((resolve, reject) => {
    const cancel = () => reject(abortError());
    signal.addEventListener('abort', cancel, {once: true});
    Promise.resolve(promise).then(resolve, reject)
        .finally(() => signal.removeEventListener('abort', cancel));
    if (signal.aborted) cancel();
});

export class ActivityNarrationPlayer {
    constructor ({load = loadAudio, decode = decodeAudio, encode = encodeNarrationAudio,
        createContext = createAudioContext,
        loadMartyFallback = loadNormalMartyAudio, join = joinAudioBuffers} = {}) {
        this.load = load;
        this.decode = decode;
        this.createContext = createContext;
        this.loadMartyFallback = loadMartyFallback;
        this.join = join;
        this.encode = encode;
        this.active = null;
        this.stopping = null;
    }

    playOnDevice (text, locale, onState) {
        return this.play(null, text, locale, onState, true);
    }

    async play (raft, text, locale, onState, onDevice = false) {
        const stopping = this.stop();
        if (!onDevice && (!raft || !ownsMarty(raft))) throw abortError();
        const run = {raft, controller: new AbortController(), onState, started: false, timer: null};
        this.active = run;
        run.observer = {notify: (eventType, eventEnum, eventName) => {
            if (this.active !== run || eventType !== 'conn') return;
            if (/STREAMING_ISSUE/.test(eventName)) {
                this.stop().catch(error => log.warn('Marty narration stop failed:', error.message));
                onState('error');
            }
        }};
        if (raft && typeof raft.subscribe === 'function') raft.subscribe(run.observer, ['conn']);
        const check = () => {
            if (this.active !== run || run.controller.signal.aborted || (raft && !ownsMarty(raft))) throw abortError();
        };
        onState('loading');
        let canFallback = false;
        let timedOut = false;
        const requestTimeout = setTimeout(() => {
            timedOut = true;
            run.controller.abort();
        }, 25000);
        try {
            // Resume synchronously within the tap, before fetching or waiting for a robot stop.
            // This is required by iOS/Android WebView autoplay policies.
            let ready;
            let deviceInitError;
            if (onDevice) {
                try {
                    run.context = this.createContext();
                    ready = Promise.resolve(run.context.resume()).then(() => null, error => error);
                } catch (error) {
                    deviceInitError = error;
                }
            }
            await untilCancelled(stopping, run.controller.signal);
            check();
            canFallback = onDevice;
            if (deviceInitError) throw deviceInitError;
            if (ready) {
                const error = await untilCancelled(ready, run.controller.signal);
                if (error) throw error;
            }
            check();
            let audio;
            try {
                const buffer = await untilCancelled(this.load(text, locale, run.controller.signal),
                    run.controller.signal);
                check();
                audio = await untilCancelled(onDevice ? this.decode(buffer, run.context) : this.decode(buffer),
                    run.controller.signal);
                if (!Number.isFinite(audio.duration) || audio.duration <= 0) throw new Error('Invalid narration audio');
            } catch (error) {
                if (onDevice || this.active !== run || (run.controller.signal.aborted && !timedOut)) throw error;
                clearTimeout(requestTimeout);
                timedOut = false;
                try {
                    audio = await this.loadNormalMarty(run, text, locale, check);
                } catch (fallbackError) {
                    fallbackError.silent = true;
                    throw fallbackError;
                }
            }
            check();
            if (!Number.isFinite(audio.duration) || audio.duration <= 0) throw new Error('Invalid narration audio');
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (onDevice) {
                run.source = run.context.createBufferSource();
                run.source.buffer = audio;
                run.source.connect(run.context.destination);
                run.source.onended = () => this.finish(run);
                run.source.start();
                run.started = true;
            } else {
                canFallback = false;
                const mp3 = this.encode(audio, raft);
                check();
                // Missing LED eyes must not prevent narration on an otherwise supported Marty.
                run.eyes = true;
                run.eyeReady = this.setEyes(run, 'led/LEDeye/pattern/pinwheel');
                await untilCancelled(run.eyeReady, run.controller.signal);
                check();
                run.started = true;
                const result = await untilCancelled(raft.streamAudio(mp3, true, audio.duration * 1000),
                    run.controller.signal);
                check();
                if (result === false || (result && (result.error || result.rslt === 'fail'))) {
                    throw new Error('Marty rejected narration');
                }
                run.timer = setTimeout(() => this.finish(run), (audio.duration * 1000) + 800);
            }
            onState('speaking');
        } catch (error) {
            const isCurrent = this.active === run;
            if (isCurrent && canFallback && !run.started && (!run.controller.signal.aborted || timedOut)) {
                clearTimeout(requestTimeout);
                run.controller.abort();
                run.controller = new AbortController();
                try {
                    if (await this.speakWithNormalVoice(run, text, locale, check)) return;
                } catch (fallbackError) {
                    if (fallbackError.name !== 'AbortError') {
                        log.warn('Normal narration voice unavailable:', fallbackError.message);
                    }
                }
            }
            if (this.active !== run) return;
            await this.stop();
            if (timedOut && isCurrent) throw new Error('Marty narration timed out');
            if (error.name !== 'AbortError') throw error;
        } finally {
            clearTimeout(requestTimeout);
        }
    }

    async loadNormalMarty (run, text, locale, check) {
        run.controller.abort();
        run.controller = new AbortController();
        check();
        const timeout = setTimeout(() => run.controller.abort(), 25000);
        try {
            const recordings = await untilCancelled(this.loadMartyFallback(text, locale, run.controller.signal),
                run.controller.signal);
            const decoded = [];
            for (const recording of recordings) {
                check();
                decoded.push(await untilCancelled(this.decode(recording), run.controller.signal));
            }
            check();
            return await untilCancelled(this.join(decoded), run.controller.signal);
        } finally {
            clearTimeout(timeout);
        }
    }

    async speakWithNormalVoice (run, text, locale, check) {
        const synthesis = window.speechSynthesis;
        const Utterance = window.SpeechSynthesisUtterance;
        if (!synthesis || typeof synthesis.speak !== 'function' || typeof Utterance !== 'function') return false;
        if (run.source) {
            run.source.onended = null;
            run.source.disconnect();
            run.source = null;
        }
        if (run.context) {
            const context = run.context;
            run.context = null;
            await context.close().catch(error => log.warn('Narration audio context cleanup failed:', error.message));
        }
        // Closing the Azure audio context may yield while a stop, panel change or speaker switch occurs.
        check();
        run.utterance = new Utterance(text);
        run.utterance.lang = locale;
        run.utterance.rate = 1;
        run.utterance.pitch = 1.4;
        run.utterance.onend = () => this.finish(run);
        run.utterance.onerror = () => this.finish(run);
        run.synthesis = synthesis;
        synthesis.cancel();
        synthesis.speak(run.utterance);
        if (this.active === run) run.onState('speaking');
        return true;
    }

    finish (run) {
        if (this.active !== run) return;
        this.stop(null, false).catch(error => log.warn('Narration completion cleanup failed:', error.message));
    }

    async setEyes (run, command) {
        if (!ownsMarty(run.raft)) return;
        try {
            const result = await run.raft.sendRestMessage(command);
            if (result && (result.error || result.rslt === 'fail')) throw new Error('LED eye command rejected');
        } catch (error) {
            log.warn('Marty narration LED eyes unavailable:', error.message);
        }
    }

    async stop (owner = null, stopAudio = true) {
        const run = this.active;
        if (owner && (!run || run.onState !== owner)) return;
        if (!run) {
            if (this.stopping) await this.stopping;
            return;
        }
        this.active = null;
        run.controller.abort();
        clearTimeout(run.timer);
        if (run.raft && typeof run.raft.unsubscribe === 'function') run.raft.unsubscribe(run.observer);
        if (run.source) {
            run.source.onended = null;
            if (run.started && stopAudio) run.source.stop();
            run.source.disconnect();
        }
        if (run.utterance) {
            run.utterance.onend = null;
            run.utterance.onerror = null;
            run.synthesis.cancel();
        }
        run.onState('idle');
        const previousStop = this.stopping;
        const operation = (async () => {
            try {
                if (run.context) await run.context.close();
                if (previousStop) await previousStop;
                if (run.started && stopAudio && run.raft && ownsMarty(run.raft)) {
                    // Firmware audio control crosses the existing browser/native RAFT_SEND_REST bridge.
                    const result = await run.raft.sendRestMessage('audio/stop');
                    if (result && (result.error || result.rslt === 'fail')) {
                        throw new Error('Marty could not stop narration');
                    }
                }
            } finally {
                if (run.eyes) {
                    await run.eyeReady;
                    await this.setEyes(run, 'led/LEDeye/off');
                }
            }
        })();
        this.stopping = operation;
        try {
            await operation;
        } finally {
            if (this.stopping === operation) this.stopping = null;
        }
    }
}

export default new ActivityNarrationPlayer();
