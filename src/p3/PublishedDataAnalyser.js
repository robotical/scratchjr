import P3vmEvents from "./P3EventEnum";
import { Butterworth, Filter, FilterType, RealtimeFilter } from "./butterworthiir";


let butterworthFilter;

let realtimeFilterX;
let realtimeFilterY;
let realtimeFilterZ;

const initialiseFilters = () => {
    /* These filters are used to filter the accelerometer data */
    const channels = 1;
    const samplingRate = 10;  // 10Hz -- 10 samples per second
    const filterType = FilterType.Highpass;
    const filterOrder = 4;
    const cutoffFrequencies = [0.5];

    butterworthFilter = new Butterworth(samplingRate, filterType, filterOrder, cutoffFrequencies);

    realtimeFilterX = new RealtimeFilter(butterworthFilter, channels);
    realtimeFilterY = new RealtimeFilter(butterworthFilter, channels);
    realtimeFilterZ = new RealtimeFilter(butterworthFilter, channels);
}
initialiseFilters();
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

    // Analyze the data in the buffer
    analyse(data, p3vm) {
        this.publisher = p3vm.publish.bind(p3vm);
        this.detectTilt(data);
        this.detectMovement(data);
        this.detectRotation(data);
        this.detectButtonClick(data);
    }

    detectTilt(data) {
        TiltDetection.detectTilt(data, {
            onTiltLeft: () => this.publisher(P3vmEvents.TILE_LEFT),
            onTiltRight: () => this.publisher(P3vmEvents.TILT_RIGHT),
            onTiltForward: () => this.publisher(P3vmEvents.TILT_FORWARD),
            onTiltBackward: () => this.publisher(P3vmEvents.TILT_BACKWARD),
        })
    }

    detectMovement(data) {
        ShakeDetector.detectShake(data.LSM6DS.ax, data.LSM6DS.ay, data.LSM6DS.az, Date.now(), () => this.publisher(P3vmEvents.ON_SHAKE));
        // MovementDetection.detectMovement(data, () => this.publisher(P3vmEvents.ON_MOVE), () => this.publisher(P3vmEvents.ON_SHAKE));
    }

    detectRotation(data) {
        RotationDetection.detectRotation(data, () => this.publisher(P3vmEvents.ON_ROTATE_CLOCKWISE), () => this.publisher(P3vmEvents.ON_ROTATE_COUNTER_CLOCKWISE));
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

        // Calculate cosine and sine of the rotation angle
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        // Rotate around the z-axis
        const rotatedX = x * cosTheta - y * sinTheta;
        const rotatedY = x * sinTheta + y * cosTheta;
        const rotatedZ = z;  // z remains unchanged as the rotation is around the z-axis

        return { x: rotatedX, y: rotatedY, z: rotatedZ };
    }

    static detectTilt(data, { onTiltLeft, onTiltRight, onTiltForward, onTiltBackward }) {
        const { x, y, z } = this.rotateAccelData(data.LSM6DS.ax, data.LSM6DS.ay, data.LSM6DS.az, window.tilt_rotate_z_deg || 120);
        const pitch = Math.atan2(x, this.distance(y, z));
        const roll = Math.atan2(y, this.distance(x, z));
        const yaw = Math.atan2(z, this.distance(x, y));
        // no tilt example values: pitch: 0.00, roll: 0.00, yaw: 1.50
        // tilt left example values: pitch: 0.00, roll: -1.00, yaw: 0.50
        // tilt right example values: pitch: 0.00, roll: 1.00, yaw: 0.50
        // tilt forward example values: pitch: -1.00, roll: 0.00, yaw: 0.50
        // tilt backward example values: pitch: 1.00, roll: 0.00, yaw: 0.50

        const forwardBackwardThreshold = window.tilt_fw_bw || 0.4; // threshold for forward and backward tilt
        const leftRightThreshold = window.tilt_left_right || 0.2; // threshold for left and right tilt
        const upDownThreshold = window.tilt_up_down || 0.5; // threshold for up and down tilt

        let tiltDirection = "";
        if (pitch < -forwardBackwardThreshold && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "forward";
            onTiltForward();
        } else if (pitch > forwardBackwardThreshold && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "backward";
            onTiltBackward();
        } else if (roll < -leftRightThreshold && Math.abs(yaw) < upDownThreshold) {
            tiltDirection = "left";
            onTiltLeft();
        } else if (roll > leftRightThreshold && Math.abs(yaw) < upDownThreshold) {
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

    static detectRotation(data, onClockRotationDetected, onCounterClockRotationDetected) {
        this.bufferSize = window.rotation_buffer_size || this.bufferSize;
        this.DELAY_FOR_ROTATION = window.rotation_delay || this.DELAY_FOR_ROTATION;
        this.ROTATION_THRESHOLD = window.rotation_thr || this.ROTATION_THRESHOLD;
        const currentTime = Date.now();
        if (currentTime - this.lastRotationDetectionTime < this.DELAY_FOR_ROTATION) {
            // Ensure there is a minimum time between detections
            return;
        }

        this.addToBuffer(data);
        if (this.dataBuffer.length < this.bufferSize) {
            return;  // Wait until buffer is full
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
        let sum = 0;
        for (let i = 1; i < this.dataBuffer.length; i++) {
            sum += this.dataBuffer[i].LSM6DS.gz;
        }
        return sum / this.dataBuffer.length;
    }
}


class ShakeDetector {
    static shakeCallback;
    static thresholdAcceleration = .2; // how much acceleration is needed to consider shaking
    static thresholdShakeNumber = 1; // how many shakes are needed
    static interval = 100; // how much time between shakes
    static maxShakeDuration = 1500; // Maximum duration between first and last shakes in a sequence
    static coolOffPeriod = 1500; // how much time to wait before detecting another shake
    static lastTime = 0;
    static lastTimeShakeDetected = 0;
    static sensorBundles = [];

    static detectShake(xAcc, yAcc, zAcc, timestamp, shakeCallback) {
        this.thresholdAcceleration = window.shake_thr_acc || this.thresholdAcceleration;
        this.thresholdShakeNumber = window.shake_thr_num || this.thresholdShakeNumber;
        this.interval = window.shake_interval || this.interval;
        this.maxShakeDuration = window.shake_max_duration || this.maxShakeDuration;
        this.coolOffPeriod = window.shake_cool_off || this.coolOffPeriod;

        this.shakeCallback = shakeCallback;
        if (this.sensorBundles.length === 0 || timestamp - this.lastTime > this.interval) {
            // Check if we should reset based on time since last recorded shake
            if (this.sensorBundles.length > 0 && (timestamp - this.sensorBundles[0].timestamp) > this.maxShakeDuration) {
                this.sensorBundles = []; // Reset the sensor data if the shakes are too far apart
            }
            this.sensorBundles.push({ xAcc, yAcc, zAcc, timestamp });
            this.lastTime = timestamp;
            this.performCheck();
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

        // check if any of the negatives and the positives are greater than the threshold
        const negativesTotal = matrix.reduce((acc, axis) => acc + axis[1], 0);
        const positivesTotal = matrix.reduce((acc, axis) => acc + axis[0], 0);

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


class MovementDetection {
    static DELAY_FOR_MOVEMENT_CONFIRMATION = 200; // after movement detected, wait for this time before confirming (in case of shake detection)
    static DELAY_AFTER_SHAKE_OBSEVATION = 1000; // after shake detected, wait for this time before detecting movement
    static DELAY_AFTER_MOVEMENT_IN_GENERAL = 1000; // after either movement or shake detected, wait for this time before detecting again
    static MOVEMENT_THRESHOLD = 0.75; // movement threshold 
    static SHAKE_THRESHOLD = 0.08; // setting shake threshold very low as a way to disable it for now
    // static MOVEMENT_THRESHOLD = 0.3;
    // static SHAKE_THRESHOLD = 0.4
    static lastShakeTime = 0;
    static lastMovementTime = 0;
    static movementTimer = null;

    static calculateMagnitude(x, y) {
        // return Math.sqrt(x * x + y * y + z * z);
        return Math.sqrt(x * x + y * y);
    }

    static detectMovement(data, onMovementDetected, onShakeDetected) {
        this.DELAY_FOR_MOVEMENT_CONFIRMATION = window.movement_movement_delay_confirmation || this.DELAY_FOR_MOVEMENT_CONFIRMATION
        this.DELAY_AFTER_SHAKE_OBSEVATION = window.movement_shake_delay || this.DELAY_AFTER_SHAKE_OBSEVATION
        this.DELAY_AFTER_MOVEMENT_IN_GENERAL = window.movement_delay_g || this.DELAY_AFTER_MOVEMENT_IN_GENERAL
        this.MOVEMENT_THRESHOLD = window.movement_movement_thr || this.MOVEMENT_THRESHOLD
        this.SHAKE_THRESHOLD = window.movement_shake_thr || this.SHAKE_THRESHOLD
        // function processAccelerometerData(dataToProcess) {
        //     const filteredX = realtimeFilterX.step([[dataToProcess.LSM6DS.ax]]);
        //     const filteredY = realtimeFilterY.step([[dataToProcess.LSM6DS.ay]]);
        //     const filteredZ = realtimeFilterZ.step([[dataToProcess.LSM6DS.az]]);

        //     return {
        //         x: filteredX[0][0],
        //         y: filteredY[0][0],
        //         z: filteredZ[0][0]
        //     };
        // }

        // const filteredData = processAccelerometerData(data);
        // const magnitude = MovementDetection.calculateMagnitude(filteredData.x, filteredData.y, filteredData.z);
        const magnitude = MovementDetection.calculateMagnitude(data.LSM6DS.ax, data.LSM6DS.ay, data.LSM6DS.az);
        // Check if the shake threshold is exceeded
        if (Date.now() - this.lastMovementTime > this.DELAY_AFTER_MOVEMENT_IN_GENERAL) {
            if (magnitude < this.SHAKE_THRESHOLD) {
                // if (magnitude > this.SHAKE_THRESHOLD) {
                console.log("Shake detected:", magnitude);
                onShakeDetected();
                clearTimeout(this.movementTimer);  // Cancel the movement confirmation if shake detected
                this.movementTimer = null;
                this.lastShakeTime = Date.now();
                this.lastMovementTime = Date.now();
                // initialiseFilters();
            } else if (magnitude < this.MOVEMENT_THRESHOLD && !this.movementTimer && Date.now() - this.lastShakeTime > this.DELAY_AFTER_SHAKE_OBSEVATION) {
                // } else if (magnitude > this.MOVEMENT_THRESHOLD && !this.movementTimer && Date.now() - this.lastShakeTime > this.DELAY_AFTER_SHAKE_OBSEVATION) {
                // when movement is detected, wait for a confirmation before sending the event
                this.movementTimer = setTimeout(() => {
                    console.log("Movement detected:", magnitude);
                    // initialiseFilters();
                    onMovementDetected();
                    this.movementTimer = null;
                    this.lastMovementTime = Date.now();
                }, this.DELAY_FOR_MOVEMENT_CONFIRMATION);
            }
        }
    }
}


class ButtonClickDetection {
    /* 
    When the threshold is exceeded, the button is clicked, but we want to send the event when the button is released 
    so that the event is triggered only once. 
    */
    static clickThreshold = 1300;
    static releaseThreshold = 1100;
    static lastTime = 0;
    static buttonClicked = false;
    static buttonClickCallback;

    static detectButtonClick(buttonValue, buttonClickCallback) {
        this.clickThreshold = window.button_click_threshold || this.clickThreshold;
        this.releaseThreshold = window.button_release_threshold || this.releaseThreshold;
        this.buttonClickCallback = buttonClickCallback;
        const currentTime = Date.now();
        if (buttonValue > this.clickThreshold && !this.buttonClicked) {
            console.log("Button clicked", buttonValue);
            this.buttonClicked = true;
            this.lastTime = currentTime;
        } else if (buttonValue < this.releaseThreshold && this.buttonClicked) {
            console.log("Button released", buttonValue);
            this.buttonClicked = false;
            this.buttonClickCallback();
        }
    }

}