import Prims from '../editor/engine/Prims';

const TILT_THRESHOLD = 15;

const BUTTON_EVENTS = [
    {event: 'microbitbuttona', currentKey: 'buttonA'},
    {event: 'microbitbuttonb', currentKey: 'buttonB'}
];

const GESTURE_EVENTS = [
    {event: 'microbitgesturemoved', bit: 2},
    {event: 'microbitgestureshaken', bit: 0},
    {event: 'microbitgesturejumped', bit: 1}
];

const PIN_EVENTS = [
    {event: 'microbitpin0', index: 0},
    {event: 'microbitpin1', index: 1},
    {event: 'microbitpin2', index: 2}
];

const SYMBOLS = {
    microbitdisplayheart: [
        '01010',
        '11111',
        '11111',
        '01110',
        '00100'
    ],
    microbitdisplayhappy: [
        '00000',
        '01010',
        '00000',
        '10001',
        '01110'
    ]
};

function bitIsSet (value, bit) {
    return ((value >> bit) & 1) === 1;
}

function getTiltAngle (sensors, direction) {
    switch (direction) {
    case 'tiltforward':
        return Math.round(sensors.tiltY / -10);
    case 'tiltbackward':
        return Math.round(sensors.tiltY / 10);
    case 'tiltleft':
        return Math.round(sensors.tiltX / -10);
    case 'tiltright':
        return Math.round(sensors.tiltX / 10);
    default:
        return 0;
    }
}

function sensorIsOn (value) {
    return Number(value) !== 0;
}

function rowsToMatrix (rows) {
    const matrix = new Uint8Array(5);
    for (let row = 0; row < rows.length; row++) {
        let value = 0;
        for (let col = 0; col < rows[row].length; col++) {
            if (rows[row][col] !== '0') {
                value += Math.pow(2, col);
            }
        }
        matrix[row] = value;
    }
    return matrix;
}

export default class MicroBitBlocks {
    constructor (microBit) {
        this.microBit = microBit;
        this.unsubscribeSensorListener = null;

        this.handleSensorUpdate = this.handleSensorUpdate.bind(this);
        if (this.microBit && typeof this.microBit.addSensorListener === 'function') {
            this.unsubscribeSensorListener = this.microBit.addSensorListener(this.handleSensorUpdate);
        }
    }

    destroy () {
        if (this.unsubscribeSensorListener) {
            this.unsubscribeSensorListener();
            this.unsubscribeSensorListener = null;
        }
        this.microBit = null;
    }

    isConnected () {
        return !!(this.microBit && (
            typeof this.microBit.isConnected !== 'function' ||
            this.microBit.isConnected()
        ));
    }

    displayText (text) {
        if (!this.isConnected() || typeof this.microBit.displayText !== 'function') {
            return;
        }
        this.microBit.displayText(text);
    }

    displaySymbol (symbol) {
        if (!this.isConnected() || typeof this.microBit.displayMatrix !== 'function') {
            return;
        }
        const rows = SYMBOLS[symbol];
        if (!rows) {
            return;
        }
        this.microBit.displayMatrix(rowsToMatrix(rows));
    }

    clearDisplay () {
        if (!this.isConnected() || typeof this.microBit.clearDisplay !== 'function') {
            return;
        }
        this.microBit.clearDisplay();
    }

    getSensors () {
        return (this.microBit && this.microBit.sensors) || {
            tiltX: 0,
            tiltY: 0,
            buttonA: 0,
            buttonB: 0,
            touchPins: [0, 0, 0],
            gestureState: 0
        };
    }

    handleSensorUpdate (current, previous) {
        this.emitButtonEvents(current, previous);
        this.emitGestureEvents(current, previous);
        this.emitPinEvents(current, previous);
        this.emitTiltEvents(current);
    }

    emitButtonEvents (current, previous) {
        BUTTON_EVENTS.forEach(({event, currentKey}) => {
            const isPressed = sensorIsOn(current[currentKey]);
            const wasPressed = sensorIsOn(previous[currentKey]);
            if (isPressed && !wasPressed) {
                Prims.OnMicroBitEvent(event);
                Prims.OnMicroBitEvent('microbitbuttonany');
            }
        });
    }

    emitPinEvents (current, previous) {
        PIN_EVENTS.forEach(({event, index}) => {
            const isConnected = sensorIsOn((current.touchPins || [])[index]);
            const wasConnected = sensorIsOn((previous.touchPins || [])[index]);
            if (isConnected && !wasConnected) {
                Prims.OnMicroBitEvent(event);
            }
        });
    }

    emitGestureEvents (current, previous) {
        GESTURE_EVENTS.forEach(({event, bit}) => {
            if (bitIsSet(current.gestureState, bit) && !bitIsSet(previous.gestureState, bit)) {
                Prims.OnMicroBitEvent(event);
            }
        });
    }

    emitTiltEvents (current) {
        const currentEvents = MicroBitBlocks.getTiltEvents(current);
        currentEvents.forEach(event => {
            Prims.OnMicroBitEvent(event);
        });
    }

    static getTiltEvents (sensors) {
        const events = new Set();
        const left = getTiltAngle(sensors, 'tiltleft') >= TILT_THRESHOLD;
        const right = getTiltAngle(sensors, 'tiltright') >= TILT_THRESHOLD;
        const forward = getTiltAngle(sensors, 'tiltforward') >= TILT_THRESHOLD;
        const backward = getTiltAngle(sensors, 'tiltbackward') >= TILT_THRESHOLD;

        if (left || right || forward || backward) {
            events.add('microbittiltany');
        }
        if (left) {
            events.add('microbittiltleft');
        }
        if (right) {
            events.add('microbittiltright');
        }
        if (forward) {
            events.add('microbittiltforward');
        }
        if (backward) {
            events.add('microbittiltbackward');
        }
        return events;
    }
}
