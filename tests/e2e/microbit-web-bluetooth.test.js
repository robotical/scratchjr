import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MicroBitWebBluetooth from '@/microbit/MicroBitWebBluetooth.js';

describe('MicroBitWebBluetooth', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubGlobal('window', {
            setTimeout,
            clearTimeout
        });
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('parses incoming sensor packets using the Scratch micro:bit protocol layout', () => {
        const microBit = new MicroBitWebBluetooth();
        const listener = vi.fn();
        microBit.addSensorListener(listener);

        microBit.handleSensorData(new DataView(Uint8Array.from([
            0xff, 0x38, // tiltX: -200
            0x00, 0xc8, // tiltY: 200
            1, 0, // button A/B
            1, 0, 1, // touch pins 0/1/2
            5 // moved + shaken gesture bits
        ]).buffer));

        expect(microBit.sensors).toEqual({
            tiltX: -200,
            tiltY: 200,
            buttonA: 1,
            buttonB: 0,
            touchPins: [1, 0, 1],
            gestureState: 5
        });
        expect(listener).toHaveBeenCalledWith(
            microBit.sensors,
            {
                tiltX: 0,
                tiltY: 0,
                buttonA: 0,
                buttonB: 0,
                touchPins: [0, 0, 0],
                gestureState: 0
            }
        );
        expect(microBit.receiveTimeoutId).not.toBe(null);
    });

    it('sends display commands with the expected command byte prefix', async () => {
        const microBit = new MicroBitWebBluetooth();
        const writeValueWithResponse = vi.fn(() => Promise.resolve());
        microBit.server = {connected: true};
        microBit.txCharacteristic = {writeValueWithResponse};

        const result = microBit.displayMatrix(new Uint8Array([10, 31, 31, 14, 4]));

        expect(microBit.busy).toBe(true);
        await expect(result).resolves.toBe(true);
        expect(writeValueWithResponse).toHaveBeenCalledWith(new Uint8Array([0x82, 10, 31, 31, 14, 4]));
        expect(microBit.busy).toBe(false);
        expect(microBit.busyTimeoutId).toBe(null);
    });

    it('cleans up direct disconnects without leaking rejected stopNotifications calls', async () => {
        const microBit = new MicroBitWebBluetooth();
        const disconnectListener = vi.fn();
        const removeEventListener = vi.fn();
        const stopNotifications = vi.fn(() => Promise.reject(new Error('already disconnected')));
        microBit.addDisconnectListener(disconnectListener);
        microBit.device = {removeEventListener};
        microBit.server = {
            connected: true,
            disconnect: vi.fn()
        };
        microBit.rxCharacteristic = {
            removeEventListener,
            stopNotifications
        };
        microBit.txCharacteristic = {};
        microBit.resetReceiveTimeout();

        microBit.disconnect();
        await Promise.resolve();

        expect(stopNotifications).toHaveBeenCalled();
        expect(microBit.server).toBe(null);
        expect(microBit.rxCharacteristic).toBe(null);
        expect(microBit.txCharacteristic).toBe(null);
        expect(microBit.receiveTimeoutId).toBe(null);
        expect(disconnectListener).toHaveBeenCalledTimes(1);
    });

    it('cleans timers and listeners immediately when the browser reports a GATT disconnect', () => {
        const microBit = new MicroBitWebBluetooth();
        const disconnectListener = vi.fn();
        const removeRxListener = vi.fn();
        const removeDeviceListener = vi.fn();
        microBit.addDisconnectListener(disconnectListener);
        microBit.device = {removeEventListener: removeDeviceListener};
        microBit.server = {connected: false};
        microBit.rxCharacteristic = {removeEventListener: removeRxListener};
        microBit.txCharacteristic = {};
        microBit.resetReceiveTimeout();
        microBit.busy = true;
        microBit.busyTimeoutId = window.setTimeout(() => {}, 5000);

        microBit.handleGattServerDisconnected();
        vi.advanceTimersByTime(5000);

        expect(removeRxListener).toHaveBeenCalledWith(
            'characteristicvaluechanged',
            microBit.handleCharacteristicValueChanged
        );
        expect(removeDeviceListener).toHaveBeenCalledWith(
            'gattserverdisconnected',
            microBit.handleGattServerDisconnected
        );
        expect(microBit.server).toBe(null);
        expect(microBit.rxCharacteristic).toBe(null);
        expect(microBit.txCharacteristic).toBe(null);
        expect(microBit.receiveTimeoutId).toBe(null);
        expect(microBit.busyTimeoutId).toBe(null);
        expect(microBit.busy).toBe(false);
        expect(disconnectListener).toHaveBeenCalledTimes(1);
    });
});
