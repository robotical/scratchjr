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

    constructor(marty) {
        this.marty = marty;

        // Subscribe to the published data events of the marty
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.red, this.onColourSensedRed.bind(this));
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.green, this.onColourSensedGreen.bind(this));
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.blue, this.onColourSensedBlue.bind(this));
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.purple, this.onColourSensedPurple.bind(this));
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.yellow, this.onColourSensedYellow.bind(this));
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.air, this.onColourSensedNone.bind(this));
        this.marty.publishedDataAnalyser.on(this.marty.publishedDataAnalyser.eventsMap.colourSensed.unclear, this.onColourSensedNone.bind(this));

        const obstacleSenseEvents = this.marty.publishedDataAnalyser.eventsMap?.obstacleSense
            || this.marty.publishedDataAnalyser.eventsMap?.obstacleSensed;
        if (obstacleSenseEvents) {
            const obstacleDetectedEvent = obstacleSenseEvents.sensed
                || obstacleSenseEvents.obstacleSensed
                || obstacleSenseEvents.detected;
            if (obstacleDetectedEvent) {
                this.marty.publishedDataAnalyser.on(obstacleDetectedEvent, this.onObstacleSensed.bind(this));
            }

            const obstacleNotDetectedEvent = obstacleSenseEvents.notSensed
                || obstacleSenseEvents.obstacleNotSensed
                || obstacleSenseEvents.none;
            if (obstacleNotDetectedEvent) {
                this.marty.publishedDataAnalyser.on(obstacleNotDetectedEvent, this.onObstacleNotSensed.bind(this));
            }
        }

        const lightSenseEvents = this.marty.publishedDataAnalyser.eventsMap?.lightSense;
        if (lightSenseEvents) {
            if (lightSenseEvents.none) {
                this.marty.publishedDataAnalyser.on(lightSenseEvents.none, this.onLightSensedNone.bind(this));
            }
            if (lightSenseEvents.mid) {
                this.marty.publishedDataAnalyser.on(lightSenseEvents.mid, this.onLightSensedMid.bind(this));
            }
            if (lightSenseEvents.high) {
                this.marty.publishedDataAnalyser.on(lightSenseEvents.high, this.onLightSensedHigh.bind(this));
            }
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

    onLightSensedNone() {
        Prims.OnMartyEvent('martylightsensednone');
    }

    onLightSensedMid() {
        Prims.OnMartyEvent('martylightsensedmid');
    }

    onLightSensedHigh() {
        Prims.OnMartyEvent('martylightsensedhigh');
    }

    destroy() {
        this.marty = null;
    }

    dance(reps, moveTime) {
        this.marty.sendRestMessage(`traj/dance/${reps}?moveTime=${moveTime}`);
    }

    getReady(moveTime) {
        this.marty.sendRestMessage(`traj/getReady/?moveTime=${moveTime}`);
    }
    stepForward(steps) {
        this.marty.sendRestMessage(`traj/step/${steps}/?moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.YStepSize}`);
    }
    stepBackward(steps) {
        this.marty.sendRestMessage(`traj/step/${steps}/?moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.YStepSize * -1}`);
    }
    stepLeft(steps) {
        this.marty.sendRestMessage(`traj/sidestep/${steps}/?side=0&moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.XStepSize}`);
    }
    stepRight(steps) {
        this.marty.sendRestMessage(`traj/sidestep/${steps}/?side=1&moveTime=${MartyBlocks.stepMoveTime}&stepLength=${MartyBlocks.XStepSize}`);
    }
    turnRight(steps) {
        this.marty.sendRestMessage(`traj/step/${steps}/?moveTime=${MartyBlocks.turnMoveTime}&turn=${-1 * MartyBlocks.turnSize}&stepLength=1`);
    }
    turnLeft(steps) {
        this.marty.sendRestMessage(`traj/step/${steps}/?moveTime=${MartyBlocks.turnMoveTime}&turn=${MartyBlocks.turnSize}&stepLength=1`);
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
