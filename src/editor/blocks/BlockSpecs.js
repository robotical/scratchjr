import Localization from '../../utils/Localization';
import IO from '../../tablet/IO';
import { LINEAR_GRADIENT_COLOUR } from '../engine/Prims';

let loadCount = 0;

let loadassets = {};
let fontwhite = '#f2f3f2';
let fontpink = '#ff8ae9';
let fontdarkgray = '#6d6e6c';
let fontblack = '#1b2a34';
let fontyellow = '#ffdd33';
let fontdarkgreen = '#287f46';
let fontpurple = '#8f56e3';
let fontblue = '#0d50ab';
let fontred = '#c4281b';
let fontorange = '#da8540';

let fontcolors = [fontred, fontorange, fontyellow,
    fontdarkgreen, fontblue, fontpink, fontpurple,
    fontwhite, fontdarkgray, fontblack];

let fontsizes = [16, 24, 36, 48, 56, 72];

const tiltshapes = ['tiltright', 'tiltleft', 'tiltbackward', 'tiltforward', 'tiltbackwardforward', 'tiltleftright'];
const steershapes = ['steerright', 'steerleft'];
const moveshapes = ['onshake'];
const onobjectsensedshapes = ['onobjectsensedleft', 'onobjectsensedright', 'onnoobjectsensed'];
const lightshapes = ['onhighlight', 'onmidlight', 'onlowlight'];
const patternshapes = ['patternrainbow', 'patternpinwheel', 'patternshowoff'];
const colourshapes = ['selectcolourred', 'selectcolourgreen', 'selectcolourblue', 'selectcolourpurple', 'selectcolourorange', 'selectcolouryellow'];
const coloursensedshapes = ['martycoloursensedred', 'martycoloursensedgreen', 'martycoloursensedblue', 'martycoloursensedpurple', 'martycoloursensedyellow', 'martycoloursensednone'];
const martyobstaclesensedshapes = ['martyobstaclesensedobstaclesensed', 'martyobstaclesensedobstaclenotsensed'];
const martylightsensedshapes = ['martylightsensedlow', 'martylightsensedmid', 'martylightsensedhigh'];
const martynoisesensedshapes = ['martynoisesensednoisesensed', 'martynoisesensednonoisesensed'];
const noteshapes = ['notec', 'notecsharp', 'noted', 'notedsharp', 'notee', 'notef', 'notefsharp', 'noteg', 'notegsharp', 'notea', 'noteasharp', 'noteb'];
const microbitbuttonshapes = ['microbitbuttona', 'microbitbuttonb', 'microbitbuttonany'];
const microbitgestureshapes = ['microbitgesturemoved', 'microbitgestureshaken', 'microbitgesturejumped'];
const microbittiltshapes = ['microbittiltany', 'microbittiltright', 'microbittiltleft', 'microbittiltbackward', 'microbittiltforward'];
const microbitpinshapes = ['microbitpin0', 'microbitpin1', 'microbitpin2'];

let getshapes = ['LetterGet_Orange', 'LetterGet_Red', 'LetterGet_Yellow', 'LetterGet_Green',
    'LetterGet_Blue', 'LetterGet_Purple'];
let sendshapes = ['LetterSend_Orange', 'LetterSend_Red', 'LetterSend_Yellow', 'LetterSend_Green',
    'LetterSend_Blue', 'LetterSend_Purple'];

let speeds = ['speed0', 'speed1', 'speed2'];

export default class BlockSpecs {
    static get loadCount() {
        return loadCount;
    }

    static set loadCount(newLoadCount) {
        loadCount = newLoadCount;
    }

    static get fontcolors() {
        return fontcolors;
    }

    static get fontsizes() {
        return fontsizes;
    }

    static get speeds() {
        return speeds;
    }

    static palettes = [];
    static palettesCog = [];
    static palettesMarty = [];
    static palettesMicroBit = [];

    static categories = [];
    static categoriesCog = [];
    static categoriesMarty = [];
    static categoriesMicroBit = [];

    static initBlocks() {
        loadassets = new Object();
        BlockSpecs.loadGraphics();
        BlockSpecs.defs = BlockSpecs.setupBlocksSpecs();

        BlockSpecs.palettes = BlockSpecs.setupPalettesDef();
        BlockSpecs.palettesCog = BlockSpecs.setupPalettesDefCog();
        BlockSpecs.palettesMarty = BlockSpecs.setupPalettesDefMarty();
        BlockSpecs.palettesMicroBit = BlockSpecs.setupPalettesDefMicroBit();

        BlockSpecs.categories = BlockSpecs.setupCategories();
        BlockSpecs.categoriesCog = BlockSpecs.setupCategoriesCog();
        BlockSpecs.categoriesMarty = BlockSpecs.setupCategoriesMarty();
        BlockSpecs.categoriesMicroBit = BlockSpecs.setupCategoriesMicroBit();

        if (window.Settings.edition == 'PBS') {
            BlockSpecs.canvasMask = BlockSpecs.getImageFrom('assets/ui/canvasmask', 'svg');
        } else {
            BlockSpecs.canvasMask = BlockSpecs.getImageFrom('assets/ui/canvasmask');
        }
        if (window.Settings.edition != 'PBS') {
            BlockSpecs.projectThumb = BlockSpecs.getImageFrom('assets/lobby/pmask');
        }
        IO.requestFromServer('assets/balloon.svg', BlockSpecs.setBalloon);
        loadCount++;
    }

    static setBalloon(str) {
        loadCount--;
        BlockSpecs.balloon = str;
    }


    static loadGraphics() {
        BlockSpecs.mic = BlockSpecs.getImageFrom('assets/ui/recordslot', 'svg');
        BlockSpecs.yellowStart = BlockSpecs.getImageFrom('assets/blocks/start', 'svg');
        BlockSpecs.yellowStartH = BlockSpecs.getImageFrom('assets/blocks/eh/startH');

        BlockSpecs.yellowCmd = BlockSpecs.getImageFrom('assets/blocks/yellowCmd', 'svg');
        BlockSpecs.yellowCmdH = BlockSpecs.getImageFrom('assets/blocks/eh/yellowCmdH');

        BlockSpecs.redEnd = BlockSpecs.getImageFrom('assets/blocks/endshort', 'svg');
        BlockSpecs.redEndH = BlockSpecs.getImageFrom('assets/blocks/eh/stopH');

        BlockSpecs.orangeCmd = BlockSpecs.getImageFrom('assets/blocks/flow', 'svg');
        BlockSpecs.orangeCmdH = BlockSpecs.getImageFrom('assets/blocks/eh/flowH');

        BlockSpecs.limeCmd = BlockSpecs.getImageFrom('assets/blocks/sounds', 'svg');
        BlockSpecs.limeCmdH = BlockSpecs.getImageFrom('assets/blocks/eh/soundsH');

        BlockSpecs.pinkCmd = BlockSpecs.getImageFrom('assets/blocks/looks', 'svg');
        BlockSpecs.pinkCmdH = BlockSpecs.getImageFrom('assets/blocks/eh/looksH');

        BlockSpecs.redEndLong = BlockSpecs.getImageFrom('assets/blocks/endlong', 'svg');
        BlockSpecs.redEndLongH = BlockSpecs.getImageFrom('assets/blocks/eh/stoplongH');

        BlockSpecs.cShape = BlockSpecs.getImageFrom('assets/blocks/repeat');
        BlockSpecs.cShapeH = BlockSpecs.getImageFrom('assets/blocks/eh/repeatH');

        BlockSpecs.blueCmd = BlockSpecs.getImageFrom('assets/blocks/blueCmd', 'svg');
        BlockSpecs.blueCmdH = BlockSpecs.getImageFrom('assets/blocks/eh/blueCmdH');

        BlockSpecs.textfieldimg = BlockSpecs.getImageFrom('assets/misc/Text-01');
        BlockSpecs.numfieldimg = BlockSpecs.getImageFrom('assets/misc/Number-01');
        BlockSpecs.pressbutton = BlockSpecs.getImageFrom('assets/misc/pushbutton-01', 'svg');
        BlockSpecs.pressbuttonSmall = BlockSpecs.getImageFrom('assets/misc/pushbutton', 'svg');
        BlockSpecs.caretrepeat = BlockSpecs.getImageFrom('assets/blocks/caretrepeat');
        BlockSpecs.cmdS = BlockSpecs.getImageFrom('assets/blocks/shadowCmd', 'svg');
        BlockSpecs.startS = BlockSpecs.getImageFrom('assets/blocks/shadowStart', 'svg');
        BlockSpecs.endS = BlockSpecs.getImageFrom('assets/blocks/shadowEndShort', 'svg');
        BlockSpecs.endLongS = BlockSpecs.getImageFrom('assets/blocks/shadowEndLong', 'svg');
        BlockSpecs.repeatS = BlockSpecs.getImageFrom('assets/blocks/shadowRepeat');

    }

    static getImageFrom(url, ext) {
        var img = document.createElement('img');
        img.src = url + (ext ? '.' + ext : '.png');
        if (!img.complete) {
            loadassets[img.src] = img;
            loadCount++;
            img.onload = function () {
                delete loadassets[img.src];
                loadCount--;
            };
        }
        return img;
    }


    static refreshLoading() {
        for (var key in loadassets) {
            if (loadassets[key].complete) {
                loadCount--;
            }
        }
    }

    static setupCategoriesCog() {
        return new Array(
            [
                BlockSpecs.getImageFrom('assets/categories/CogStartOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/CogStartOff', 'svg'),
                window.Settings.categoryStartColor,
                'cog-start'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/CogLooksOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/CogLooksOff', 'svg'),
                window.Settings.categoryLooksColor,
                'cog-looks'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/CogSoundOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/CogSoundOff', 'svg'),
                window.Settings.categorySoundColor,
                'cog-sound'
            ],
        );
    }

    static setupCategoriesMarty() {
        return new Array(
            [
                BlockSpecs.getImageFrom('assets/categories/MartyStartOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MartyStartOff', 'svg'),
                window.Settings.categoryStartColor,
                'marty-start'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MartyMotionOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MartyMotionOff', 'svg'),
                window.Settings.categoryMotionColor,
                'marty-motion'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MartyLooksOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MartyLooksOff', 'svg'),
                window.Settings.categoryLooksColor,
                'marty-looks'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MartySoundOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MartySoundOff', 'svg'),
                window.Settings.categorySoundColor,
                'marty-sound'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MartyFlowOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MartyFlowOff', 'svg'),
                window.Settings.categoryFlowColor,
                'marty-flow'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MartyStopOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MartyStopOff', 'svg'),
                window.Settings.categoryStopColor,
                'marty-stop'
            ]
        );
    }

    static setupCategoriesMicroBit() {
        return new Array(
            [
                BlockSpecs.getImageFrom('assets/categories/MicroBitStartOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MicroBitStartOff', 'svg'),
                window.Settings.categoryStartColor,
                'microbit-start'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MicroBitLooksOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MicroBitLooksOff', 'svg'),
                window.Settings.categoryLooksColor,
                'microbit-looks'
            ]
        );
    }

    static setupCategories() {
        return new Array(
            [
                BlockSpecs.getImageFrom('assets/categories/StartOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/StartOff', 'svg'),
                window.Settings.categoryStartColor,
                'sprite-start'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/MotionOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/MotionOff', 'svg'),
                window.Settings.categoryMotionColor,
                'sprite-motion'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/LooksOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/LooksOff', 'svg'),
                window.Settings.categoryLooksColor,
                'sprite-looks'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/SoundOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/SoundOff', 'svg'),
                window.Settings.categorySoundColor,
                'sprite-sound'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/FlowOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/FlowOff', 'svg'),
                window.Settings.categoryFlowColor,
                'sprite-flow'
            ],
            [
                BlockSpecs.getImageFrom('assets/categories/StopOn', 'svg'),
                BlockSpecs.getImageFrom('assets/categories/StopOff', 'svg'),
                window.Settings.categoryStopColor,
                'sprite-stop'
            ]
        );
    }

    static setupPalettesDef() {
        return [['onflag', 'onmessage', 'message', 'onclick', 'ontouch'],
        [ 'up', 'down', 'forward', 'back', 'right', 'left', 'hop', 'home'],
        ['say', 'space', 'grow', 'shrink', 'same', 'space', 'hide', 'show'],
        [],
        ['wait', 'stopmine', 'setspeed', 'decreasecounter', 'startstopcounter', 'increasecounter', 'repeat'],
        ['endstack', 'forever']];
    }

    static setupPalettesDefCog() {
        return [['tiltany', 'onsteercog', 'ontouchcog', 'onshake', 'onobjectsensed', 'onlight'],
        ['setpattern', 'selectcolour', 'clearcolours'],
        ['confusion', 'disbelief', 'excitement', 'noway', 'no', 'whistle', 'playnote', 'waitcrotchet', 'settempo', 'setcogvolume']];
    }

    static setupPalettesDefMarty() {
        return [['onflag', 'martycoloursensed', 'martyobstaclesensed', 'martylightsensed', 'martynoisesensed', 'onmessage', 'message', 'onclick', 'ontouch'],
        ['martyGetReady', 'martyStepForward', 'martyStepBackward', 'martyStepRight', 'martyStepLeft', 'martyTurnRight', 'martyTurnLeft', 'martyDance', 'martyKickLeft', 'martyKickRight'],
        ['martyEyesExcited', 'martyEyesWide', 'martyEyesAngry', 'martyEyesNormal', 'martyEyesWiggle', 'martyWaveLeft', 'martyWaveRight', 'martyCelebrate', 'martyLedEyesP1', 'martyLedEyesP2', 'martyLedEyesColour'],
        ['martyConfusion', 'martyDisbelief', 'martyExcitement', 'martyNoway', 'martyNo', 'martyWhistle'],
        ['wait', 'stopmine', 'setspeed', 'decreasecounter', 'startstopcounter', 'increasecounter',  'repeat'],
        ['endstack', 'forever']];
    }

    static setupPalettesDefMicroBit() {
        return [
            ['microbitbuttonpressed', 'microbitgesture', 'microbitpinconnected', 'microbittilted'],
            ['microbitdisplayheart', 'microbitdisplayhappy', 'microbitdisplaytext', 'microbitdisplayclear']
        ];
    }

    ///////////////////////////////
    // Data Structure
    //
    // name - blocktype, icon or datastructure, blockshape, argtype, initial value, highlight, min, max, shadow, menu colour
    //
    // arg types:
    // null
    // n -> number field;
    // t -> text field
    // m  --> image menu with argvalue equal to name;
    // d --> image menu with argvalue equal to number;
    // c -- > color drop down
    // s --> sound name
    // p --> page icon
    //
    ////////////////////////////////

    static setupBlocksSpecs() {

        return {
            /* ScratchJr Blocks */
            'onflag': ['onflag', BlockSpecs.getImageFrom('assets/blockicons/greenFlag', 'svg'),
                BlockSpecs.yellowStart, null, null, BlockSpecs.yellowStartH, null, null, BlockSpecs.startS],
            'onmessage': ['onmessage', getshapes, BlockSpecs.yellowStart, 'm', 'Orange',
                BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'onclick': ['onclick', BlockSpecs.getImageFrom('assets/blockicons/OnTouch', 'svg'),
                BlockSpecs.yellowStart, null, null, BlockSpecs.yellowStartH, null, null, BlockSpecs.startS],
            'ontouch': ['ontouch', BlockSpecs.getImageFrom('assets/blockicons/Bump', 'svg'),
                BlockSpecs.yellowStart, null, null, BlockSpecs.yellowStartH, null, null, BlockSpecs.startS],
            'message': ['message', sendshapes, BlockSpecs.yellowCmd, 'm', 'Orange',
                BlockSpecs.yellowCmdH, null, null, BlockSpecs.cmdS, 'yellow'],

            'repeat': ['repeat', BlockSpecs.getImageFrom('assets/blockicons/Repeat', 'svg'),
                BlockSpecs.cShape, 'n', 4, BlockSpecs.cShapeH, 0, 24, BlockSpecs.repeatS],

            'forward': ['forward', BlockSpecs.getImageFrom('assets/blockicons/Foward', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, -20, 20, BlockSpecs.cmdS],
            'back': ['back', BlockSpecs.getImageFrom('assets/blockicons/Back', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, -20, 20, BlockSpecs.cmdS],
            'up': ['up', BlockSpecs.getImageFrom('assets/blockicons/Up', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, -15, 15, BlockSpecs.cmdS],
            'down': ['down', BlockSpecs.getImageFrom('assets/blockicons/Down', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, -15, 15, BlockSpecs.cmdS],
            'right': ['right', BlockSpecs.getImageFrom('assets/blockicons/Right', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, -12, 12, BlockSpecs.cmdS],
            'left': ['left', BlockSpecs.getImageFrom('assets/blockicons/Left', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, -12, 12, BlockSpecs.cmdS],
            'home': ['home', BlockSpecs.getImageFrom('assets/blockicons/Home', 'svg'),
                BlockSpecs.blueCmd, null, null, BlockSpecs.blueCmdH, null, null, BlockSpecs.cmdS],
            'hop': ['hop', BlockSpecs.getImageFrom('assets/blockicons/Hop', 'svg'),
                BlockSpecs.blueCmd, 'n', 2, BlockSpecs.blueCmdH, -15, 15, BlockSpecs.cmdS],

            'wait': ['wait', BlockSpecs.getImageFrom('assets/blockicons/Wait', 'svg'),
                BlockSpecs.orangeCmd, 'n', 10, BlockSpecs.orangeCmdH, 0, 50, BlockSpecs.cmdS],
            'setspeed': ['setspeed', speeds, BlockSpecs.orangeCmd, 'd', 1,
                BlockSpecs.orangeCmdH, null, null, BlockSpecs.cmdS],
            'stopmine': ['stopmine', BlockSpecs.getImageFrom('assets/blockicons/Stop', 'svg'),
                BlockSpecs.orangeCmd, null, null, BlockSpecs.orangeCmdH, null, null, BlockSpecs.cmdS],
            'startstopcounter': ['startstopcounter', BlockSpecs.getImageFrom('assets/blockicons/counter_start-reset', 'svg'),
                BlockSpecs.orangeCmd, null, null, BlockSpecs.orangeCmdH, null, null, BlockSpecs.cmdS],
            'increasecounter': ['increasecounter', BlockSpecs.getImageFrom('assets/blockicons/counter_increase', 'svg'),
                BlockSpecs.orangeCmd, null, null, BlockSpecs.orangeCmdH, null, null, BlockSpecs.cmdS],
            'decreasecounter': ['decreasecounter', BlockSpecs.getImageFrom('assets/blockicons/counter_decrease', 'svg'),
                BlockSpecs.orangeCmd, null, null, BlockSpecs.orangeCmdH, null, null, BlockSpecs.cmdS],

            'say': ['say', BlockSpecs.getImageFrom('assets/blockicons/Say', 'svg'),
                BlockSpecs.pinkCmd, 't',
                Localization.localize('SAY_BLOCK_DEFAULT_ARGUMENT'), BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'show': ['show', BlockSpecs.getImageFrom('assets/blockicons/Appear', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'hide': ['hide', BlockSpecs.getImageFrom('assets/blockicons/Disappear', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'grow': ['grow', BlockSpecs.getImageFrom('assets/blockicons/Grow', 'svg'),
                BlockSpecs.pinkCmd, 'n', 2, BlockSpecs.pinkCmdH, -10, 10, BlockSpecs.cmdS],
            'shrink': ['shrink', BlockSpecs.getImageFrom('assets/blockicons/Shrink', 'svg'),
                BlockSpecs.pinkCmd, 'n', 2, BlockSpecs.pinkCmdH, -10, 10, BlockSpecs.cmdS],
            'same': ['same', BlockSpecs.getImageFrom('assets/blockicons/Reset', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],

            'playsnd': ['playsnd', BlockSpecs.getImageFrom('assets/blockicons/Speaker', 'svg'),
                BlockSpecs.limeCmd, 's', 'pop.mp3', BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'playusersnd': ['playusersnd', BlockSpecs.getImageFrom('assets/blockicons/Microphone', 'svg'),
                BlockSpecs.limeCmd, 'r', '1', BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],

            'endstack': ['endstack', null, BlockSpecs.redEnd, null, null,
                BlockSpecs.redEndH, null, null, BlockSpecs.endS],
            'forever': ['forever', BlockSpecs.getImageFrom('assets/blockicons/Forever', 'svg'),
                BlockSpecs.redEnd, null, null, BlockSpecs.redEndH, null, null, BlockSpecs.endS],
            'gotopage': ['gotopage', null,
                BlockSpecs.redEndLong, 'p', '2', BlockSpecs.redEndLongH, null, null, BlockSpecs.endLongS],
            'caretstart': ['caretstart', null,
                BlockSpecs.getImageFrom('assets/blocks/caretstart', 'svg'), null, null, null, null, null],
            'caretend': ['caretend', null,
                BlockSpecs.getImageFrom('assets/blocks/caretend', 'svg'), null, null, null, null, null],
            'caretrepeat': ['caretrepeat', null,
                BlockSpecs.getImageFrom('assets/blocks/caretrepeat'), null, null, null, null, null],
            'caretcmd': ['caretcmd', null,
                BlockSpecs.getImageFrom('assets/blocks/caretcmd', 'svg'), null, null, null, null, null],

            /* Cog Blocks */
            'tiltany': ['tiltany', tiltshapes,
                BlockSpecs.yellowStart, 'm', 'tiltright', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'onsteercog': ['onsteercog', steershapes,
                BlockSpecs.yellowStart, 'm', 'steerright', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'ontouchcog': ['ontouchcog', BlockSpecs.getImageFrom('assets/blockicons/ontouchcog', 'svg'),
                BlockSpecs.yellowStart, null, null, BlockSpecs.yellowStartH, null, null, BlockSpecs.startS],
            'onshake': ['onshake', BlockSpecs.getImageFrom('assets/blockicons/onshake', 'svg'),
                BlockSpecs.yellowStart, null, null, BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'onobjectsensed': ['onobjectsensed', onobjectsensedshapes,
                BlockSpecs.yellowStart, 'm', 'onobjectsensedleft', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'onlight': ['onlight', lightshapes,
                BlockSpecs.yellowStart, 'm', 'onhighlight', BlockSpecs.yellowStartH, 0, 100, BlockSpecs.startS],
            'setpattern': ['setpattern', patternshapes,
                BlockSpecs.pinkCmd, 'm', 'patternrainbow', BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS, 'purple'],
            'clearcolours': ['clearcolours', BlockSpecs.getImageFrom('assets/blockicons/clearcolours', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'selectcolour': ['selectcolour', colourshapes,
                BlockSpecs.pinkCmd, 'm', 'selectcolourred', BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS, 'purple'],
            'confusion': ['confusion', BlockSpecs.getImageFrom('assets/blockicons/MartyConfusion', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'disbelief': ['disbelief', BlockSpecs.getImageFrom('assets/blockicons/MartyDisbelief', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'excitement': ['excitement', BlockSpecs.getImageFrom('assets/blockicons/MartyExcitment', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'noway': ['noway', BlockSpecs.getImageFrom('assets/blockicons/MartyNoWay', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'no': ['no', BlockSpecs.getImageFrom('assets/blockicons/MartyNo', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'whistle': ['whistle', BlockSpecs.getImageFrom('assets/blockicons/MartyWhistle', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'playnote': ['playnote', noteshapes,
                BlockSpecs.limeCmd, 'm', 'notec', BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS, 'green'],
            'waitcrotchet': ['waitcrotchet', BlockSpecs.getImageFrom('assets/blockicons/noterest', 'svg'),
                BlockSpecs.limeCmd, 'n', 1, BlockSpecs.limeCmdH, 1, 4, BlockSpecs.cmdS],
            'settempo': ['settempo', BlockSpecs.getImageFrom('assets/blockicons/tempo', 'svg'),
                BlockSpecs.limeCmd, 'n', 60, BlockSpecs.limeCmdH, 1, 240, BlockSpecs.cmdS],
            'setcogvolume': ['setcogvolume', BlockSpecs.getImageFrom('assets/blockicons/CogVolume', 'svg'),
                BlockSpecs.limeCmd, 'n', 100, BlockSpecs.limeCmdH, 0, 100, BlockSpecs.cmdS],

            /* micro:bit Blocks */
            'microbitbuttonpressed': ['microbitbuttonpressed', microbitbuttonshapes,
                BlockSpecs.yellowStart, 'm', 'microbitbuttona', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'microbitgesture': ['microbitgesture', microbitgestureshapes,
                BlockSpecs.yellowStart, 'm', 'microbitgestureshaken', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'microbitpinconnected': ['microbitpinconnected', microbitpinshapes,
                BlockSpecs.yellowStart, 'm', 'microbitpin0', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'microbittilted': ['microbittilted', microbittiltshapes,
                BlockSpecs.yellowStart, 'm', 'microbittiltany', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'microbitdisplayheart': ['microbitdisplayheart', BlockSpecs.getImageFrom('assets/blockicons/microbitdisplayheart', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'microbitdisplayhappy': ['microbitdisplayhappy', BlockSpecs.getImageFrom('assets/blockicons/microbitdisplayhappy', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'microbitdisplaytext': ['microbitdisplaytext', BlockSpecs.getImageFrom('assets/blockicons/microbitdisplaytext', 'svg'),
                BlockSpecs.pinkCmd, 't', 'Hi', BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'microbitdisplayclear': ['microbitdisplayclear', BlockSpecs.getImageFrom('assets/blockicons/microbitdisplayclear', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],

            /* Marty Blocks */
            'martycoloursensed': ['martycoloursensed', coloursensedshapes,
                BlockSpecs.yellowStart, 'm', 'martycoloursensedblue', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'martyobstaclesensed': ['martyobstaclesensed', martyobstaclesensedshapes,
                BlockSpecs.yellowStart, 'm', 'martyobstaclesensedobstaclesensed', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'martylightsensed': ['martylightsensed', martylightsensedshapes,
                BlockSpecs.yellowStart, 'm', 'martylightsensedlow', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'martynoisesensed': ['martynoisesensed', martynoisesensedshapes,
                BlockSpecs.yellowStart, 'm', 'martynoisesensednonoisesensed', BlockSpecs.yellowStartH, null, null, BlockSpecs.startS, 'yellow'],
            'martyGetReady': ['martyGetReady', BlockSpecs.getImageFrom('assets/blockicons/MartyGetReady', 'svg'),
                BlockSpecs.blueCmd, null, null, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyDance': ['martyDance', BlockSpecs.getImageFrom('assets/blockicons/MartyDance', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyStepForward': ['martyStepForward', BlockSpecs.getImageFrom('assets/blockicons/Up', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyStepBackward': ['martyStepBackward', BlockSpecs.getImageFrom('assets/blockicons/Down', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyStepLeft': ['martyStepLeft', BlockSpecs.getImageFrom('assets/blockicons/Back', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyStepRight': ['martyStepRight', BlockSpecs.getImageFrom('assets/blockicons/Foward', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyTurnRight': ['martyTurnRight', BlockSpecs.getImageFrom('assets/blockicons/Right', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyTurnLeft': ['martyTurnLeft', BlockSpecs.getImageFrom('assets/blockicons/Left', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 20, BlockSpecs.cmdS],
            'martyKickRight': ['martyKickRight', BlockSpecs.getImageFrom('assets/blockicons/MartyKickRight', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 10, BlockSpecs.cmdS],
            'martyKickLeft': ['martyKickLeft', BlockSpecs.getImageFrom('assets/blockicons/MartyKickLeft', 'svg'),
                BlockSpecs.blueCmd, 'n', 1, BlockSpecs.blueCmdH, 1, 10, BlockSpecs.cmdS],

            'martyEyesExcited': ['martyEyesExcited', BlockSpecs.getImageFrom('assets/blockicons/MartyExcited', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyEyesWide': ['martyEyesWide', BlockSpecs.getImageFrom('assets/blockicons/MartyWide', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyEyesAngry': ['martyEyesAngry', BlockSpecs.getImageFrom('assets/blockicons/MartyAngry', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyEyesNormal': ['martyEyesNormal', BlockSpecs.getImageFrom('assets/blockicons/MartyNormal', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyEyesWiggle': ['martyEyesWiggle', BlockSpecs.getImageFrom('assets/blockicons/MartyWiggle', 'svg'),
                BlockSpecs.pinkCmd, 'n', 1, BlockSpecs.pinkCmdH, 1, 10, BlockSpecs.cmdS],
            'martyWaveLeft': ['martyWaveLeft', BlockSpecs.getImageFrom('assets/blockicons/MartyWaveLeft', 'svg'),
                BlockSpecs.pinkCmd, 'n', 1, BlockSpecs.pinkCmdH, 1, 10, BlockSpecs.cmdS],
            'martyWaveRight': ['martyWaveRight', BlockSpecs.getImageFrom('assets/blockicons/MartyWaveRight', 'svg'),
                BlockSpecs.pinkCmd, 'n', 1, BlockSpecs.pinkCmdH, 1, 10, BlockSpecs.cmdS],
            'martyCelebrate': ['martyCelebrate', BlockSpecs.getImageFrom('assets/blockicons/MartyCelebrate', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyLedEyesP1': ['martyLedEyesP1', BlockSpecs.getImageFrom('assets/blockicons/MartyLedEyesP1', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyLedEyesP2': ['martyLedEyesP2', BlockSpecs.getImageFrom('assets/blockicons/MartyLedEyesP2', 'svg'),
                BlockSpecs.pinkCmd, null, null, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],
            'martyLedEyesColour': ['martyLedEyesColour', BlockSpecs.getImageFrom('assets/blockicons/MartyEyesColour', 'svg'),
                BlockSpecs.pinkCmd, 'c', LINEAR_GRADIENT_COLOUR, BlockSpecs.pinkCmdH, null, null, BlockSpecs.cmdS],

            'martyConfusion': ['martyConfusion', BlockSpecs.getImageFrom('assets/blockicons/MartyConfusion', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'martyDisbelief': ['martyDisbelief', BlockSpecs.getImageFrom('assets/blockicons/MartyDisbelief', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'martyExcitement': ['martyExcitement', BlockSpecs.getImageFrom('assets/blockicons/MartyExcitment', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'martyNoway': ['martyNoway', BlockSpecs.getImageFrom('assets/blockicons/MartyNoWay', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'martyNo': ['martyNo', BlockSpecs.getImageFrom('assets/blockicons/MartyNo', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
            'martyWhistle': ['martyWhistle', BlockSpecs.getImageFrom('assets/blockicons/MartyWhistle', 'svg'),
                BlockSpecs.limeCmd, null, null, BlockSpecs.limeCmdH, null, null, BlockSpecs.cmdS],
        };
    }

    static blockDesc(b, spr) {
        var str = b.getArgValue() ? b.getArgValue().toString() : (b.blocktype == 'playsnd') ? 'SOUND' : '';

        return {
            'onflag': Localization.localize('BLOCK_DESC_GREEN_FLAG'),
            'martycoloursensed': Localization.localize('BLOCK_DESC_MARTY_ON_COLOUR_SENSED'),
            'martyobstaclesensed': Localization.localize('BLOCK_DESC_MARTY_ON_OBSTACLE_SENSED'),
            'martylightsensed': Localization.localize('BLOCK_DESC_MARTY_ON_LIGHT_SENSED'),
            'martynoisesensed': Localization.localize('BLOCK_DESC_MARTY_ON_NOISE_SENSED'),
            'tiltany': Localization.localize('BLOCK_DESC_ON_TILT'),
            'onsteercog': Localization.localize('BLOCK_DESC_ON_STEER'),
            'ontouchcog': Localization.localize('BLOCK_DESC_ON_TOUCH_Cog'),
            'onshake': Localization.localize('BLOCK_DESC_ON_MOVE'),
            'onobjectsensed': Localization.localize('BLOCK_DESC_ON_OBJECT_SENSED'),
            'onlight': Localization.localize('BLOCK_DESC_ON_LIGHT'),
            'microbitbuttonpressed': Localization.localize('BLOCK_DESC_MICROBIT_ON_BUTTON'),
            'microbitgesture': Localization.localize('BLOCK_DESC_MICROBIT_ON_GESTURE'),
            'microbitpinconnected': Localization.localize('BLOCK_DESC_MICROBIT_ON_PIN'),
            'microbittilted': Localization.localize('BLOCK_DESC_MICROBIT_ON_TILT'),
            'onclick': Localization.localize('BLOCK_DESC_ON_TAP', {
                CHARACTER_NAME: spr.name
            }),
            'ontouch': Localization.localize('BLOCK_DESC_ON_BUMP', {
                CHARACTER_NAME: spr.name ? spr.name : ''
            }),
            'onmessage': Localization.localize('BLOCK_DESC_ON_MESSAGE', {
                COLOR: Localization.localize('BLOCK_DESC_MESSAGE_COLOR_ORANGE')
            }),
            'repeat': Localization.localize('BLOCK_DESC_REPEAT'),
            'forward': Localization.localize('BLOCK_DESC_MOVE_RIGHT'),
            'back': Localization.localize('BLOCK_DESC_MOVE_LEFT'),
            'up': Localization.localize('BLOCK_DESC_MOVE_UP'),
            'down': Localization.localize('BLOCK_DESC_MOVE_DOWN'),
            'home': Localization.localize('BLOCK_DESC_GO_HOME'),
            'left': Localization.localize('BLOCK_DESC_TURN_LEFT'),
            'right': Localization.localize('BLOCK_DESC_TURN_RIGHT'),
            'hop': Localization.localize('BLOCK_DESC_HOP'),
            'wait': Localization.localize('BLOCK_DESC_WAIT'),
            'setspeed': Localization.localize('BLOCK_DESC_SET_SPEED'),
            'stopmine': Localization.localize('BLOCK_DESC_STOP', {
                CHARACTER_NAME: spr.name ? spr.name : spr.str
            }),
            'startstopcounter': Localization.localize('BLOCK_DESC_START_STOP_COUNTER'),
            'increasecounter': Localization.localize('BLOCK_DESC_INCREASE_COUNTER'),
            'decreasecounter': Localization.localize('BLOCK_DESC_DECREASE_COUNTER'),
            'setpattern': Localization.localize('BLOCK_DESC_SET_PATTERN'),
            'clearcolours': Localization.localize('BLOCK_DESC_CLEAR_COLOURS'),
            'selectcolour': Localization.localize('BLOCK_DESC_SELECT_COLOUR'),
            'say': Localization.localize('BLOCK_DESC_SAY'),
            'show': Localization.localize('BLOCK_DESC_SHOW'),
            'hide': Localization.localize('BLOCK_DESC_HIDE'),
            'grow': Localization.localize('BLOCK_DESC_GROW'),
            'shrink': Localization.localize('BLOCK_DESC_SHRINK'),
            'same': Localization.localize('BLOCK_DESC_RESET_SIZE'),
            'confusion': Localization.localize('BLOCK_PLAY_CONFUSION_SOUND'),
            'disbelief': Localization.localize('BLOCK_PLAY_DISBELIEF_SOUND'),
            'excitement': Localization.localize('BLOCK_PLAY_EXCITEMENT_SOUND'),
            'noway': Localization.localize('BLOCK_PLAY_NOWAY_SOUND'),
            'no': Localization.localize('BLOCK_PLAY_NO_SOUND'),
            'whistle': Localization.localize('BLOCK_PLAY_WHISTLE_SOUND'),
            'playnote': Localization.localize('BLOCK_PLAY_NOTE'),
            'waitcrotchet': Localization.localize('BLOCK_DESC_WAIT_CROTCHET'),
            'settempo': Localization.localize('BLOCK_DESC_SET_TEMPO'),
            'setcogvolume': Localization.localize('BLOCK_DESC_SET_COG_VOLUME'),
            'microbitdisplayheart': Localization.localize('BLOCK_DESC_MICROBIT_DISPLAY_HEART'),
            'microbitdisplayhappy': Localization.localize('BLOCK_DESC_MICROBIT_DISPLAY_HAPPY'),
            'microbitdisplaytext': Localization.localize('BLOCK_DESC_MICROBIT_DISPLAY_TEXT'),
            'microbitdisplayclear': Localization.localize('BLOCK_DESC_MICROBIT_CLEAR_DISPLAY'),
            'pop': Localization.localize('BLOCK_PLAY_POP_SOUND'),
            'endstack': Localization.localize('BLOCK_DESC_END'),
            'stopall': Localization.localize('BLOCK_DESC_STOP', {
                CHARACTER_NAME: spr.name ? spr.name : ''
            }),
            'forever': Localization.localize('BLOCK_DESC_REPEAT_FOREVER'),
            'gotopage': Localization.localize('BLOCK_DESC_GO_TO_PAGE', {
                PAGE: str
            }),
            'message': Localization.localize('BLOCK_DESC_SEND_MESSAGE', {
                COLOR: Localization.localize('BLOCK_DESC_MESSAGE_COLOR_ORANGE')
            }),

            'martyGetReady': Localization.localize('BLOCK_DESC_MOVE_MARTY_GETREADY'),
            'martyDance': Localization.localize('BLOCK_DESC_MOVE_MARTY_DANCE'),
            'martyStepRight': Localization.localize('BLOCK_DESC_MOVE_MARTY_RIGHT'),
            'martyStepLeft': Localization.localize('BLOCK_DESC_MOVE_MARTY_LEFT'),
            'martyStepForward': Localization.localize('BLOCK_DESC_MOVE_MARTY_UP'),
            'martyStepBackward': Localization.localize('BLOCK_DESC_MOVE_MARTY_DOWN'),
            'martyHome': Localization.localize('BLOCK_DESC_GO_MARTY_HOME'),
            'martyTurnLeft': Localization.localize('BLOCK_DESC_TURN_MARTY_LEFT'),
            'martyTurnRight': Localization.localize('BLOCK_DESC_TURN_MARTY_RIGHT'),
            'martyKickLeft': Localization.localize('BLOCK_KICK_MARTY_LEFT'),
            'martyKickRight': Localization.localize('BLOCK_KICK_MARTY_RIGHT'),
            'martyEyesExcited': Localization.localize('BLOCK_EYES_MARTY_EXCITED'),
            'martyEyesWide': Localization.localize('BLOCK_EYES_MARTY_WIDE'),
            'martyEyesAngry': Localization.localize('BLOCK_EYES_MARTY_ANGRY'),
            'martyEyesNormal': Localization.localize('BLOCK_EYES_MARTY_NORMAL'),
            'martyEyesWiggle': Localization.localize('BLOCK_EYES_MARTY_WIGGLE'),
            'martyWaveLeft': Localization.localize('BLOCK_WAVE_MARTY_LEFT'),
            'martyWaveRight': Localization.localize('BLOCK_WAVE_MARTY_RIGHT'),
            'martyLedEyesP1': Localization.localize('BLOCK_LED_MARTY_EYES_P1'),
            'martyLedEyesP2': Localization.localize('BLOCK_LED_MARTY_EYES_P2'),
            'martyLedEyesColour': Localization.localize('BLOCK_LED_MARTY_EYES_COLOUR'),
            'martyCelebrate': Localization.localize('BLOCK_MARTY_CELEBRATE'),

            'martyConfusion': Localization.localize('BLOCK_PLAY_MARTY_CONFUSION_SOUND'),
            'martyDisbelief': Localization.localize('BLOCK_PLAY_MARTY_DISBELIEF_SOUND'),
            'martyExcitement': Localization.localize('BLOCK_PLAY_MARTY_EXCITEMENT_SOUND'),
            'martyNoway': Localization.localize('BLOCK_PLAY_MARTY_NOWAY_SOUND'),
            'martyNo': Localization.localize('BLOCK_PLAY_MARTY_NO_SOUND'),
            'martyWhistle': Localization.localize('BLOCK_PLAY_MARTY_WHISTLE_SOUND'),
        };
    }
}
