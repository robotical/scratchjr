import Prims from '../editor/engine/Prims';
import {microBitMatrixPatternToMatrix} from './MicroBitMatrixPattern';

const TILT_THRESHOLD = 15;
const BUTTON_COMBO_WINDOW_MS = 120;
const BUTTON_A_EVENT = 'microbitbuttona';
const BUTTON_B_EVENT = 'microbitbuttonb';
const BUTTON_COMBO_EVENT = 'microbitbuttonab';

const GESTURE_EVENTS = [
    {event: 'microbitgesturemoved', bit: 2},
    {event: 'microbitgestureshaken', bit: 0},
    {event: 'microbitgesturejumped', bit: 1}
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
        this.pendingButtonEvents = {};
        this.buttonComboActive = false;

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
        this.clearPendingButtonEvents();
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

    displayPattern (pattern) {
        if (!this.isConnected() || typeof this.microBit.displayMatrix !== 'function') {
            return;
        }
        this.microBit.displayMatrix(microBitMatrixPatternToMatrix(pattern));
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
        this.emitTiltEvents(current);
    }

    emitButtonEvents (current, previous) {
        const buttonAPressed = sensorIsOn(current.buttonA);
        const buttonBPressed = sensorIsOn(current.buttonB);
        const buttonAWasPressed = sensorIsOn(previous.buttonA);
        const buttonBWasPressed = sensorIsOn(previous.buttonB);
        const buttonARising = buttonAPressed && !buttonAWasPressed;
        const buttonBRising = buttonBPressed && !buttonBWasPressed;

        if (!buttonAPressed || !buttonBPressed) {
            this.buttonComboActive = false;
        }

        if (buttonAPressed && buttonBPressed && (buttonARising || buttonBRising || !this.buttonComboActive)) {
            this.emitButtonComboEvent();
            return;
        }

        if (buttonARising) {
            this.scheduleButtonEvent(BUTTON_A_EVENT);
        }
        if (buttonBRising) {
            this.scheduleButtonEvent(BUTTON_B_EVENT);
        }
        if (!buttonAPressed) {
            this.clearPendingButtonEvent(BUTTON_A_EVENT);
        }
        if (!buttonBPressed) {
            this.clearPendingButtonEvent(BUTTON_B_EVENT);
        }
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

    scheduleButtonEvent (event) {
        this.clearPendingButtonEvent(event);
        this.pendingButtonEvents[event] = setTimeout(() => {
            delete this.pendingButtonEvents[event];
            Prims.OnMicroBitEvent(event);
        }, BUTTON_COMBO_WINDOW_MS);
    }

    emitButtonComboEvent () {
        this.clearPendingButtonEvents();
        if (this.buttonComboActive) {
            return;
        }
        this.buttonComboActive = true;
        Prims.OnMicroBitEvent(BUTTON_COMBO_EVENT);
    }

    clearPendingButtonEvent (event) {
        const timeoutId = this.pendingButtonEvents[event];
        if (!timeoutId) {
            return;
        }
        clearTimeout(timeoutId);
        delete this.pendingButtonEvents[event];
    }

    clearPendingButtonEvents () {
        Object.keys(this.pendingButtonEvents).forEach(event => this.clearPendingButtonEvent(event));
    }
}
