/**
 * Each CogBlocks instance is associated with a single cog.
 * It subscribes to the published data events of the cog and
 * provides methods to interact with the cog.
 */
import Prims from "../editor/engine/Prims";
import CogMusicBlocks from "./CogMusicBlocks";

export default class CogBlocks {
    static selectedColour = null;

    constructor(cog) {
        this.cog = cog;
        this.musicBlocks = new CogMusicBlocks(cog);

        // Subscribe to the published data events of the cog
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.tilt.left, this.onTiltLeft.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.tilt.right, this.onTiltRight.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.tilt.forward, this.onTiltForward.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.tilt.backward, this.onTiltBackward.bind(this));

        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.movementType.shake, this.onShake.bind(this));

        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.buttonClick.click, this.onButtonClick.bind(this));

        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.lightSense.high, this.onHighLight.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.lightSense.mid, this.onMidLight.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.lightSense.low, this.onLowLight.bind(this));

        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.objectSense.right, this.onObjectSensedRight.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.objectSense.left, this.onObjectSensedLeft.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.objectSense.none, this.onNoObjectSensed.bind(this));

        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.steering.right, this.onSteerRight.bind(this));
        this.cog.publishedDataAnalyser.on(this.cog.publishedDataAnalyser.eventsMap.steering.left, this.onSteerLeft.bind(this));
    }

    destroy() {
        // Unsubscribe from the published data events of the cog
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.tilt.left, this.onTiltLeft.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.tilt.right, this.onTiltRight.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.tilt.forward, this.onTiltForward.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.tilt.backward, this.onTiltBackward.bind(this));

        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.movementType.shake, this.onShake.bind(this));

        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.buttonClick.click, this.onButtonClick.bind(this));

        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.lightSense.high, this.onHighLight.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.lightSense.mid, this.onMidLight.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.lightSense.low, this.onLowLight.bind(this));

        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.objectSense.right, this.onObjectSensedRight.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.objectSense.left, this.onObjectSensedLeft.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.objectSense.none, this.onNoObjectSensed.bind(this));

        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.steering.right, this.onSteerRight.bind(this));
        this.cog.publishedDataAnalyser.removeListener(this.cog.publishedDataAnalyser.eventsMap.steering.left, this.onSteerLeft.bind(this));
    }

    onTiltLeft() {
        Prims.OnCogEvent("tiltleft");
    }

    onTiltRight() {
        Prims.OnCogEvent("tiltright");
    }

    onTiltForward() {
        Prims.OnCogEvent("tiltforward");
    }

    onTiltBackward() {
        Prims.OnCogEvent("tiltbackward");
    }

    onShake() {
        Prims.OnCogEvent("onshake");
    }

    onButtonClick() {
        Prims.OnCogEvent("ontouch");
    }

    onLowLight() {
        Prims.OnCogEvent("onlowlight");
    }

    onMidLight() {
        Prims.OnCogEvent("onmidlight");
    }

    onHighLight() {
        Prims.OnCogEvent("onhighlight");
    }

    onObjectSensedRight() {
        Prims.OnCogEvent("onobjectsensedright");
    }

    onObjectSensedLeft() {
        Prims.OnCogEvent("onobjectsensedleft");
    }

    onNoObjectSensed() {
        Prims.OnCogEvent("onnoobjectsensed");
    }

    onSteerRight() {
        Prims.OnCogEvent("steerright");
    }

    onSteerLeft() {
        Prims.OnCogEvent("steerleft");
    }

    async setPattern(pattern) {
        switch (pattern) {
            case "patternrainbow":
                await this.cog.sendRestMessage('led/ring/pattern/RainbowSnake');
                break;
            case "patternpinwheel":
                if (this.selectedColour) {
                    await this.cog.sendRestMessage(`led/ring/pattern/Spin?numPix=12&mod=1&c=${this.selectedColour}`);
                } else {
                    await this.cog.sendRestMessage('led/ring/pattern/Spin?numPix=12&mod=1');
                }
                break;
            case "patternshowoff":
                if (this.selectedColour) {
                    await this.cog.sendRestMessage(`led/ring/pattern/Flash?c=${this.selectedColour}`);
                } else {
                    await this.cog.sendRestMessage('led/ring/pattern/Flash?c=112233');
                }
                break;

            default:
                break;
        }
    }

    async selectColour(colour) {
        switch (colour) {
            case "selectcolourred":
                this.selectedColour = "ff0000";
                await this.cog.sendRestMessage('led/ring/color/ff0000');
                break;
            case "selectcolourgreen":
                this.selectedColour = "00ff00";
                await this.cog.sendRestMessage('led/ring/color/00ff00');
                break;
            case "selectcolourblue":
                this.selectedColour = "0000ff";
                await this.cog.sendRestMessage('led/ring/color/0000ff');
                break;
            case "selectcolourpurple":
                this.selectedColour = "800080";
                await this.cog.sendRestMessage('led/ring/color/800080');
                break;
            case "selectcolourorange":
                this.selectedColour = "ffa500";
                await this.cog.sendRestMessage('led/ring/color/ffa500');
                break;
            case "selectcolouryellow":
                this.selectedColour = "ffff00";
                await this.cog.sendRestMessage('led/ring/color/ffff00');
                break;

            default:
                break;
        }
    }

    async clearColours() {
        this.selectedColour = null;
        await this.cog.sendRestMessage('led/ring/color/000000');
    }
}