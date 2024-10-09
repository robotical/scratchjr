/**
 * Each CogBlocks instance is associated with a single cog.
 * It subscribes to the published data events of the cog and
 * provides methods to interact with the cog.
 */
import Prims from "../editor/engine/Prims";
import { raftPubSubscriptionHelper } from "../utils/raft-subscription-helpers";
import PublishedDataAnalyser from "./PublishedDataAnalyser";

export default class CogBlocks {
    static selectedColour = null;

    constructor(cog) {
        this.cog = cog;
        this.publishedDataAnalyser = new PublishedDataAnalyser(this);
        this.subscribeToPublishedDataEvent();
    }

    subscribeToPublishedDataEvent() {
        raftPubSubscriptionHelper(this.cog).subscribe(data => {
            const stateInfo = data.stateInfo;
            this.publishedDataAnalyser.analyse(stateInfo);
        });
    }

    destroy() {
        raftPubSubscriptionHelper(this.cog).unsubscribe();
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

    onMove() {
        Prims.OnCogEvent("onmove");
    }

    onRotateClockwise() {
        Prims.OnCogEvent("onrotateclockwise");
    }

    onRotateCounterClockwise() {
        Prims.OnCogEvent("onrotatecounter");
    }

    onButtonClick() {
        Prims.OnCogEvent("ontouch");
    }

    onLowLight() {
        Prims.OnCogEvent("onlowlight");
    }

    onHighLight() {
        Prims.OnCogEvent("onhighlight");
    }

    onMidLight() {
        Prims.OnCogEvent("onmidlight");
    }

    onCloseDistance() {
        Prims.OnCogEvent("onclosedistance");
    }

    onFarDistance() {
        Prims.OnCogEvent("onfardistance");
    }

    async playSound(sound) {
        switch (sound) {
            case "disbelief":
                await this.cog.sendRestMessage('audio/rtttl/Disbelief:d=4,o=5,b=120:g,8d#,8e,8f,8f#,8g,8a,8b,8c6,8p,8c6,8b,8a,8g,8f#,8e,8f,8d#,8p,8g');
                break;
            case "confusion":
                await this.cog.sendRestMessage('audio/rtttl/Confused:d=4,o=5,b=120:c,e,g,c6,e6,g6,c,e,g,c6,e6,g6,c,e,g,a,a,b,b,c6');
                break;
            case "excitement":
                await this.cog.sendRestMessage('audio/rtttl/Excitement:d=4,o=5,b=180:c,e,g,8c6,16p,8c6,16p,8c6,16p,c,e,g,8c6,16p,8c6,16p,8c6,16p,c,e,g,8c6');
                break;
            case "noway":
                await this.cog.sendRestMessage('audio/rtttl/NoWay:d=4,o=5,b=120:p,8g,8p,8c6,8p,8g,8p,8a,8p,8f,8p,8e,8p,8d,8p,8c,8p,8g,8p,8c6,8p,8g');
                break;
            case "no":
                await this.cog.sendRestMessage('audio/rtttl/No:d=4,o=5,b=100:p,8c,8p,8c,8p,8c,8p,8c');
                break;
            case "whistle":
                await this.cog.sendRestMessage('audio/rtttl/Whistle:d=4,o=6,b=140:16b5,16p,16b5,16p,16b5,16p,16g,16p,16e,16p,16g,16p,16c7,16p,16c7,16p,16c7,16p,16a,16p,16f,16p,16a,16p,16d7');
                break;
            default:
                break;
        }
    }

    async playNote(note) {
        switch (note) {
            case "notec":
                await this.cog.sendRestMessage('audio/rtttl/NoteC:d=4,o=5,b=120:c');
                break;
            case "notecsharp":
                await this.cog.sendRestMessage('audio/rtttl/NoteCSharp:d=4,o=5,b=120:c#');
                break;
            case "noted":
                await this.cog.sendRestMessage('audio/rtttl/NoteD:d=4,o=5,b=120:d');
                break;
            case "notedsharp":
                await this.cog.sendRestMessage('audio/rtttl/NoteDSharp:d=4,o=5,b=120:d#');
                break;
            case "notee":
                await this.cog.sendRestMessage('audio/rtttl/NoteE:d=4,o=5,b=120:e');
                break;
            case "notef":
                await this.cog.sendRestMessage('audio/rtttl/NoteF:d=4,o=5,b=120:f');
                break;
            case "notefsharp":
                await this.cog.sendRestMessage('audio/rtttl/NoteFSharp:d=4,o=5,b=120:f#');
                break;
            case "noteg":
                await this.cog.sendRestMessage('audio/rtttl/NoteG:d=4,o=5,b=120:g');
                break;
            case "notegsharp":
                await this.cog.sendRestMessage('audio/rtttl/NoteGSharp:d=4,o=5,b=120:g#');
                break;
            case "notea":
                await this.cog.sendRestMessage('audio/rtttl/NoteA:d=4,o=5,b=120:a');
                break;
            case "noteasharp":
                await this.cog.sendRestMessage('audio/rtttl/NoteASharp:d=4,o=5,b=120:a#');
                break;
            case "noteb":
                await this.cog.sendRestMessage('audio/rtttl/NoteB:d=4,o=5,b=120:b');
                break;
            default:
                break;
        }
    }

    async setPattern(pattern) {
        switch (pattern) {
            case "patternrainbow":
                await this.cog.sendRestMessage('led//pattern/RainbowSnake');
                break;
            case "patternpinwheel":
                if (this.selectedColour) {
                    await this.cog.sendRestMessage(`led//pattern/Spin?numPix=12&mod=1&c=${this.selectedColour}`);
                } else {
                    await this.cog.sendRestMessage('led//pattern/Spin?numPix=12&mod=1');
                }
                break;
            case "patternshowoff":
                if (this.selectedColour) {
                    await this.cog.sendRestMessage(`led//pattern/Flash?c=${this.selectedColour}`);
                } else {
                    await this.cog.sendRestMessage('led//pattern/Flash?c=112233');
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
                await this.cog.sendRestMessage('led//color/ff0000');
                break;
            case "selectcolourgreen":
                this.selectedColour = "00ff00";
                await this.cog.sendRestMessage('led//color/00ff00');
                break;
            case "selectcolourblue":
                this.selectedColour = "0000ff";
                await this.cog.sendRestMessage('led//color/0000ff');
                break;
            case "selectcolourpurple":
                this.selectedColour = "800080";
                await this.cog.sendRestMessage('led//color/800080');
                break;
            case "selectcolourorange":
                this.selectedColour = "ffa500";
                await this.cog.sendRestMessage('led//color/ffa500');
                break;
            case "selectcolouryellow":
                this.selectedColour = "ffff00";
                await this.cog.sendRestMessage('led//color/ffff00');
                break;

            default:
                break;
        }
    }

    async clearColours() {
        this.selectedColour = null;
        await this.cog.sendRestMessage('led//off');
    }
}