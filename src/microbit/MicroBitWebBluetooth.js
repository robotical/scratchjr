const BLECommand = {
    CMD_DISPLAY_TEXT: 0x81,
    CMD_DISPLAY_LED: 0x82
};

const BLEUUID = {
    service: 0xf005,
    rxChar: '5261da01-fa7e-42ab-850b-7c80220097cc',
    txChar: '5261da02-fa7e-42ab-850b-7c80220097cc'
};

const BLE_DATA_TIMEOUT_MS = 4500;
const BLE_BUSY_TIMEOUT_MS = 5000;

export function isMicroBitWebBluetoothSupported () {
    return typeof navigator !== 'undefined' &&
        navigator.bluetooth &&
        typeof navigator.bluetooth.requestDevice === 'function';
}

function signed16 (high, low) {
    let value = low | (high << 8);
    if (value >= (1 << 15)) {
        value -= (1 << 16);
    }
    return value;
}

function copySensors (sensors) {
    return {
        tiltX: sensors.tiltX,
        tiltY: sensors.tiltY,
        buttonA: sensors.buttonA,
        buttonB: sensors.buttonB,
        touchPins: sensors.touchPins.slice(),
        gestureState: sensors.gestureState
    };
}

export default class MicroBitWebBluetooth {
    constructor () {
        this.id = null;
        this.name = 'micro:bit';
        this.deviceType = 'micro:bit';
        this.isMicroBitWebBluetooth = true;

        this.device = null;
        this.server = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;

        this.sensors = MicroBitWebBluetooth.defaultSensors();
        this.ledMatrixState = new Uint8Array(5);

        this.sensorListeners = new Set();
        this.disconnectListeners = new Set();
        this.receiveTimeoutId = null;
        this.busy = false;
        this.busyTimeoutId = null;
        this.didEmitDisconnect = false;

        this.handleCharacteristicValueChanged = this.handleCharacteristicValueChanged.bind(this);
        this.handleGattServerDisconnected = this.handleGattServerDisconnected.bind(this);
    }

    static defaultSensors () {
        return {
            tiltX: 0,
            tiltY: 0,
            buttonA: 0,
            buttonB: 0,
            touchPins: [0, 0, 0],
            gestureState: 0
        };
    }

    async connect () {
        if (!isMicroBitWebBluetoothSupported()) {
            throw new Error('Web Bluetooth is not available in this browser.');
        }

        this.device = await navigator.bluetooth.requestDevice({
            filters: [
                {services: [BLEUUID.service]}
            ]
        });
        this.id = this.device.id || `microbit-${Date.now()}`;
        this.name = this.device.name || 'micro:bit';
        this.didEmitDisconnect = false;

        this.device.addEventListener('gattserverdisconnected', this.handleGattServerDisconnected);
        this.server = await this.device.gatt.connect();
        const service = await this.server.getPrimaryService(BLEUUID.service);
        this.rxCharacteristic = await service.getCharacteristic(BLEUUID.rxChar);
        this.txCharacteristic = await service.getCharacteristic(BLEUUID.txChar);

        this.rxCharacteristic.addEventListener(
            'characteristicvaluechanged',
            this.handleCharacteristicValueChanged
        );
        await this.rxCharacteristic.startNotifications();

        try {
            const value = await this.rxCharacteristic.readValue();
            this.handleSensorData(value);
        } catch (error) {
            // Some micro:bit firmware starts with notifications before reads are available.
        }

        this.resetReceiveTimeout();
        return this;
    }

    disconnect () {
        this.clearReceiveTimeout();
        this.clearBusyTimeout();
        this.busy = false;

        if (this.rxCharacteristic) {
            this.rxCharacteristic.removeEventListener(
                'characteristicvaluechanged',
                this.handleCharacteristicValueChanged
            );
            try {
                const stopNotifications = this.rxCharacteristic.stopNotifications();
                if (stopNotifications && typeof stopNotifications.catch === 'function') {
                    stopNotifications.catch(() => {});
                }
            } catch (error) {
                // Ignore cleanup errors from an already-disconnected device.
            }
        }

        if (this.device) {
            this.device.removeEventListener('gattserverdisconnected', this.handleGattServerDisconnected);
        }

        if (this.server && this.server.connected) {
            this.server.disconnect();
        }

        this.server = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.emitDisconnect();
    }

    isConnected () {
        return !!(this.server && this.server.connected);
    }

    getFriendlyName () {
        return this.name || 'micro:bit';
    }

    getBatteryStrength () {
        return null;
    }

    getRSSI () {
        return null;
    }

    addSensorListener (callback) {
        this.sensorListeners.add(callback);
        return () => this.removeSensorListener(callback);
    }

    removeSensorListener (callback) {
        this.sensorListeners.delete(callback);
    }

    addDisconnectListener (callback) {
        this.disconnectListeners.add(callback);
        return () => this.removeDisconnectListener(callback);
    }

    removeDisconnectListener (callback) {
        this.disconnectListeners.delete(callback);
    }

    displayText (text) {
        const safeText = String(text || '').substring(0, 19);
        const output = new Uint8Array(safeText.length);
        for (let i = 0; i < safeText.length; i++) {
            output[i] = safeText.charCodeAt(i);
        }
        return this.send(BLECommand.CMD_DISPLAY_TEXT, output);
    }

    displayMatrix (matrix) {
        this.ledMatrixState = new Uint8Array(matrix);
        return this.send(BLECommand.CMD_DISPLAY_LED, this.ledMatrixState);
    }

    clearDisplay () {
        this.ledMatrixState = new Uint8Array(5);
        return this.displayMatrix(this.ledMatrixState);
    }

    async send (command, message) {
        if (!this.isConnected() || !this.txCharacteristic || this.busy) {
            return false;
        }

        this.busy = true;
        this.busyTimeoutId = window.setTimeout(() => {
            this.busy = false;
        }, BLE_BUSY_TIMEOUT_MS);

        const output = new Uint8Array(message.length + 1);
        output[0] = command;
        for (let i = 0; i < message.length; i++) {
            output[i + 1] = message[i];
        }

        try {
            if (this.txCharacteristic.writeValueWithResponse) {
                await this.txCharacteristic.writeValueWithResponse(output);
            } else {
                await this.txCharacteristic.writeValue(output);
            }
            return true;
        } finally {
            this.busy = false;
            this.clearBusyTimeout();
        }
    }

    handleCharacteristicValueChanged (event) {
        this.handleSensorData(event.target.value);
    }

    handleSensorData (value) {
        if (!value || value.byteLength < 10) {
            return;
        }

        const data = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
        const previous = copySensors(this.sensors);
        this.sensors = {
            tiltX: signed16(data[0], data[1]),
            tiltY: signed16(data[2], data[3]),
            buttonA: data[4],
            buttonB: data[5],
            touchPins: [data[6], data[7], data[8]],
            gestureState: data[9]
        };

        this.sensorListeners.forEach(callback => callback(this.sensors, previous));
        this.resetReceiveTimeout();
    }

    resetReceiveTimeout () {
        this.clearReceiveTimeout();
        this.receiveTimeoutId = window.setTimeout(() => {
            this.disconnect();
        }, BLE_DATA_TIMEOUT_MS);
    }

    clearReceiveTimeout () {
        if (this.receiveTimeoutId) {
            window.clearTimeout(this.receiveTimeoutId);
            this.receiveTimeoutId = null;
        }
    }

    clearBusyTimeout () {
        if (this.busyTimeoutId) {
            window.clearTimeout(this.busyTimeoutId);
            this.busyTimeoutId = null;
        }
    }

    handleGattServerDisconnected () {
        this.clearReceiveTimeout();
        this.clearBusyTimeout();
        this.busy = false;
        if (this.rxCharacteristic) {
            this.rxCharacteristic.removeEventListener(
                'characteristicvaluechanged',
                this.handleCharacteristicValueChanged
            );
        }
        if (this.device) {
            this.device.removeEventListener('gattserverdisconnected', this.handleGattServerDisconnected);
        }
        this.server = null;
        this.rxCharacteristic = null;
        this.txCharacteristic = null;
        this.emitDisconnect();
    }

    emitDisconnect () {
        if (this.didEmitDisconnect) {
            return;
        }
        this.didEmitDisconnect = true;
        this.disconnectListeners.forEach(callback => callback(this));
    }
}
