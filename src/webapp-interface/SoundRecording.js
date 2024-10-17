class AudioCapture {
    constructor() {
        this.audioCtx = new (window.AudioContext || webkitAudioContext)(); // eslint-disable-line no-undef
        this.audioElement = new window.Audio();
        this.audioPlaybackElement = null;
        this.errorHandler = null;
    }

    getId(isNewRecording) {

        if (isNewRecording || !this.id) {
            // uuid generator
            this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });

        }
        return this.id;
    }
    startRecord(constraints) {
        this.savedBlob = null;

        constraints = constraints || { audio: true };
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(
                this.beginStartRecord.bind(this),
                this.onError.bind(this));
        }
        return this.getId(/*isNewRecording*/ true) + '.webm';
    }

    beginStartRecord(stream) {
        console.log("Recording started");
        if (!this.isRecordingPermitted) {
            throw (new Error('Recording audio is turned off'));
        }
        this.chunks = null;
        this.currentStream = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = this.onRecordData.bind(this);
        this.mediaRecorder.start();

    }

    onError(e) {
        console.log("Error starting recording", e);
        if (this.errorHandler) {
            this.errorHandler(e);
        }

    }

    onRecordData(e) {
        console.log("Recording data", e);
        if (!this.chunks) {
            this.chunks = [];
        }
        this.chunks.push(e.data);
    }

    stubbornlyWaitForChunkData() {
        // wait only for 5 seconds
        let startTime = Date.now();
        let maxWaitTime = 5000;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                console.log("waiting for recording data...");
                if (Date.now() - startTime > maxWaitTime) {
                    clearInterval(interval);
                    resolve(false);
                }
                if (this.chunks && this.chunks.length > 0) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 500);
        })
    }

    async captureRecordingAsBlob() {
        console.log("captureRecordingAsBlob");
        if (this.savedBlob) return this.savedBlob;

        try {
            if (!this.chunks || this.chunks.length == 0) {
                if (this.mediaRecorder && this.mediaRecorder.state != 'inactive') {
                    this.mediaRecorder.requestData();
                }
            }

            if (!this.chunks || this.chunks.length == 0) {
                const gotChuck = await this.stubbornlyWaitForChunkData();
                if (!gotChuck) {
                    console.log("No recording data found");
                    return null;
                } else {
                    console.log("found recording data");
                }
            }
            
            if (!this.chunks) return null;
            console.log("Saving sound");
            let blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
            this.chunks = [];

            this.audioElement.srcObject = this.currentStream;

            this.savedBlob = blob;
            return this.savedBlob;

        } catch (e) {
            console.log("Error saving sound", e);
            this.savedBlob = null;
            return null;
        }


    }
    stopRecord() {

        this.stopAudioMeter();

        if (this.mediaRecorder) {
            //this.mediaRecorder.stop();

            // https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/ondataavailable
            this.mediaRecorder.requestData();
            this.mediaRecorder.stop();

        }
        this.mediaRecorder = null;

    }

    stopPlay() {
        if (this.audioPlaybackElement) {
            this.audioPlaybackElement.pause();
            this.audioPlaybackElement = null;
        }
    }
    async startPlay() {
        // stop the recording
        if (this.mediaRecorder) {
            this.stopRecord();
        }

        let blob = await this.captureRecordingAsBlob();

        if (blob) {
            console.log("Playing sound");
            let fileReader = new FileReader();
            fileReader.onload = function () {
                this.audioPlaybackElement = new Audio(fileReader.result);
                this.audioPlaybackElement.volume = 0.8; // don't oversaturate speakers;
                this.tryPlayAudio(this.audioPlaybackElement);
            }.bind(this);
            fileReader.readAsDataURL(blob);
        }


    }
    /** calls play on an HTML audio element, takes care of promise */
    tryPlayAudio(audioElement) {
        try {
            let playPromise = audioElement.play();
            if (playPromise !== undefined) {
                playPromise.then(function () { }).catch(function (error) { }); // eslint-disable-line no-unused-vars
            }
        } catch (e) {
            console.log("Error saving sound", e);
        }
    }
    getVolume() {

        // https://github.com/cwilso/volume-meter/blob/master/volume-meter.js

        if (this.isDisconnected) return 0;

        if (!this.audioProcessor && this.currentStream) {
            this.startAudioMeter();
        }

        if (this.audioProcessor) {
            return this.audioProcessor.volume;
        }
        return 0;
    }




    /** starts processing audio stream for mic volume
    https://github.com/cwilso/volume-meter/blob/master/volume-meter.js
    */
    startAudioMeter(clipLevel, averaging, clipLag) {

        if (!this.currentStream) {
            return; // no stream to monitor.
        }
        let audioContext = this.audioCtx;
        if (!this.mediaStreamSource) {
            this.mediaStreamSource = this.audioCtx.createMediaStreamSource(this.currentStream);
        }

        if (!this.audioProcessor) {

            // "It is recommended for authors to not specify this buffer size and allow the implementation to pick a good
            // buffer size to balance between latency and audio quality."
            // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
            let processor = audioContext.createScriptProcessor((typeof AudioContext != 'undefined' ? null : 512), 1, 1);
            processor.onaudioprocess = this.processVolume.bind(this);
            processor.clipping = false;
            processor.lastClip = 0;
            processor.volume = 0;
            processor.clipLevel = clipLevel || 0.98;
            processor.averaging = averaging || 0.95;
            processor.clipLag = clipLag || 750;

            // this will have no effect, since we don't copy the input to the output,
            // but works around a current Chrome bug.
            processor.connect(audioContext.destination);

            processor.checkClipping = function () {

                if (!processor.clipping) {
                    return false;
                }
                if ((processor.lastClip + processor.clipLag) < window.performance.now()) {
                    processor.clipping = false;
                }
                return processor.clipping;
            };

            processor.shutdown = function () {
                processor.disconnect();
                processor.onaudioprocess = null;
            };

            this.audioProcessor = processor;

            this.mediaStreamSource.connect(this.audioProcessor);
        }


    }
    stopAudioMeter() {
        if (this.audioProcessor) {
            this.audioProcessor.shutdown();
            this.mediaStreamSource.disconnect(this.audioProcessor);
            this.audioProcessor = null;
        }

        this.mediaStreamSource = null;
    }


    /** Process volume using root mean square.
        @param {object} event from audioContext.createScriptProcessor.onaudioprocess
        @this {AudioProcessor} audioProcessor
    */
    processVolume(event) {

        let buf = event.inputBuffer.getChannelData(0);
        let bufLength = buf.length;
        let sum = 0;
        let x;


        // Average out the absolute values
        for (let i = 0; i < bufLength; i++) {
            x = buf[i];
            sum += Math.abs(x);
        }

        // ... then take the square root of the sum.
        let avg = Math.sqrt(sum / bufLength);


        // divide by .5 because the max value seems to be around .5...
        // this needs to be improved as it is not accurate, but it's enough to show
        // a bit of a microphone level.
        this.audioProcessor.volume = avg / 0.5;


    }


} // AudioCapture

export default AudioCapture;