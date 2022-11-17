class Camera {
  constructor() {
    this.isMirrored = true;
    this.cameraFacing = "user";
    this.initialiseMedia();
  }

  initialiseMedia() {
    if (!("mediaDevices" in navigator)) {
      navigator.mediaDevices = {};
    }

    if (!("getUserMedia" in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = (constraints) => {
        const getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
          return false; //Promise.reject(console.log('Get user media is not implemented'));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
  }

  hasCamera() {
    return !!navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  }

  layoutDiv(el, x, y, w, h) {
    try {
      el.style.position = "absolute";
      el.style.top = y + "px";
      el.style.left = x + "px";
      if (w) {
        el.style.width = w + "px";
      }
      if (h) {
        el.style.height = h + "px";
      }
    } catch (e) {
      console.log("Cannot layout element", el, e);
    }
  }

  show(shapeData) {
    this.shapeData = shapeData;
    if (!this.cameraPickerDiv) {
      this.cameraPickerDiv = document.createElement("div");
      this.cameraPickerDiv.setAttribute(
        "style",
        "z-index:90000; position:absolute; top:0px, left:0px, width: 1000px; height: 1000px;"
      );

      this.cameraPickerDiv.id = "cameraPickerDiv";

      // the video has autoplay so that the feed will start when shown
      // it also has scale so that the camera will act as a mirror - otherwise
      // it can be awkward to get yourself into the frame.
      let videoStyle = "";
      if (this.isMirrored) {
        videoStyle = `style='-moz-transform: scale(-1, 1); -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); transform: scale(-1, 1); filter: FlipH;'`;
      }
      this.cameraPickerDiv.innerHTML =
        `<video id='CameraPickerDialog-cameraFeed'` +
        videoStyle +
        ` autoplay></video>
               <img id='CameraPickerDialog-maskImg' src='` +
        this.shapeData.image +
        `'></img>`;

      document.getElementById("backdrop").appendChild(this.cameraPickerDiv);

      this.videoElement = document.getElementById(
        "CameraPickerDialog-cameraFeed"
      );
      this.maskImg = document.getElementById("CameraPickerDialog-maskImg");

      // Similar to ScratchJR.m openfeed
      // camera rect is just the small opening: x,y,width,height
      this.layoutDiv(
        this.videoElement,
        this.shapeData.x,
        this.shapeData.y,
        this.shapeData.width,
        this.shapeData.height
      );

      // maskImg is a workspace sized image to display over the camera so you can see the rest
      // of the drawing.  e.g. if you're only filling in the cat's head, this image
      // is everything (graph paper, cat body) but the cat's head.

      // maskedImg rect is: mx,my,mw,mh
      this.layoutDiv(
        this.maskImg,
        this.shapeData.mx,
        this.shapeData.my,
        this.shapeData.mw,
        this.shapeData.mh
      );

      this.videoCaptureElement = new VideoCapture(this.videoElement);
      this.videoCaptureElement.isRecordingPermitted = true;
      const supports = navigator.mediaDevices.getSupportedConstraints();
      if (!supports['facingMode']) {
        alert('This browser does not support facingMode!');
      }
      this.videoCaptureElement.startRecord({
        video: {
          width: this.shapeData.width,
          height: this.shapeData.height,
          facingMode: this.cameraFacing,
        },
      });
    }
  }

  hide() {
    if (this.videoCaptureElement) {
      this.videoCaptureElement.stopRecord();
      this.videoCaptureElement = null;

      this.cameraPickerDiv.remove();

      this.cameraPickerDiv = null;
      this.videoElement = null;
    }
  }
}

class VideoCapture {
  constructor(videoElement) {
    // https://www.html5rocks.com/en/tutorials/getusermedia/intro/
    this.videoElement = videoElement || document.createElement("video");
    this.errorHandler = null;
  }

  getId() {
    if (!this.id) {
      // uuid generator
      this.id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }
    return this.id;
  }
  startRecord(constraints) {
    constraints = constraints || { video: true, audio: false };
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.beginStartRecord.bind(this), this.onError.bind(this));
    }
    return this.getId() + ".webm";
  }

  stopRecord() {
    try {
      if (this.currentStream) {
        let audioTracks = this.currentStream.getAudioTracks();
        if (audioTracks) {
          for (let i = 0; i < audioTracks.length; i++) {
            audioTracks[i].stop();
          }
        }
        let videoTracks = this.currentStream.getVideoTracks();
        if (videoTracks) {
          for (let i = 0; i < videoTracks.length; i++) {
            videoTracks[i].stop();
          }
        }
        this.videoElement.pause();

        this.videoElement.src = null;
      }
    } catch (e) {
      console.log("could not close webcam");
    }
  }

  beginStartRecord(stream) {
    this.videoElement.srcObject = stream;
    this.currentStream = stream;

    if (!this.isRecordingPermitted) {
      this.stopRecord();
      throw new Error("Recording video is not permitted.");
    }
  }

  onError(e) {
    console.log(e);
    if (!this.inOnError) {
      try {
        this.inOnError = true;
        this.stopRecord();
      } finally {
        this.inOnError = false;
      }
    }

    if (this.errorHandler) {
      this.errorHandler(e);
    }
  }

  /** takes a picture of the current video feed and returns a data: url in png format */
  snapshot(cameraRect, isMirrored) {
    if (!this.currentStream || !this.isRecordingPermitted) return null;

    // make a canvas to draw the current video frame to
    let canvas = document.createElement("canvas");

    // make the canvas the same size as the videoElement.
    let w = this.videoElement.clientWidth; // cameraRect.width;
    let h = this.videoElement.clientHeight; // cameraRect.height;

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    // draw the video to the canvas, then convert to an image.
    let ctx = canvas.getContext("2d");

    if (isMirrored) {
      // mirror the context so that the image draws reversed too
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      this.videoElement,
      0,
      0,
      this.videoElement.clientWidth,
      this.videoElement.clientHeight
    );

    let data = canvas.toDataURL("image/png");
    return data;
  }
}

const camInstance = new Camera();
export default camInstance;
