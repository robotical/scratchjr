import getUserMedia from 'get-user-media-promise';
import { computeRMS } from '../utils/sound-utils';
import WavEncoder from 'wav-encoder';

class AudioCapture {
  constructor() {
    this.bufferLength = 8192;
    this.mediaStreamSource = null;
    this.audioBuffer = null;
    this.recording = false;
    this.chunks = [];
    this.stream = null;
    this.errorHandler = null;
    this.analyserNode = null;
    this.workletNode = null;
    this.started = false;
    this.disposed = false;
  }

  async initialise() {
    if (this.audioCtx && typeof this.audioCtx.close === 'function') {
      await this.audioCtx.close();
    }
    this.audioCtx = new (window.AudioContext || webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const processorCode = `
      class RecorderProcessor extends AudioWorkletProcessor {
        constructor(options) {
          super();
          this._bufferLength = options.processorOptions.bufferLength;
          this._buffer = new Float32Array(this._bufferLength);
          this._writeIndex = 0;
        }
        process(inputs) {
          const inputChannels = inputs[0];
          if (inputChannels && inputChannels[0]) {
            const input = inputChannels[0];
            for (let i = 0; i < input.length; i++) {
              this._buffer[this._writeIndex++] = input[i];
              if (this._writeIndex >= this._bufferLength) {
                this.port.postMessage(this._buffer.slice(0));
                this._writeIndex = 0;
              }
            }
          }
          return true;
        }
      }
      registerProcessor('recorder-processor', RecorderProcessor);
    `;
    const blob = new Blob([processorCode], { type: 'application/javascript' });
    const moduleURL = URL.createObjectURL(blob);
    await this.audioCtx.audioWorklet.addModule(moduleURL);
  }

  getId(isNewRecording) {
    if (isNewRecording || !this.id) {
      this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
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
      await this.initialise();
      this.stream = await getUserMedia(constraints);
      this.beginStartRecord(this.stream);
    } catch (error) {
      this.onError(error);
    }
    return this.getId(true) + '.webm';
  }

  stopListeningForRecordPush() {
    this.dispose();
  }

  beginStartRecord(stream) {
    this.started = true;
    this.mediaStreamSource = this.audioCtx.createMediaStreamSource(stream);

    this.analyserNode = this.audioCtx.createAnalyser();
    this.analyserNode.fftSize = 2048;

    this.workletNode = new AudioWorkletNode(this.audioCtx, 'recorder-processor', {
      processorOptions: { bufferLength: this.bufferLength }
    });
    this.workletNode.port.onmessage = event => {
      if (this.recording && !this.disposed) {
        this.onRecordData(new Float32Array(event.data));
      }
    };

    // Volume meter loop
    const dataArray = new Float32Array(this.analyserNode.frequencyBinCount);
    const updateVolume = () => {
      if (this.recording && !this.disposed) {
        this.analyserNode.getFloatTimeDomainData(dataArray);
        this.currentVolume = computeRMS(dataArray);
      }
      this._rafId = requestAnimationFrame(updateVolume);
    };
    updateVolume();

    // Wire audio graph
    this.mediaStreamSource.connect(this.workletNode);
    this.workletNode.connect(this.audioCtx.destination);
    this.mediaStreamSource.connect(this.analyserNode);
  }

  onRecordData(data) {
    this.chunks.push(data);
  }

  getVolume() {
    return this.currentVolume || 0;
  }

  async captureRecordingAsBlob() {
    if (this.savedBlob) return this.savedBlob;
    if (!this.recording && this.chunks.length > 0) {
      const combined = this._mergeBuffers(this.chunks);
      // Create and store AudioBuffer for playback
      this.audioBuffer = this.audioCtx.createBuffer(1, combined.length, this.audioCtx.sampleRate);
      this.audioBuffer.copyToChannel(combined, 0);

      const wavData = await WavEncoder.encode({
        sampleRate: this.audioCtx.sampleRate,
        channelData: [this.audioBuffer.getChannelData(0)]
      });

      this.chunks = [];
      const blob = new Blob([wavData], { type: 'audio/wav' });
      this.savedBlob = blob;
      return blob;
    }
    return null;
  }

  async startPlay() {
    console.log('playing');
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    // If we don't yet have the decoded buffer, generate or decode it
    if (!this.audioBuffer) {
      const blob = await this.captureRecordingAsBlob();
      if (!blob) return;
      const arrayBuffer = await blob.arrayBuffer();
      this.audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
    }

    const src = this.audioCtx.createBufferSource();
    src.buffer = this.audioBuffer;
    src.connect(this.audioCtx.destination);
    src.start();
  }

  dispose() {
    this.disposed = true;
    this.recording = false;
    this.chunks = [];
    this.audioBuffer = null;
    this.savedBlob = null;

    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
    }
    if (this.started) {
      if (this.workletNode) this.workletNode.disconnect();
      if (this.analyserNode) this.analyserNode.disconnect();
      if (this.mediaStreamSource) this.mediaStreamSource.disconnect();
      if (this.stream) this.stream.getTracks().forEach(t => t.stop());
      this.started = false;
    }
  }

  stopRecord() {
    this.recording = false;
  }

  onError(e) {
    if (this.errorHandler) this.errorHandler(e);
  }

  _mergeBuffers(chunks) {
    const result = new Float32Array(chunks.length * this.bufferLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }
}

export default AudioCapture;
