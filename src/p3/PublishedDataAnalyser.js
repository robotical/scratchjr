import { isVersionGreater_errorCatching } from "../utils/compare-version";
import P3vmEvents from "./P3EventEnum";

export default class PublishedDataAnalyser {
    static _instance;
    publisher = null;

    // Get instance
    static getInstance() {
        if (!PublishedDataAnalyser._instance) {
            PublishedDataAnalyser._instance = new PublishedDataAnalyser();
        }
        return PublishedDataAnalyser._instance;
    }

    analyse(data, p3vm) {
        this.publisher = p3vm.publish.bind(p3vm);
        const isMoving = this.detectMovement(data);
        this.detectTilt(data, isMoving);
        this.detectRotation(data, isMoving);
        this.detectButtonClick(data);
    }

    detectTilt(data, isMoving) {
        TiltDetection.detectTilt(data, {
            onTiltLeft: () => this.publisher(P3vmEvents.TILE_LEFT),
            onTiltRight: () => this.publisher(P3vmEvents.TILT_RIGHT),
            onTiltForward: () => this.publisher(P3vmEvents.TILT_FORWARD),
            onTiltBackward: () => this.publisher(P3vmEvents.TILT_BACKWARD),
        }, isMoving)
    }

    detectMovement(data) {
        return ShakeDetector.detectShake(data.LSM6DS.ax, data.LSM6DS.ay, data.LSM6DS.az, Date.now(), () => this.publisher(P3vmEvents.ON_SHAKE), () => this.publisher(P3vmEvents.ON_MOVE));
    }

    detectRotation(data, isMoving) {
        RotationDetection.detectRotation(data, () => this.publisher(P3vmEvents.ON_ROTATE_CLOCKWISE), () => this.publisher(P3vmEvents.ON_ROTATE_COUNTER_CLOCKWISE), isMoving);
    }

    detectButtonClick(data) {
        ButtonClickDetection.detectButtonClick(data.Light.irVals[2], () => this.publisher(P3vmEvents.ON_BUTTON_CLICK));
    }
}

class TiltDetection {
    static distance(a, b) { return Math.sqrt((Math.pow(a, 2) + Math.pow(b, 2))) }


    static rotateAccelData(x, y, z, degrees) {
        // Convert degrees to radians
        const radians = degrees * (Math.PI / 180);

        // First rotate by 180 degrees about y axis
        let rotatedX = 0-x;
        let rotatedY = y;
        let rotatedZ = 0-z;

        const initialRotatedX = rotatedX; 

        // Calculate cosine and sine of the rotation angle
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        // Rotate around the z-axis
        rotatedX = initialRotatedX * cosTheta - rotatedY * sinTheta;
        rotatedY = initialRotatedX * sinTheta + rotatedY * cosTheta;
        rotatedZ = rotatedZ;  // z remains unchanged as the rotation is around the z-axis

        return { x: rotatedX, y: rotatedY, z: rotatedZ };
    }

    static detectTilt(data, { onTiltLeft, onTiltRight, onTiltForward, onTiltBackward }, isMoving = false) {
        if (isMoving) return;

        const tiltCorrectionForOlderCog = 30;
        const tiltCorrectionForNewerCog = -90;
        const correctionCutOffVersion = "1.2.0";
        let tiltCorrection = tiltCorrectionForOlderCog;

        if (isVersionGreater_errorCatching(window.P3vm.getInstance().sysInfo.SystemVersion, correctionCutOffVersion)) {
            tiltCorrection = tiltCorrectionForNewerCog;
        }

        const { x, y, z } = this.rotateAccelData(data.LSM6DS.ax, data.LSM6DS.ay, data.LSM6DS.az, window.tilt_rotate_z_deg || tiltCorrection);
        const pitch = Math.atan2(x, this.distance(y, z));
        const roll = Math.atan2(y, this.distance(x, z));
        const yaw = Math.atan2(z, this.distance(x, y));

        const forwardBackwardThreshold = window.tilt_fw_bw || 20 * (Math.PI / 180); // threshold for forward and backward tilt
        const leftRightThreshold = window.tilt_left_right || 20 * (Math.PI / 180); // threshold for left and right tilt
        // const upDownThreshold = window.tilt_up_down || 0.5; // threshold for up and down tilt

        let tiltDirection = "";
        if (pitch < -forwardBackwardThreshold){// && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "forward";
            onTiltForward();
        }
        if (pitch > forwardBackwardThreshold){// && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "backward";
            onTiltBackward();
        }
        if (roll < -leftRightThreshold){// && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "left";
            onTiltLeft();
        }
        if (roll > leftRightThreshold){// && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "right";
            onTiltRight();
        }
        if (tiltDirection !== "") {
            console.log("Tilt direction: ", tiltDirection);
            console.log("pitch: ", pitch, "roll: ", roll, "yaw: ", yaw);
        }
    }
}

class RotationDetection {
    static dataBuffer = [];
    static bufferSize = 20; // buffer size for rotation detection
    static DELAY_FOR_ROTATION = 500; // delay between rotation detection
    static ROTATION_THRESHOLD = 8; // threshold for rotation detection
    static rotationDetected = false;
    static lastRotationDetectionTime = 0;
    static rotationTimer = null;

    static addToBuffer(data) {
        this.dataBuffer.push(data);
        if (this.dataBuffer.length > this.bufferSize) {
            this.dataBuffer.shift();
        }
    }

    static detectRotation(data, onClockRotationDetected, onCounterClockRotationDetected, isMoving = false) {
        this.bufferSize = window.rotation_buffer_size || this.bufferSize;
        this.DELAY_FOR_ROTATION = window.rotation_delay || this.DELAY_FOR_ROTATION;
        this.ROTATION_THRESHOLD = window.rotation_thr || this.ROTATION_THRESHOLD;
        const currentTime = Date.now();

        this.addToBuffer(data.LSM6DS.gz);
        if (this.dataBuffer.length < this.bufferSize) {
            return;  // Wait until buffer is full
        }

        if (currentTime - this.lastRotationDetectionTime < this.DELAY_FOR_ROTATION || isMoving) {
            // Ensure there is a minimum time between detections
            return;
        }

        const metric = this.calculateMetric();
        // Check if the magnitude of the rate of change is above the threshold
        if (metric > this.ROTATION_THRESHOLD || metric < -this.ROTATION_THRESHOLD) {
            this.lastRotationDetectionTime = currentTime;
            this.dataBuffer = [];
            if (metric > this.ROTATION_THRESHOLD) {
                console.log("Clockwise rotation detected:", metric);
                onClockRotationDetected();
            } else if (metric < -this.ROTATION_THRESHOLD) {
                console.log("Counter-clockwise rotation detected:", metric);
                onCounterClockRotationDetected();
            }
        }
    }

    static calculateMetric() {
        //let gzArray = [];
        let sum = 0;
        for (let i = 0; i < this.dataBuffer.length; i++) {
            //sum += this.dataBuffer[i].LSM6DS.gz;
            sum += this.dataBuffer[i];
            //gzArray.push(this.dataBuffer[i]);
        }
        //console.log("gz buffer (" + gzArray.length + " elements avg. " + (sum / this.dataBuffer.length) + "): " + gzArray);
        //console.log(this.dataBuffer);
        return sum / this.dataBuffer.length;
    }
}

class ShakeDetector {
    static shakeCallback;
    static moveCallback;
    static thresholdAccelerationMove = 0.3;
    static thresholdAcceleration = 1; // how much acceleration is needed to consider shaking
    static thresholdShakeNumber = 1; // how many shakes are needed
    static interval = 400; // how much time between shakes
    static maxShakeDuration = 1500; // Maximum duration between first and last shakes in a sequence
    static coolOffPeriod = 1500; // how much time to wait before detecting another shake
    static lastTime = 0;
    static lastTimeShakeDetected = 0;
    static sensorBundles = [];
    static gravityVector = [0,0,0];
    static lastVector = [0,0,0];
    static shakeInProgress = false;
    static moveInProgress = false;

    static detectShake(xAcc, yAcc, zAcc, timestamp, shakeCallback, moveCallback) {
        this.thresholdAcceleration = window.shake_thr_acc || this.thresholdAcceleration;
        this.thresholdAccelerationMove = window.move_thr_acc || this.thresholdAccelerationMove;
        this.thresholdShakeNumber = window.shake_thr_num || this.thresholdShakeNumber;
        this.interval = window.shake_interval || this.interval;
        this.maxShakeDuration = window.shake_max_duration || this.maxShakeDuration;
        this.coolOffPeriod = window.shake_cool_off || this.coolOffPeriod;

        this.shakeCallback = shakeCallback;
        this.moveCallback = moveCallback;

        const magAcc = Math.sqrt(xAcc * xAcc + yAcc * yAcc + zAcc * zAcc);
        if (magAcc > 0.9 && magAcc < 1.1){
            // device is stationary-ish, log direction of acc values to get a rough reading on where down is
            this.gravityVector = [xAcc, yAcc, zAcc];
            if (this.moveInProgress){
                console.log("move detected");
                this.moveCallback();   
            }
            this.moveInProgress = false;
            this.shakeInProgress = false;
            this.sensorBundles = [];
        } else {
            //console.log("move in progrss. prev state: ", this.moveInProgress);
            // potentially threshold this with thresholeAccelerationMove if we want it to be less trigger happy
            this.moveInProgress = true;

            // this assumes that the orientation of the device doesn't change during the movement, so it's not ideal
            const x = xAcc - this.gravityVector[0];
            const y = yAcc - this.gravityVector[1];
            const z = zAcc - this.gravityVector[2];
            const mag = Math.sqrt(x * x + y * y + z * z);

            if (mag > this.thresholdAcceleration || this.shakeInProgress){
                this.shakeInProgress = true;
                if (mag > this.thresholdAcceleration){
                    console.log('large magnitude movement ', x, y, z, this.gravityVector);
                    // check if the acc vector is significantly changed from the previous large value
                    if (!this.sensorBundles.length || Math.sqrt(Math.pow(this.lastVector[0] - x,2) + Math.pow(this.lastVector[1] - y,2) + Math.pow(this.lastVector[2] - z,2)) > this.thresholdAcceleration){
                        this.sensorBundles.push({x, y, z, timestamp });
                        //console.log(this.sensorBundles);
                        this.lastVector = [x, y, z];
                        // todo - call performCheck() to do a more detailed analysis of the readings? Might need some tweaks
                        if (this.sensorBundles.length > this.thresholdShakeNumber){
                            console.log("Shake detected!");
                            this.sensorBundles = [];
                            this.shakeInProgress = false;
                            this.shakeCallback();
                        }
                    }
                } else {
                    if (!this.sensorBundles.length || (timestamp - this.sensorBundles[this.sensorBundles.length-1].timestamp) > this.interval){
                        this.shakeInProgress = false;
                        this.sensorBundles = [];
                        console.log("resetting shake detector. Move detected");
                        // fire move detector
                        this.moveCallback();
                    }
                }
            }
        
        return this.moveInProgress;
        }
    }

    static performCheck() {
        const matrix = [
            [0, 0], // X axis positive and negative
            [0, 0], // Y axis positive and negative
            [0, 0]  // Z axis positive and negative
        ];

        for (const bundle of this.sensorBundles) {
            this.updateAxis(0, bundle.xAcc, matrix);
            this.updateAxis(1, bundle.yAcc, matrix);
            this.updateAxis(2, bundle.zAcc, matrix, -1);
        }

        // check if the number of shakes is above the threshold
        if (matrix.some(axis => axis[0] >= this.thresholdShakeNumber && axis[1] >= this.thresholdShakeNumber)) {
            // if (positivesTotal >= this.thresholdShakeNumber && negativesTotal >= this.thresholdShakeNumber) {

            if (Date.now() - this.lastTimeShakeDetected < this.coolOffPeriod) {
                return;
            }
            this.lastTimeShakeDetected = Date.now();

            console.log("Shake detected!", JSON.stringify(matrix));
            this.shakeCallback();
            this.sensorBundles = [];
        }
    }

    static updateAxis(index, acceleration, matrix, adjustment = 0) {
        /* Update the matrix with the number of shakes in the positive and negative direction */
        const accelerationAdjusted = acceleration + adjustment;
        if (accelerationAdjusted > this.thresholdAcceleration) {
            matrix[index][0]++;
            // console.log(JSON.stringify(matrix));
        } else if (accelerationAdjusted < -this.thresholdAcceleration) {
            matrix[index][1]++;
            // console.log(JSON.stringify(matrix));
        }
    }
}

class ButtonClickDetection {
    /* 
    When the threshold is exceeded, the button is clicked, but we want to send the event when the button is released 
    so that the event is triggered only once. 
    */
   
   static clickThreshold = 1600;
   static releaseThreshold = 1500;
   static lastTime = 0;
   static buttonClicked = false;
   static buttonClickCallback;
   
   static detectButtonClick(buttonValue, buttonClickCallback) {
        const correctionCutOffVersion = "1.2.0";
        let clickThreshold = 1600;
        if (isVersionGreater_errorCatching(window.P3vm.getInstance().sysInfo.SystemVersion, correctionCutOffVersion)) {
            clickThreshold = 2300;
        }
        let releaseThreshold = 1500;
        if (isVersionGreater_errorCatching(window.P3vm.getInstance().sysInfo.SystemVersion, correctionCutOffVersion)) {
            releaseThreshold = 2100;
        }
        this.clickThreshold = window.button_click_threshold || clickThreshold;
        this.releaseThreshold = window.button_release_threshold || releaseThreshold;
        this.buttonClickCallback = buttonClickCallback;
        const currentTime = Date.now();
        if (buttonValue > this.clickThreshold && !this.buttonClicked) {
            console.log("Button clicked", buttonValue);
            this.buttonClicked = true;
            this.buttonClickCallback();
            this.lastTime = currentTime;
        } else if (buttonValue < this.releaseThreshold && this.buttonClicked) {
            console.log("Button released", buttonValue);
            this.buttonClicked = false;
        }
    }

}