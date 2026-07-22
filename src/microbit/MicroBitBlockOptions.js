export const MICROBIT_LEGACY_TILT_ANY_OPTION = 'microbittiltany';

export const MICROBIT_TILT_OPTIONS = [
    'microbittiltright',
    'microbittiltleft',
    'microbittiltbackward',
    'microbittiltforward'
];

export const MICROBIT_DEFAULT_TILT_OPTION = MICROBIT_TILT_OPTIONS[0];

export function resolveMicroBitTiltIcon (value, availableOptions) {
    if (value === MICROBIT_LEGACY_TILT_ANY_OPTION || value === 'tilt_any') {
        return MICROBIT_LEGACY_TILT_ANY_OPTION;
    }
    return availableOptions.find(option => option.indexOf(value) > -1) || availableOptions[0];
}
