/**
 * Each MartyBlocks instance is associated with a single marty.
 * It subscribes to the published data events of the marty and
 * provides methods to interact with the marty.
 */
import isVersionGreater, { isVersionGreater_errorCatching } from "../utils/compare-version";
import { isVersionEqual } from "../utils/versionChecker";
import Prims from "../editor/engine/Prims";


export default class MartyBlocks {
    static moveTimeBuffer = 500; //(in ms) this is a little extra time added to move time to allow Marty to keep up with the Sprite
    static turnSize = 10;        //the angle in degrees that a turn should be, this is both sent to Marty and used in the Sprite
    static turnStepCount = 10;    //the number of sprite 'steps' to make in a single turn
    static turnMoveTime = 1500;  //the movetime parameter for left and right turns
    static stepMoveTime = 1500;  //the movetime parameter for forward, backward, left and right steps
    static YStepSize = 25;       //the size of a forward/backward step used by the sprite and Marty
    static XStepSize = 35;       //the size of a left/right step used by the sprite and Marty
    static maxStepArgument = 20; //the maxmum number of steps we can make in one REST command

    static LED_EYES_FW_VERSION = "1.2.0"; // greater versions than this support the LED_EYE functionality
    static LED_MS_PARAMETER_SUPPORT = "1.2.46"; // greater versions than this support the ms parameter for LEDs
    static FILE_RUN_CHANGES_VERSION = "1.3.1"; // greater versions than this support the new sound file location

    static MARTY_SOUNDS_NOT_IN_FW = "1.3.0"; // greater versions than this support the new sound file location

    static COLOUR_POLL_INTERVAL_MS = 100;
    static COLOUR_READING_MAX_AGE_MS = 500;

    constructor(marty) {
        this.marty = marty;
        this.sensorListeners = [];

        // Subscribe to the published data events of the marty
        const colourEvents = this.marty.publishedDataAnalyser.eventsMap.colourSensed;
        this.subscribeToSensorEvent(colourEvents.red, this.onColourSensedRed);
        this.subscribeToSensorEvent(colourEvents.green, this.onColourSensedGreen);
        this.subscribeToSensorEvent(colourEvents.blue, this.onColourSensedBlue);
        this.subscribeToSensorEvent(colourEvents.purple, this.onColourSensedPurple);
        this.subscribeToSensorEvent(colourEvents.yellow, this.onColourSensedYellow);
        this.subscribeToSensorEvent(colourEvents.air, this.onColourSensedNone);
        this.subscribeToSensorEvent(colourEvents.unclear, this.onColourSensedNone);

        const obstacleSenseEvents = this.marty.publishedDataAnalyser.eventsMap?.objectSense;
        if (obstacleSenseEvents) {
            const obstacleDetectedEvent = obstacleSenseEvents.near;
            if (obstacleDetectedEvent) {
                this.subscribeToSensorEvent(obstacleDetectedEvent, this.onObstacleSensed);
            }

            const obstacleNotDetectedEvent = obstacleSenseEvents.none;
            if (obstacleNotDetectedEvent) {
                this.subscribeToSensorEvent(obstacleNotDetectedEvent, this.onObstacleNotSensed);
            }
        }

        const lightSenseEvents = this.marty.publishedDataAnalyser.eventsMap?.lightSense;
        if (lightSenseEvents) {
            if (lightSenseEvents.none) {
                this.subscribeToSensorEvent(lightSenseEvents.none, this.onLightSensedLow);
            }
            if (lightSenseEvents.mid) {
                this.subscribeToSensorEvent(lightSenseEvents.mid, this.onLightSensedMid);
            }
            if (lightSenseEvents.high) {
                this.subscribeToSensorEvent(lightSenseEvents.high, this.onLightSensedHigh);
            }
        }

        const noiseSenseEvents = this.marty.publishedDataAnalyser.eventsMap?.noiseSense;
        if (noiseSenseEvents) {
            const noiseDetectedEvent = noiseSenseEvents.high;
            if (noiseDetectedEvent) {
                this.subscribeToSensorEvent(noiseDetectedEvent, this.onNoiseSensed);
            }
            
            const noNoiseEvent = noiseSenseEvents.low;
            if (noNoiseEvent) {
                this.subscribeToSensorEvent(noNoiseEvent, this.onNoNoiseSensed);
            }
        }

        // Hosts may emit only on colour changes. Recheck the confirmed state so
        // a held colour also starts newly added or previously busy scripts.
        // Prims.OnMartyEvent prevents overlapping runs of the same script.
        this.colourPollInterval = setInterval(() => this.pollSensedColour(), MartyBlocks.COLOUR_POLL_INTERVAL_MS);
        this.destroyOnPageHide = this.destroy.bind(this);
        window.addEventListener?.('pagehide', this.destroyOnPageHide, {once: true});
    }

    subscribeToSensorEvent(event, callback) {
        const listener = callback.bind(this);
        this.sensorListeners.push({event, listener});
        this.marty.publishedDataAnalyser.on(event, listener);
    }

    pollSensedColour() {
        if (!this.marty || this.marty.isVerified === false || this.marty.isConnected === false || document.hidden) {
            return;
        }
        // Use the host's confirmed colour, never raw RGB values or cached telemetry.
        const receivedAtMs = this.marty.raftStateInfo?.addOnInfoValidMs;
        if (Number.isFinite(receivedAtMs)) {
            const age = Date.now() - receivedAtMs;
            if (receivedAtMs <= 0 || age < 0 || age >= MartyBlocks.COLOUR_READING_MAX_AGE_MS) {
                return;
            }
        }
        const colour = this.marty.publishedDataAnalyser.martyState?.colourSensed;
        if (['red', 'green', 'blue', 'purple', 'yellow'].indexOf(colour) !== -1) {
            Prims.OnMartyEvent('martycoloursensed' + colour);
        } else if (colour === 'air' || colour === 'unclear') {
            this.onColourSensedNone();
        }
    }

    onColourSensedRed() {
        Prims.OnMartyEvent('martycoloursensedred');
    }
    onColourSensedGreen() {
        Prims.OnMartyEvent('martycoloursensedgreen');
    }
    onColourSensedNone() {
        Prims.OnMartyEvent('martycoloursensednone');
    }
    onColourSensedYellow() {
        Prims.OnMartyEvent('martycoloursensedyellow');
    }
    onColourSensedPurple() {
        Prims.OnMartyEvent('martycoloursensedpurple');
    }
    onColourSensedBlue() {
        Prims.OnMartyEvent('martycoloursensedblue');
    }

    onObstacleSensed() {
        Prims.OnMartyEvent('martyobstaclesensedobstaclesensed');
    }

    onObstacleNotSensed() {
        Prims.OnMartyEvent('martyobstaclesensedobstaclenotsensed');
    }

    onLightSensedLow() {
        Prims.OnMartyEvent('martylightsensedlow');
    }

    onLightSensedMid() {
        Prims.OnMartyEvent('martylightsensedmid');
    }

    onLightSensedHigh() {
        Prims.OnMartyEvent('martylightsensedhigh');
    }

    onNoiseSensed() {
        Prims.OnMartyEvent('martynoisesensednoisesensed');
    }

    onNoNoiseSensed() {
        Prims.OnMartyEvent('martynoisesensednonoisesensed');
    }

    destroy() {
        clearInterval(this.colourPollInterval);
        window.removeEventListener?.('pagehide', this.destroyOnPageHide);
        if (!this.marty) {
            return;
        }
        this.sensorListeners.forEach(({event, listener}) => {
            this.marty.publishedDataAnalyser.removeListener(event, listener);
        });
        this.sensorListeners = [];
        this.marty = null;
    }

    logCommand(action, details) {
        console.log('[MartyBlocks]', {
            action,
            ...details
        });
    }

    dance(reps, moveTime) {
        const message = `traj/dance/${reps}?moveTime=${moveTime}`;
        this.logCommand('dance', { reps, moveTime, message });
        this.marty.sendRestMessage(message);
    }

    getReady(moveTime) {
        const message = `traj/getReady/?moveTime=${moveTime}`;
        this.logCommand('getReady', { moveTime, message });
        this.marty.sendRestMessage(message);
    }
    stepForward(steps) {
        const message = `traj/step/${steps}/?moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.YStepSize}`;
        this.logCommand('stepForward', { steps, message });
        this.marty.sendRestMessage(message);
    }
    stepBackward(steps) {
        const message = `traj/step/${steps}/?moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.YStepSize * -1}`;
        this.logCommand('stepBackward', { steps, message });
        this.marty.sendRestMessage(message);
    }
    stepLeft(steps) {
        const message = `traj/sidestep/${steps}/?side=0&moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.XStepSize}`;
        this.logCommand('stepLeft', { steps, message });
        this.marty.sendRestMessage(message);
    }
    stepRight(steps) {
        const message = `traj/sidestep/${steps}/?side=1&moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.XStepSize}`;
        this.logCommand('stepRight', { steps, message });
        this.marty.sendRestMessage(message);
    }
    turnRight(steps) {
        const message = `traj/step/${steps}/?moveTime=${MartyBlocks.turnMoveTime}&turn=${-1 * MartyBlocks.turnSize}&stepLength=1`;
        this.logCommand('turnRight', { steps, message });
        this.marty.sendRestMessage(message);
    }
    turnLeft(steps) {
        const message = `traj/step/${steps}/?moveTime=${MartyBlocks.turnMoveTime}&turn=${MartyBlocks.turnSize}&stepLength=1`;
        this.logCommand('turnLeft', { steps, message });
        this.marty.sendRestMessage(message);
    }
    eyesExcited() {
        this.marty.sendRestMessage("traj/eyesExcited");
    }
    eyesWide() {
        this.marty.sendRestMessage("traj/eyesWide");
    }
    eyesAngry() {
        this.marty.sendRestMessage("traj/eyesAngry");
    }
    eyesNormal() {
        this.marty.sendRestMessage("traj/eyesNormal");
    }
    eyesWiggle(reps) {
        this.marty.sendRestMessage(`traj/wiggleEyes/${reps}`);
    }
    waveLeft(reps) {
        this.marty.sendRestMessage(`traj/wave/${reps}/?side=0`);
    }
    waveRight(reps) {
        this.marty.sendRestMessage(`traj/wave/${reps}/?side=1`);
    }
    ledEyesP1(duration) {
        if (!isVersionGreater_errorCatching(this.marty.getRaftVersion(), MartyBlocks.LED_EYES_FW_VERSION)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        }
        this.clearLedsIn(duration - 100);
        this.marty.sendRestMessage("led/LEDeye/pattern/show-off");
        this.marty.sendRestMessage("led/LEDarm/pattern/show-off");
        this.marty.sendRestMessage("led/LEDfoot/pattern/show-off");
    }
    ledEyesP2(duration) {
        if (!isVersionGreater_errorCatching(this.marty.getRaftVersion(), MartyBlocks.LED_EYES_FW_VERSION)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        }
        this.clearLedsIn(duration - 100);
        this.marty.sendRestMessage("led/LEDeye/pattern/pinwheel");
        this.marty.sendRestMessage("led/LEDarm/pattern/pinwheel");
        this.marty.sendRestMessage("led/LEDfoot/pattern/pinwheel");
    }
    ledEyesP3() {

    }
    clearLedsIn(timeoutInterval) {
        const turnOffLedEyesTimer = setTimeout(() => {
            this.marty.sendRestMessage("led/LEDeye/color/000000");
            this.marty.sendRestMessage("led/LEDarm/color/000000");
            this.marty.sendRestMessage("led/LEDfoot/color/000000");
            clearTimeout(turnOffLedEyesTimer);
        }, timeoutInterval);
    }
    ledEyesColour(colour, duration) {
        if (!isVersionGreater_errorCatching(this.marty.getRaftVersion(), MartyBlocks.LED_EYES_FW_VERSION)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        }
        if (isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.LED_MS_PARAMETER_SUPPORT)) {
            // Marty supports ms parameter
            this.marty.sendRestMessage(`led/LEDeye/color/${colour}?ms=${duration + 100}`); // +100 so the leds are turning off after the blocks duration (cf if the are in a for loop this will keep the leds on)
            this.marty.sendRestMessage(`led/LEDarm/color/${colour}?ms=${duration + 100}`);
            this.marty.sendRestMessage(`led/LEDfoot/color/${colour}?ms=${duration + 100}`);
            return;
        }
        // Marty does not support ms parameter
        this.marty.sendRestMessage(`led/LEDeye/color/${colour}`);
        this.marty.sendRestMessage(`led/LEDarm/color/${colour}`);
        this.marty.sendRestMessage(`led/LEDfoot/color/${colour}`);
        this.clearLedsIn(duration - 100);
    }
    kickLeft(reps) {
        this.marty.sendRestMessage(`traj/kick/${reps}/?side=0`);
    }
    kickRight(reps) {
        this.marty.sendRestMessage(`traj/kick/${reps}/?side=1`);
    }
    confusion() {
        if (isVersionEqual(this.marty.getRaftVersion(), MartyBlocks.MARTY_SOUNDS_NOT_IN_FW)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        } else if (!isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.FILE_RUN_CHANGES_VERSION)) {
            this.marty.sendRestMessage("filerun/spiffs/confused.raw");
        } else {
            this.marty.sendRestMessage("filerun/confused.mp3");
        }
    }
    disbelief() {
        if (isVersionEqual(this.marty.getRaftVersion(), MartyBlocks.MARTY_SOUNDS_NOT_IN_FW)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        } else if (!isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.FILE_RUN_CHANGES_VERSION)) {
            this.marty.sendRestMessage("filerun/spiffs/disbelief.raw");
        } else {
            this.marty.sendRestMessage("filerun/disbelief.mp3");
        }
    }
    excitement() {
        if (isVersionEqual(this.marty.getRaftVersion(), MartyBlocks.MARTY_SOUNDS_NOT_IN_FW)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        } else if (!isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.FILE_RUN_CHANGES_VERSION)) {
            this.marty.sendRestMessage("filerun/spiffs/excited.raw");
        } else {
            this.marty.sendRestMessage("filerun/excited.mp3");
        }
    }
    noway() {
        if (isVersionEqual(this.marty.getRaftVersion(), MartyBlocks.MARTY_SOUNDS_NOT_IN_FW)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        } else if (!isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.FILE_RUN_CHANGES_VERSION)) {
            this.marty.sendRestMessage("filerun/spiffs/no_way.raw");
        } else {
            this.marty.sendRestMessage("filerun/no_way.mp3");
        }
    }
    no() {
        if (isVersionEqual(this.marty.getRaftVersion(), MartyBlocks.MARTY_SOUNDS_NOT_IN_FW)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        } else if (!isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.FILE_RUN_CHANGES_VERSION)) {
            this.marty.sendRestMessage("filerun/spiffs/no.raw");
        } else {
            this.marty.sendRestMessage("filerun/no.mp3");
        }
    }
    whistle() {
        if (isVersionEqual(this.marty.getRaftVersion(), MartyBlocks.MARTY_SOUNDS_NOT_IN_FW)) {
            return window.applicationManager.toaster.warn("Marty's firmware is not up to date for this feature. Please update Marty's firmware.");
        } else if (!isVersionGreater(this.marty.getRaftVersion(), MartyBlocks.FILE_RUN_CHANGES_VERSION)) {
            this.marty.sendRestMessage("filerun/spiffs/whistle.raw");
        } else {
            this.marty.sendRestMessage("filerun/whistle.mp3");
        }
    }
}
