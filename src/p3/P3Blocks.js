import P3vm from "./P3vm";

export default class P3Blocks extends P3vm {
    static instance = null;

    isP3Connected = false;

    static getInstance() {
        if (P3Blocks.instance == null) {
            P3Blocks.instance = new P3Blocks();
        }
        return P3Blocks.instance;
    }
    constructor() {
        super();
    }
    async playSound(sound) {
        switch (sound) {
            case "disbelief":
                await this.sendRICRESTMsg('audio/rtttl/Disbelief:d=4,o=5,b=120:g,8d#,8e,8f,8f#,8g,8a,8b,8c6,8p,8c6,8b,8a,8g,8f#,8e,8f,8d#,8p,8g');
                break;
            case "confusion":
                await this.sendRICRESTMsg('audio/rtttl/Confused:d=4,o=5,b=120:c,e,g,c6,e6,g6,c,e,g,c6,e6,g6,c,e,g,a,a,b,b,c6');
                break;
            case "excitement":
                await this.sendRICRESTMsg('audio/rtttl/Excitement:d=4,o=5,b=180:c,e,g,8c6,16p,8c6,16p,8c6,16p,c,e,g,8c6,16p,8c6,16p,8c6,16p,c,e,g,8c6');
                break;
            case "noway":
                await this.sendRICRESTMsg('audio/rtttl/NoWay:d=4,o=5,b=120:p,8g,8p,8c6,8p,8g,8p,8a,8p,8f,8p,8e,8p,8d,8p,8c,8p,8g,8p,8c6,8p,8g');
                break;
            case "no":
                await this.sendRICRESTMsg('audio/rtttl/No:d=4,o=5,b=100:p,8c,8p,8c,8p,8c,8p,8c');
                break;
            case "whistle":
                await this.sendRICRESTMsg('audio/rtttl/Whistle:d=4,o=6,b=140:16b5,16p,16b5,16p,16b5,16p,16g,16p,16e,16p,16g,16p,16c7,16p,16c7,16p,16c7,16p,16a,16p,16f,16p,16a,16p,16d7');
                break;
            default:
                break;
        }
    }

    async playNote(note) {
        switch (note) {
            case "notec":
                await this.sendRICRESTMsg('audio/rtttl/NoteC:d=4,o=5,b=120:c');
                break;
            case "notecsharp":
                await this.sendRICRESTMsg('audio/rtttl/NoteCSharp:d=4,o=5,b=120:c#');
                break;
            case "noted":
                await this.sendRICRESTMsg('audio/rtttl/NoteD:d=4,o=5,b=120:d');
                break;
            case "notedsharp":
                await this.sendRICRESTMsg('audio/rtttl/NoteDSharp:d=4,o=5,b=120:d#');
                break;
            case "notee":
                await this.sendRICRESTMsg('audio/rtttl/NoteE:d=4,o=5,b=120:e');
                break;
            case "notef":
                await this.sendRICRESTMsg('audio/rtttl/NoteF:d=4,o=5,b=120:f');
                break;
            case "notefsharp":
                await this.sendRICRESTMsg('audio/rtttl/NoteFSharp:d=4,o=5,b=120:f#');
                break;
            case "noteg":
                await this.sendRICRESTMsg('audio/rtttl/NoteG:d=4,o=5,b=120:g');
                break;
            case "notegsharp":
                await this.sendRICRESTMsg('audio/rtttl/NoteGSharp:d=4,o=5,b=120:g#');
                break;
            case "notea":
                await this.sendRICRESTMsg('audio/rtttl/NoteA:d=4,o=5,b=120:a');
                break;
            case "noteasharp":
                await this.sendRICRESTMsg('audio/rtttl/NoteASharp:d=4,o=5,b=120:a#');
                break;
            case "noteb":
                await this.sendRICRESTMsg('audio/rtttl/NoteB:d=4,o=5,b=120:b');
                break;
            default:
                break;
        }
    }

    async setPattern(pattern) {
        switch (pattern) {
            case "patternrainbow":
                await this.sendRICRESTMsg('led//pattern/RainbowSnake');
                break;
            case "patternpinwheel":
                await this.sendRICRESTMsg('led//pattern/Spin?numPix=12&mod=1');
                break;
            case "patternshowoff":
                await this.sendRICRESTMsg('led//pattern/Flash?c=112233');
                break;

            default:
                break;
        }
    }

    async selectColour(colour) {
        switch (colour) {
            case "selectcolourred":
                await this.sendRICRESTMsg('led//color/ff0000');
                break;
            case "selectcolourgreen":
                await this.sendRICRESTMsg('led//color/00ff00');
                break;
            case "selectcolourblue":
                await this.sendRICRESTMsg('led//color/0000ff');
                break;
            case "selectcolourpurple":
                await this.sendRICRESTMsg('led//color/800080');
                break;
            case "selectcolourorange":
                await this.sendRICRESTMsg('led//color/ffa500');
                break;
            case "selectcolouryellow":
                await this.sendRICRESTMsg('led//color/ffff00');
                break;

            default:
                break;
        }
    }

    async clearColours() {
        await this.sendRICRESTMsg('led//off');
    }
}

window.P3Blocks = P3Blocks;