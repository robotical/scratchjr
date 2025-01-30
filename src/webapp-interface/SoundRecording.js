import getUserMedia from 'get-user-media-promise';
import { computeRMS } from '../utils/sound-utils';
import WavEncoder from 'wav-encoder';

class AudioCapture {
    constructor() {
        this.audioCtx = new (window.AudioContext || webkitAudioContext)(); // Initialize AudioContext
        this.bufferLength = 8192;
        this.mediaStreamSource = null;
        this.audioBuffer = null;
        this.recording = false;
        this.chunks = [];
        this.scriptProcessorNode = null;
        this.stream = null;
        this.errorHandler = null;
        this.sourceNode = null;
        this.started = false;
        this.recording = false;
        this.disposed = false;
    }

    getId(isNewRecording) {
        if (isNewRecording || !this.id) {
            this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        return this.id;
    }

    startRecord() {
        this.chunks = [];
        this.recording = true;
        this.audioBuffer = null;
        this.savedBlob = null;
        return this.getId() + '.webm';
    }

    async startListeningForRecordPush(constraints = { audio: true }) {
        try {
            this.stream = await getUserMedia(constraints);
            this.beginStartRecord(this.stream);
        } catch (error) {
            this.onError(error);
        }
        return this.getId(true) + '.webm';
    }

    async stopListeningForRecordPush() {
        this.dispose();
    }

    beginStartRecord(stream) {
        this.mediaStreamSource = this.audioCtx.createMediaStreamSource(stream);
        this.sourceNode = this.audioCtx.createGain();
        this.scriptProcessorNode = this.audioCtx.createScriptProcessor(this.bufferLength, 1, 1);

        this.scriptProcessorNode.onaudioprocess = (event) => {
            if (this.recording && !this.disposed) {
                const inputData = event.inputBuffer.getChannelData(0);
                this.onRecordData(new Float32Array(inputData));
            }
        };

        this.analyserNode = this.audioCtx.createAnalyser();

        this.analyserNode.fftSize = 2048;

        const bufferLength = this.analyserNode.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        const update = () => {
            if (this.recording && !this.disposed) {
                this.analyserNode.getFloatTimeDomainData(dataArray);
                this.currentVolume = computeRMS(dataArray);
            }
            requestAnimationFrame(update);
        };

        requestAnimationFrame(update);

        // Wire everything together, ending in the destination
        this.mediaStreamSource.connect(this.sourceNode);
        this.sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(this.scriptProcessorNode);
        this.scriptProcessorNode.connect(this.audioCtx.destination);
    }

    onRecordData(data) {
        if (!this.chunks) {
            this.chunks = [];
        }
        this.chunks.push(data);
    }

    getVolume() {
        if (!this.mediaStreamSource) {
            return 0;
        }
        return this.currentVolume;
    }

    async captureRecordingAsBlob() {
        if (this.savedBlob) return this.savedBlob;
        if (!this.recording && this.chunks.length > 0) {
            try {
                const combinedBuffer = this._mergeBuffers(this.chunks);
                // Create the audio buffer manually if needed
                const audioBuffer = this.audioCtx.createBuffer(
                    1,
                    combinedBuffer.length / 1,
                    this.audioCtx.sampleRate
                );
                this.audioBuffer = audioBuffer;

                for (let channel = 0; channel < 1; channel++) {
                    audioBuffer.copyToChannel(
                        combinedBuffer.subarray(channel * audioBuffer.length, (channel + 1) * audioBuffer.length),
                        channel
                    );
                }

                // Encode the audio buffer into WAV format
                const wavData = await WavEncoder.encode({
                    sampleRate: this.audioCtx.sampleRate,
                    channelData: Array.from({ length: audioBuffer.numberOfChannels }, (_, i) =>
                        audioBuffer.getChannelData(i)
                    ),
                });


                this.chunks = []; // Clear chunks for future recordings
                // Convert audio buffer to Blob
                // Convert to Blob
                const wavBlob = new Blob([wavData], { type: 'audio/wav' });
                this.savedBlob = wavBlob;
                return wavBlob;
            } catch (error) {
                this.savedBlob = null;
                return null;
            }
        }
        return null;
    }

    dispose() {
        this.disposed = true;
        this.recording = false;
        this.disposed = true;
        if (this.started) {
            if (this.scriptProcessorNode) {
                this.scriptProcessorNode.disconnect();
                this.scriptProcessorNode = null;
            }

            if (this.mediaStreamSource) {
                this.mediaStreamSource.disconnect();
                this.mediaStreamSource = null;
            }

            if (this.stream) {
                this.stream.getTracks().forEach((track) => track.stop());
                this.stream = null;
            }

            if (this.sourceNode) {
                this.sourceNode.disconnect();
                this.sourceNode = null;
            }

            if (this.analyserNode) {
                this.analyserNode.disconnect();
                this.analyserNode = null;
            }
        }
    }

    stopRecord() {
        this.recording = false;
    }

    async startPlay() {
        if (!this.audioBuffer) {
            const blob = await this.captureRecordingAsBlob();
            if (!blob) {
                return;
            }

            // const arrayBuffer = await blob.arrayBuffer();
            // this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        }

        const source = this.audioCtx.createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.audioCtx.destination);
        source.start();
    }

    onError(e) {
        if (this.errorHandler) {
            this.errorHandler(e);
        }
    }

    // Helper to merge Float32Array chunks into a single buffer
    _mergeBuffers(chunks) {
        const buffer = new Float32Array(chunks.length * this.bufferLength);

        let offset = 0;
        for (let i = 0; i < chunks.length; i++) {
            const bufferChunk = chunks[i];
            buffer.set(bufferChunk, offset);
            offset += bufferChunk.length;
        }

        return buffer;
    }


}

export default AudioCapture;

