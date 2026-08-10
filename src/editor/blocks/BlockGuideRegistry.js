import {
    COG_PALETTES,
    MARTY_PALETTES,
    MICROBIT_PALETTES,
    SPRITE_PALETTES,
    clonePalettes
} from './BlockPaletteRegistry';
import {MICROBIT_DEFAULT_TILT_OPTION} from '../../microbit/MicroBitBlockOptions';

const ICON_ROOT = '../assets/blockicons/';

function block (titleKey, title, descriptionKey, description, icon, options = {}) {
    return {
        titleKey,
        title,
        descriptionKey,
        description,
        icon: icon ? ICON_ROOT + icon + '.svg' : null,
        symbol: options.symbol || null,
        noteKey: options.noteKey || null,
        note: options.note || null
    };
}

export const BLOCK_GUIDE_METADATA = {
    onflag: block('BLOCKS_GREEN_FLAG', 'Start on Green Flag', 'BLOCKS_GREEN_FLAG_DESCRIPTION',
        'Starts the script when the Green Flag is tapped.', 'greenFlag'),
    onmessage: block('BLOCKS_ON_MESSAGE', 'Start on Message', 'BLOCKS_ON_MESSAGE_DESCRIPTION',
        'Starts the script when a message of the selected colour is sent.', 'LetterGet_Orange'),
    message: block('BLOCKS_SEND_MESSAGE', 'Send Message', 'BLOCKS_SEND_MESSAGE_DESCRIPTION',
        'Sends a message in the selected colour to start matching scripts.', 'LetterSend_Orange'),
    wait: block('BLOCKS_WAIT', 'Wait', 'BLOCK_GUIDE_WAIT_DESCRIPTION',
        'Pauses this script for the chosen number of seconds.', 'Wait'),
    stopmine: block('BLOCKS_STOP', 'Stop', 'BLOCK_GUIDE_STOP_DESCRIPTION',
        'Stops the other running scripts for the same character or Marty.', 'Stop'),
    setspeed: block('BLOCKS_SET_SPEED', 'Set Speed', 'BLOCKS_SET_SPEED_DESCRIPTION',
        'Changes how quickly motion, looks, and control blocks run.', 'speed1'),
    decreasecounter: block('BLOCK_DESC_DECREASE_COUNTER', 'Decrease Counter',
        'BLOCK_GUIDE_DECREASE_COUNTER_DESCRIPTION',
        'Decreases the on-screen counter by one, creating it at −1 if needed.', 'counter_decrease'),
    startstopcounter: block('BLOCK_DESC_START_STOP_COUNTER', 'Start/Stop Counter',
        'BLOCK_GUIDE_START_STOP_COUNTER_DESCRIPTION',
        'Shows the counter at 0, or hides it when it is already showing 0.', 'counter_start-reset'),
    increasecounter: block('BLOCK_DESC_INCREASE_COUNTER', 'Increase Counter',
        'BLOCK_GUIDE_INCREASE_COUNTER_DESCRIPTION',
        'Increases the on-screen counter by one, creating it at 1 if needed.', 'counter_increase'),
    repeat: block('BLOCKS_REPEAT', 'Repeat', 'BLOCKS_REPEAT_DESCRIPTION',
        'Runs the blocks inside it the chosen number of times.', 'Repeat'),
    endstack: block('BLOCKS_END', 'End', 'BLOCKS_END_DESCRIPTION',
        'Marks the end of a script.', null, {symbol: '■'}),
    forever: block('BLOCKS_REPEAT_FOREVER', 'Repeat Forever', 'BLOCKS_REPEAT_FOREVER_DESCRIPTION',
        'Runs the script again and again.', 'Forever'),
    gotopage: block('BLOCKS_GO_TO_PAGE', 'Go to Page', 'BLOCKS_GO_TO_PAGE_DESCRIPTION',
        'Changes to the selected page of the project.', null, {
            symbol: '2',
            noteKey: 'BLOCK_GUIDE_MULTIPLE_PAGES_NOTE',
            note: 'Appears when the project has more than one page.'
        }),

    onclick: block('BLOCKS_ON_TAP', 'Start on Tap', 'BLOCKS_ON_TAP_DESCRIPTION',
        'Starts the script when this character is tapped.', 'OnTouch'),
    ontouch: block('BLOCKS_ON_TOUCH', 'Start on Bump', 'BLOCKS_ON_TOUCH_DESCRIPTION',
        'Starts the script when this character touches another character.', 'Bump'),
    up: block('BLOCK_DESC_MOVE_UP', 'Move Up', 'BLOCK_GUIDE_MOVE_UP_DESCRIPTION',
        'Moves the character up by the chosen number of grid squares.', 'Up'),
    down: block('BLOCK_DESC_MOVE_DOWN', 'Move Down', 'BLOCK_GUIDE_MOVE_DOWN_DESCRIPTION',
        'Moves the character down by the chosen number of grid squares.', 'Down'),
    forward: block('BLOCKS_MOVE_RIGHT', 'Move Right', 'BLOCKS_MOVE_RIGHT_DESCRIPTION',
        'Moves the character right by the chosen number of grid squares.', 'Foward'),
    back: block('BLOCKS_MOVE_LEFT', 'Move Left', 'BLOCKS_MOVE_LEFT_DESCRIPTION',
        'Moves the character left by the chosen number of grid squares.', 'Back'),
    right: block('BLOCKS_TURN_RIGHT', 'Turn Right', 'BLOCKS_TURN_RIGHT_DESCRIPTION',
        'Turns the character clockwise. A value of 12 makes one full turn.', 'Right'),
    left: block('BLOCKS_TURN_LEFT', 'Turn Left', 'BLOCKS_TURN_LEFT_DESCRIPTION',
        'Turns the character anticlockwise. A value of 12 makes one full turn.', 'Left'),
    hop: block('BLOCKS_HOP', 'Hop', 'BLOCKS_HOP_DESCRIPTION',
        'Moves the character up and then down again.', 'Hop'),
    home: block('BLOCKS_GO_HOME', 'Go Home', 'BLOCKS_GO_HOME_DESCRIPTION',
        'Returns the character to its starting position.', 'Home'),
    say: block('BLOCKS_SAY', 'Say', 'BLOCKS_SAY_DESCRIPTION',
        'Shows the chosen text in a speech bubble above the character.', 'Say'),
    grow: block('BLOCKS_GROW', 'Grow', 'BLOCKS_GROW_DESCRIPTION',
        'Makes the character larger.', 'Grow'),
    shrink: block('BLOCKS_SHRINK', 'Shrink', 'BLOCKS_SHRINK_DESCRIPTION',
        'Makes the character smaller.', 'Shrink'),
    same: block('BLOCKS_RESET_SIZE', 'Reset Size', 'BLOCKS_RESET_SIZE_DESCRIPTION',
        'Returns the character to its original size.', 'Reset'),
    hide: block('BLOCKS_HIDE', 'Hide', 'BLOCKS_HIDE_DESCRIPTION',
        'Fades the character out until it is hidden.', 'Disappear'),
    show: block('BLOCKS_SHOW', 'Show', 'BLOCKS_SHOW_DESCRIPTION',
        'Fades the character in until it is visible.', 'Appear'),
    playsnd: block('BLOCK_GUIDE_PLAY_SOUND', 'Play Sound', 'BLOCK_GUIDE_PLAY_SOUND_DESCRIPTION',
        'Plays a sound from this character’s sound list.', 'Speaker', {
            noteKey: 'BLOCK_GUIDE_SOUND_LIST_NOTE',
            note: 'The available blocks follow the sounds saved to the character.'
        }),
    playusersnd: block('BLOCKS_PLAY_RECORDED', 'Play Recorded Sound', 'BLOCKS_PLAY_RECORDED_DESCRIPTION',
        'Plays a sound recorded for this character.', 'Microphone', {
            noteKey: 'BLOCK_GUIDE_RECORDED_SOUND_NOTE',
            note: 'Appears after a sound has been recorded.'
        }),

    martycoloursensed: block('BLOCK_DESC_MARTY_ON_COLOUR_SENSED', 'Start on Colour Sensed',
        'BLOCK_DESC_MARTY_ON_COLOUR_SENSED_DESCRIPTION',
        'Starts when Marty senses the selected colour, or no colour.', 'martycoloursensedblue'),
    martyobstaclesensed: block('BLOCK_DESC_MARTY_ON_OBSTACLE_SENSED', 'Start on Obstacle Sensed',
        'BLOCK_DESC_MARTY_ON_OBSTACLE_SENSED_DESCRIPTION',
        'Starts when Marty senses whether an obstacle is in front.', 'martyobstaclesensedobstaclesensed'),
    martylightsensed: block('BLOCK_DESC_MARTY_ON_LIGHT_SENSED', 'Start on Light Sensed',
        'BLOCK_DESC_MARTY_ON_LIGHT_SENSED_DESCRIPTION',
        'Starts when Marty senses the selected low, middle, or high light level.', 'martylightsensedhigh', {
            noteKey: 'BLOCK_GUIDE_SUPPORTED_MARTY_NOTE',
            note: 'Shown when the connected Marty supports this sensor.'
        }),
    martynoisesensed: block('BLOCK_DESC_MARTY_ON_NOISE_SENSED', 'Start on Noise Sensed',
        'BLOCK_DESC_MARTY_ON_NOISE_SENSED_DESCRIPTION',
        'Starts when Marty senses noise or no noise.', 'martynoisesensednoisesensed', {
            noteKey: 'BLOCK_GUIDE_SUPPORTED_MARTY_NOTE',
            note: 'Shown when the connected Marty supports this sensor.'
        }),
    martyGetReady: block('BLOCK_DESC_MOVE_MARTY_GETREADY', 'Get Ready', 'BLOCK_GUIDE_MARTY_GET_READY_DESCRIPTION',
        'Moves Marty into a balanced ready position.', 'MartyGetReady'),
    martyStepForward: block('BLOCK_DESC_MOVE_MARTY_FORWARD', 'Move Forward',
        'BLOCK_GUIDE_MARTY_FORWARD_DESCRIPTION', 'Moves Marty forward by the chosen number of steps.', 'Up'),
    martyStepBackward: block('BLOCK_DESC_MOVE_MARTY_BACK', 'Move Backward',
        'BLOCK_GUIDE_MARTY_BACKWARD_DESCRIPTION', 'Moves Marty backward by the chosen number of steps.', 'Down'),
    martyStepRight: block('BLOCK_DESC_MOVE_MARTY_RIGHT', 'Move Right', 'BLOCK_GUIDE_MARTY_RIGHT_DESCRIPTION',
        'Moves Marty sideways to the right by the chosen number of steps.', 'Foward'),
    martyStepLeft: block('BLOCK_DESC_MOVE_MARTY_LEFT', 'Move Left', 'BLOCK_GUIDE_MARTY_LEFT_DESCRIPTION',
        'Moves Marty sideways to the left by the chosen number of steps.', 'Back'),
    martyTurnRight: block('BLOCK_DESC_TURN_MARTY_RIGHT', 'Turn Right', 'BLOCK_GUIDE_MARTY_TURN_RIGHT_DESCRIPTION',
        'Turns Marty right by 10 degrees for each count.', 'Right'),
    martyTurnLeft: block('BLOCK_DESC_TURN_MARTY_LEFT', 'Turn Left', 'BLOCK_GUIDE_MARTY_TURN_LEFT_DESCRIPTION',
        'Turns Marty left by 10 degrees for each count.', 'Left'),
    martyDance: block('BLOCK_DESC_MOVE_MARTY_DANCE', 'Dance', 'BLOCK_GUIDE_MARTY_DANCE_DESCRIPTION',
        'Makes Marty perform a dance the chosen number of times.', 'MartyDance'),
    martyKickLeft: block('BLOCK_KICK_MARTY_LEFT', 'Kick Left', 'BLOCK_GUIDE_MARTY_KICK_LEFT_DESCRIPTION',
        'Makes Marty kick with the left foot the chosen number of times.', 'MartyKickLeft'),
    martyKickRight: block('BLOCK_KICK_MARTY_RIGHT', 'Kick Right', 'BLOCK_GUIDE_MARTY_KICK_RIGHT_DESCRIPTION',
        'Makes Marty kick with the right foot the chosen number of times.', 'MartyKickRight'),
    martyEyesExcited: block('BLOCK_EYES_MARTY_EXCITED', 'Eyes Excited', 'BLOCK_GUIDE_MARTY_EYES_EXCITED_DESCRIPTION',
        'Moves Marty’s eyebrows into an excited expression.', 'MartyExcited'),
    martyEyesWide: block('BLOCK_EYES_MARTY_WIDE', 'Eyes Wide', 'BLOCK_GUIDE_MARTY_EYES_WIDE_DESCRIPTION',
        'Moves Marty’s eyebrows into a wide-eyed expression.', 'MartyWide'),
    martyEyesAngry: block('BLOCK_EYES_MARTY_ANGRY', 'Eyes Angry', 'BLOCK_GUIDE_MARTY_EYES_ANGRY_DESCRIPTION',
        'Moves Marty’s eyebrows into an angry expression.', 'MartyAngry'),
    martyEyesNormal: block('BLOCK_EYES_MARTY_NORMAL', 'Eyes Normal', 'BLOCK_GUIDE_MARTY_EYES_NORMAL_DESCRIPTION',
        'Returns Marty’s eyebrows to their normal position.', 'MartyNormal'),
    martyEyesWiggle: block('BLOCK_EYES_MARTY_WIGGLE', 'Eyes Wiggle', 'BLOCK_GUIDE_MARTY_EYES_WIGGLE_DESCRIPTION',
        'Wiggles Marty’s eyebrows the chosen number of times.', 'MartyWiggle'),
    martyWaveLeft: block('BLOCK_WAVE_MARTY_LEFT', 'Wave Left', 'BLOCK_GUIDE_MARTY_WAVE_LEFT_DESCRIPTION',
        'Makes Marty wave the left arm the chosen number of times.', 'MartyWaveLeft'),
    martyWaveRight: block('BLOCK_WAVE_MARTY_RIGHT', 'Wave Right', 'BLOCK_GUIDE_MARTY_WAVE_RIGHT_DESCRIPTION',
        'Makes Marty wave the right arm the chosen number of times.', 'MartyWaveRight'),
    martyCelebrate: block('BLOCK_MARTY_CELEBRATE', 'Celebrate', 'BLOCK_GUIDE_MARTY_CELEBRATE_DESCRIPTION',
        'Makes Marty perform a celebration movement.', 'MartyCelebrate'),
    martyLedEyesP1: block('BLOCK_LED_MARTY_EYES_P1', 'Rainbow', 'BLOCK_GUIDE_MARTY_RAINBOW_DESCRIPTION',
        'Runs a rainbow pattern on Marty’s LEDs.', 'MartyLedEyesP1'),
    martyLedEyesP2: block('BLOCK_LED_MARTY_EYES_P2', 'Pinwheel', 'BLOCK_GUIDE_MARTY_PINWHEEL_DESCRIPTION',
        'Runs a pinwheel pattern on Marty’s LEDs.', 'MartyLedEyesP2'),
    martyLedEyesColour: block('BLOCK_LED_MARTY_EYES_COLOUR', 'LED Eyes Colour',
        'BLOCK_GUIDE_MARTY_LED_COLOUR_DESCRIPTION', 'Lights Marty’s LEDs in the selected colour.', 'MartyEyesColour'),
    martyConfusion: block('BLOCK_PLAY_MARTY_CONFUSION_SOUND', 'Play Confusion Sound',
        'BLOCK_PLAY_CONFUSION_SOUND_DESCRIPTION', 'Plays the Confusion sound through Marty.', 'MartyConfusion'),
    martyDisbelief: block('BLOCK_PLAY_MARTY_DISBELIEF_SOUND', 'Play Disbelief Sound',
        'BLOCK_PLAY_DISBELIEF_SOUND_DESCRIPTION', 'Plays the Disbelief sound through Marty.', 'MartyDisbelief'),
    martyExcitement: block('BLOCK_PLAY_MARTY_EXCITEMENT_SOUND', 'Play Excitement Sound',
        'BLOCK_PLAY_EXCITEMENT_SOUND_DESCRIPTION', 'Plays the Excitement sound through Marty.', 'MartyExcitment'),
    martyNoway: block('BLOCK_PLAY_MARTY_NOWAY_SOUND', 'Play No Way Sound',
        'BLOCK_PLAY_NOWAY_SOUND_DESCRIPTION', 'Plays the No Way sound through Marty.', 'MartyNoWay'),
    martyNo: block('BLOCK_PLAY_MARTY_NO_SOUND', 'Play No Sound',
        'BLOCK_PLAY_NO_SOUND_DESCRIPTION', 'Plays the No sound through Marty.', 'MartyNo'),
    martyWhistle: block('BLOCK_PLAY_MARTY_WHISTLE_SOUND', 'Play Whistle Sound',
        'BLOCK_PLAY_WHISTLE_SOUND_DESCRIPTION', 'Plays the Whistle sound through Marty.', 'MartyWhistle'),

    tiltany: block('BLOCKS_ON_TILT', 'Start on Tilt', 'BLOCKS_ON_TILT_DESCRIPTION',
        'Starts when Cog is tilted right, left, forward, backward, side-to-side, or front-to-back.', 'tilt_any'),
    onsteercog: block('BLOCK_DESC_ON_STEER', 'Start on Steer', 'BLOCKS_ON_STEER_COG_DESCRIPTION',
        'Starts when Cog is steered left or right.', 'steerleft'),
    ontouchcog: block('BLOCKS_ON_TOUCH_Cog', 'Start on Button Press', 'BLOCKS_ON_TOUCH_Cog_DESCRIPTION',
        'Starts when Cog’s button is pressed.', 'ontouchcog'),
    onshake: block('BLOCKS_ON_MOVE', 'Start on Move', 'BLOCKS_ON_MOVE_DESCRIPTION',
        'Starts when Cog is shaken or moved.', 'onshake'),
    onobjectsensed: block('BLOCK_DESC_ON_OBJECT_SENSED', 'Start on Object Sensed',
        'BLOCK_GUIDE_COG_OBJECT_DESCRIPTION', 'Starts when Cog senses an object on the left, right, or neither side.',
        'onobjectsensedleft'),
    onlight: block('BLOCK_DESC_ON_LIGHT', 'Start on Light', 'BLOCK_GUIDE_COG_LIGHT_DESCRIPTION',
        'Starts when Cog senses the selected low, middle, or high light level.', 'onhighlight'),
    setpattern: block('BLOCKS_SET_PATTERN', 'Set Pattern', 'BLOCK_GUIDE_COG_PATTERN_DESCRIPTION',
        'Runs the selected rainbow, pinwheel, or show-off pattern on Cog’s light ring.', 'patternrainbow'),
    selectcolour: block('BLOCKS_SELECT_COLOUR', 'Select Colour', 'BLOCK_GUIDE_COG_COLOUR_DESCRIPTION',
        'Sets Cog’s light ring to the selected colour and uses it for compatible patterns.', 'selectcolourred'),
    clearcolours: block('BLOCK_DESC_CLEAR_COLOURS', 'Clear Colours', 'BLOCK_GUIDE_COG_CLEAR_DESCRIPTION',
        'Turns off Cog’s light ring and clears the selected colour.', 'clearcolours'),
    confusion: block('BLOCK_PLAY_CONFUSION_SOUND', 'Play Confusion Sound', 'BLOCK_GUIDE_COG_CONFUSION_DESCRIPTION',
        'Plays the Confusion tune through Cog.', 'MartyConfusion'),
    disbelief: block('BLOCK_PLAY_DISBELIEF_SOUND', 'Play Disbelief Sound', 'BLOCK_GUIDE_COG_DISBELIEF_DESCRIPTION',
        'Plays the Disbelief tune through Cog.', 'MartyDisbelief'),
    excitement: block('BLOCK_PLAY_EXCITEMENT_SOUND', 'Play Excitement Sound', 'BLOCK_GUIDE_COG_EXCITEMENT_DESCRIPTION',
        'Plays the Excitement tune through Cog.', 'MartyExcitment'),
    noway: block('BLOCK_PLAY_NOWAY_SOUND', 'Play No Way Sound', 'BLOCK_GUIDE_COG_NOWAY_DESCRIPTION',
        'Plays the No Way tune through Cog.', 'MartyNoWay'),
    no: block('BLOCK_PLAY_NO_SOUND', 'Play No Sound', 'BLOCK_GUIDE_COG_NO_DESCRIPTION',
        'Plays the No tune through Cog.', 'MartyNo'),
    whistle: block('BLOCK_PLAY_WHISTLE_SOUND', 'Play Whistle Sound', 'BLOCK_GUIDE_COG_WHISTLE_DESCRIPTION',
        'Plays the Whistle tune through Cog.', 'MartyWhistle'),
    playnote: block('BLOCK_PLAY_NOTE', 'Play Note', 'BLOCK_GUIDE_COG_NOTE_DESCRIPTION',
        'Plays the selected musical note through Cog.', 'notec'),
    waitcrotchet: block('BLOCK_DESC_WAIT_CROTCHET', 'Rest for Beats', 'BLOCK_DESC_WAIT_CROTCHET_DESCRIPTION',
        'Pauses the script for the selected number of musical beats.', 'noterest'),
    settempo: block('BLOCK_DESC_SET_TEMPO', 'Set Tempo', 'BLOCK_DESC_SET_TEMPO_DESCRIPTION',
        'Changes the tempo used by Cog’s notes, tunes, and rests.', 'tempo'),
    setcogvolume: block('BLOCK_DESC_SET_COG_VOLUME', 'Set Cog Volume', 'BLOCK_DESC_SET_COG_VOLUME_DESCRIPTION',
        'Sets Cog’s sound volume to the chosen percentage.', 'CogVolume'),

    microbitbuttonpressed: block('BLOCK_GUIDE_MICROBIT_BUTTON', 'Start on Button Press',
        'BLOCK_GUIDE_MICROBIT_BUTTON_DESCRIPTION', 'Starts when micro:bit button A, B, or A+B is pressed.',
        'microbitbuttona'),
    microbitonmove: block('BLOCK_GUIDE_MICROBIT_MOVE', 'Start on Move',
        'BLOCK_GUIDE_MICROBIT_MOVE_DESCRIPTION', 'Starts when the micro:bit detects movement.',
        'microbitgesturemoved'),
    microbittilted: block('BLOCK_GUIDE_MICROBIT_TILT', 'Start on Tilt',
        'BLOCK_GUIDE_MICROBIT_TILT_DESCRIPTION', 'Starts when the micro:bit is tilted in the selected direction.',
        MICROBIT_DEFAULT_TILT_OPTION),
    microbitdisplayheart: block('BLOCK_GUIDE_MICROBIT_HEART', 'Display Heart',
        'BLOCK_DESC_MICROBIT_DISPLAY_HEART', 'Shows a heart on the micro:bit display.', 'microbitdisplayheart'),
    microbitdisplayhappy: block('BLOCK_GUIDE_MICROBIT_HAPPY', 'Display Happy Face',
        'BLOCK_DESC_MICROBIT_DISPLAY_HAPPY', 'Shows a happy face on the micro:bit display.', 'microbitdisplayhappy'),
    microbitdisplaycustom: block('BLOCK_GUIDE_MICROBIT_CUSTOM', 'Display Custom Pattern',
        'BLOCK_DESC_MICROBIT_DISPLAY_CUSTOM', 'Shows a custom 5×5 pattern on the micro:bit display.', null,
        {symbol: '▦'}),
    microbitdisplaytext: block('BLOCK_GUIDE_MICROBIT_TEXT', 'Display Text',
        'BLOCK_DESC_MICROBIT_DISPLAY_TEXT', 'Scrolls the chosen text across the micro:bit display.',
        'microbitdisplaytext'),
    microbitdisplayclear: block('BLOCK_GUIDE_MICROBIT_CLEAR', 'Clear Display',
        'BLOCK_DESC_MICROBIT_CLEAR_DISPLAY', 'Clears every LED on the micro:bit display.', 'microbitdisplayclear')
};

const CATEGORY_SETS = {
    sprite: [
        ['start', 'BLOCKS_TRIGGERING_BLOCKS', 'Triggering Blocks'],
        ['motion', 'BLOCKS_MOTION_BLOCKS', 'Motion Blocks'],
        ['looks', 'BLOCKS_LOOKS_BLOCKS', 'Looks Blocks'],
        ['sound', 'BLOCKS_SOUND_BLOCKS', 'Sound Blocks'],
        ['control', 'BLOCKS_CONTROL_BLOCKS', 'Control Blocks'],
        ['end', 'BLOCKS_END_BLOCKS', 'End Blocks']
    ],
    marty: [
        ['start', 'BLOCKS_TRIGGERING_BLOCKS', 'Triggering Blocks'],
        ['motion', 'BLOCKS_MOTION_BLOCKS', 'Motion Blocks'],
        ['looks', 'BLOCKS_LOOKS_BLOCKS', 'Looks Blocks'],
        ['sound', 'BLOCKS_SOUND_BLOCKS', 'Sound Blocks'],
        ['control', 'BLOCKS_CONTROL_BLOCKS', 'Control Blocks'],
        ['end', 'BLOCKS_END_BLOCKS', 'End Blocks']
    ],
    cog: [
        ['start', 'BLOCKS_TRIGGERING_BLOCKS', 'Triggering Blocks'],
        ['looks', 'BLOCK_GUIDE_LIGHT_BLOCKS', 'Light Blocks'],
        ['sound', 'BLOCK_GUIDE_SOUND_MUSIC_BLOCKS', 'Sound & Music Blocks']
    ],
    microbit: [
        ['start', 'BLOCKS_TRIGGERING_BLOCKS', 'Triggering Blocks'],
        ['looks', 'BLOCK_GUIDE_DISPLAY_BLOCKS', 'Display Blocks']
    ]
};

function addDynamicBlocks (mode, palettes) {
    const result = clonePalettes(palettes);
    if (mode === 'sprite') {
        result[3] = ['playsnd', 'playusersnd'];
        result[5].push('gotopage');
    }
    if (mode === 'marty') {
        result[5].push('gotopage');
    }
    return result;
}

function resolveBlock (blockId) {
    return {
        id: blockId,
        ...(BLOCK_GUIDE_METADATA[blockId] || {
            title: blockId,
            description: 'Documentation for this block is being prepared.',
            symbol: '?'
        })
    };
}

function buildCategories (mode, palettes) {
    return CATEGORY_SETS[mode].map((category, index) => ({
        id: category[0],
        titleKey: category[1],
        title: category[2],
        blocks: palettes[index].filter((blockId) => blockId !== 'space').map(resolveBlock)
    }));
}

function buildMode (id, titleKey, title, descriptionKey, description, palettes) {
    const categories = buildCategories(id, addDynamicBlocks(id, palettes));
    return {
        id,
        titleKey,
        title,
        descriptionKey,
        description,
        categories,
        blockCount: categories.reduce((total, category) => total + category.blocks.length, 0)
    };
}

export const BLOCK_GUIDE_MODES = [
    buildMode('marty', 'BLOCK_GUIDE_MARTY_MODE', 'Marty Mode Blocks', 'BLOCK_GUIDE_MARTY_MODE_DESCRIPTION',
        'The complete left-hand palette shown when Marty Mode is on.', MARTY_PALETTES),
    buildMode('sprite', 'BLOCK_GUIDE_SPRITE_MODE', 'Sprite Blocks', 'BLOCK_GUIDE_SPRITE_MODE_DESCRIPTION',
        'The complete left-hand palette for coding characters on the stage.', SPRITE_PALETTES),
    buildMode('cog', 'BLOCK_GUIDE_COG_MODE', 'Cog Blocks', 'BLOCK_GUIDE_COG_MODE_DESCRIPTION',
        'The right-hand Cog palette, available alongside Sprite or Marty Mode.', COG_PALETTES)
];

const extensionCategories = buildCategories('microbit', clonePalettes(MICROBIT_PALETTES));

export const BLOCK_GUIDE_EXTENSION = {
    id: 'microbit',
    titleKey: 'BLOCK_GUIDE_OPTIONAL_EXTENSIONS',
    title: 'Optional Extensions',
    nameKey: 'BLOCK_GUIDE_MICROBIT_EXTENSION',
    name: 'micro:bit Extension',
    descriptionKey: 'BLOCK_GUIDE_MICROBIT_EXTENSION_DESCRIPTION',
    description: 'These blocks appear on the right when the micro:bit extension is enabled.',
    categories: extensionCategories,
    blockCount: extensionCategories.reduce((total, category) => total + category.blocks.length, 0)
};

export function getDocumentedBlockIds () {
    const ids = [];
    BLOCK_GUIDE_MODES.forEach((mode) => {
        mode.categories.forEach((category) => category.blocks.forEach((item) => ids.push(item.id)));
    });
    BLOCK_GUIDE_EXTENSION.categories.forEach((category) => {
        category.blocks.forEach((item) => ids.push(item.id));
    });
    return ids;
}
