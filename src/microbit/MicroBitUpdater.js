import {
    isUniversalHex,
    separateUniversalHex
} from '@microbit/microbit-universal-hex';
import {DAPLink, WebUSB} from 'dapjs';

import microBitHexUrl from './MicroBitHex';

const DeviceVersion = {
    V1: 'V1',
    V2: 'V2'
};

const MICROBIT_VENDOR_ID = 0x0d28;
const MICROBIT_PRODUCT_ID = 0x0204;

function getDeviceVersion (device) {
    const serialNumber = device && device.serialNumber ? device.serialNumber : '';
    const boardId = serialNumber.substring(0, 4);
    switch (boardId) {
        case '9900':
        case '9901':
            return DeviceVersion.V1;
        case '9903':
        case '9904':
        case '9905':
        case '9906':
            return DeviceVersion.V2;
        default:
            throw new Error('Could not identify the micro:bit board version.');
    }
}

function getHexVersion (hex) {
    switch (hex.boardId) {
        case 0x9900:
        case 0x9901:
            return DeviceVersion.V1;
        case 0x9903:
        case 0x9904:
        case 0x9905:
        case 0x9906:
            return DeviceVersion.V2;
        default:
            throw new Error('Could not identify the target board in the micro:bit HEX file.');
    }
}

async function getHexMap () {
    const response = await fetch(microBitHexUrl);
    if (!response.ok) {
        throw new Error(`Could not load the micro:bit HEX file: HTTP ${response.status}`);
    }
    const hex = await response.text();
    if (!isUniversalHex(hex)) {
        throw new Error('The micro:bit HEX file is not in universal format.');
    }

    const hexData = new TextEncoder().encode(hex);
    const hexMap = new Map();
    for (const individualHex of separateUniversalHex(hex)) {
        hexMap.set(getHexVersion(individualHex), hexData);
    }
    return hexMap;
}

async function updateMicroBit (device, progress) {
    const transport = new WebUSB(device);
    const target = new DAPLink(transport);
    if (progress) {
        target.on(DAPLink.EVENT_PROGRESS, progress);
    }

    const version = getDeviceVersion(device);
    const hexMap = await getHexMap();
    const hexData = hexMap.get(version);
    if (!hexData) {
        throw new Error(`The bundled HEX file does not support micro:bit ${version}.`);
    }

    await target.connect();
    try {
        await target.flash(hexData);
    } finally {
        if (target.connected) {
            await target.disconnect();
        }
    }
}

async function selectAndUpdateMicroBit (progress) {
    if (!isMicroBitUpdateSupported()) {
        throw new Error('Installing micro:bit software is not supported in this browser.');
    }
    const device = await navigator.usb.requestDevice({
        filters: [{
            vendorId: MICROBIT_VENDOR_ID,
            productId: MICROBIT_PRODUCT_ID
        }]
    });
    return updateMicroBit(device, progress);
}

function isMicroBitUpdateSupported () {
    return !!(typeof navigator !== 'undefined' &&
        navigator.usb &&
        typeof navigator.usb.requestDevice === 'function');
}

export {
    DeviceVersion,
    getDeviceVersion,
    getHexMap,
    isMicroBitUpdateSupported,
    selectAndUpdateMicroBit,
    updateMicroBit
};
