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
        this.detectMovement(data);
        this.detectTilt(data);
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
        return ShakeDetector.detectShake(data.LSM6DS.ax, data.LSM6DS.ay, data.LSM6DS.az, Date.now(), () => this.publisher(P3vmEvents.ON_SHAKE), () => this.publisher(P3vmEvents.ON_MOVE));
    }

    detectRotation(data) {
        RotationDetection.detectRotation(data, () => this.publisher(P3vmEvents.ON_ROTATE_CLOCKWISE), () => this.publisher(P3vmEvents.ON_ROTATE_COUNTER_CLOCKWISE));
    }

    detectButtonClick(data) {
        ButtonClickDetection.detectButtonClick(data.Light.irVals[2], () => this.publisher(P3vmEvents.ON_BUTTON_CLICK));
    }
}

class TiltDetection {


    static detectTilt(data, { onTiltLeft, onTiltRight, onTiltForward, onTiltBackward }) {

        let tiltDirection = "";
        if (false) {
            tiltDirection = "forward";
            onTiltForward();
        }
        if (false) {
            tiltDirection = "backward";
            onTiltBackward();
        }
        if (false) {
            tiltDirection = "left";
            onTiltLeft();
        }
        if (false) {
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



    static detectRotation(data, onClockRotationDetected, onCounterClockRotationDetected) {

    }

}

class ShakeDetector {

    static detectShake(xAcc, yAcc, zAcc, timestamp, shakeCallback, moveCallback) {

    }
}

class ButtonClickDetection {

    static detectButtonClick(buttonValue, buttonClickCallback) {
    }

}