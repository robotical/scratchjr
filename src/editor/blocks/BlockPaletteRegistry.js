export const SPRITE_PALETTES = [
    ['onflag', 'onmessage', 'message', 'onclick', 'ontouch'],
    ['up', 'down', 'forward', 'back', 'right', 'left', 'hop', 'home'],
    ['say', 'space', 'grow', 'shrink', 'same', 'space', 'hide', 'show'],
    [],
    ['wait', 'stopmine', 'setspeed', 'decreasecounter', 'startstopcounter', 'increasecounter', 'repeat'],
    ['endstack', 'forever']
];

export const COG_PALETTES = [
    ['tiltany', 'onsteercog', 'ontouchcog', 'onshake', 'onobjectsensed', 'onlight'],
    ['setpattern', 'selectcolour', 'clearcolours'],
    ['confusion', 'disbelief', 'excitement', 'noway', 'no', 'whistle', 'playnote', 'waitcrotchet',
        'settempo', 'setcogvolume']
];

export const MARTY_PALETTES = [
    ['onflag', 'martycoloursensed', 'martyobstaclesensed', 'martylightsensed', 'martynoisesensed',
        'onmessage', 'message'],
    ['martyGetReady', 'martyStepForward', 'martyStepBackward', 'martyStepRight', 'martyStepLeft',
        'martyTurnRight', 'martyTurnLeft', 'martyDance', 'martyKickLeft', 'martyKickRight'],
    ['martyEyesExcited', 'martyEyesWide', 'martyEyesAngry', 'martyEyesNormal', 'martyEyesWiggle',
        'martyWaveLeft', 'martyWaveRight', 'martyCelebrate', 'martyLedEyesP1', 'martyLedEyesP2',
        'martyLedEyesColour'],
    ['martyConfusion', 'martyDisbelief', 'martyExcitement', 'martyNoway', 'martyNo', 'martyWhistle'],
    ['wait', 'stopmine', 'setspeed', 'decreasecounter', 'startstopcounter', 'increasecounter', 'repeat'],
    ['endstack', 'forever']
];

export const MICROBIT_PALETTES = [
    ['microbitbuttonpressed', 'microbittilted'],
    ['microbitdisplayheart', 'microbitdisplayhappy', 'microbitdisplaycustom', 'microbitdisplaytext',
        'microbitdisplayclear']
];

export function clonePalettes (palettes) {
    return palettes.map((category) => category.slice());
}
