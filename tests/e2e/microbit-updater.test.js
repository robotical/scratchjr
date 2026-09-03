import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const mocks = vi.hoisted(() => ({
    connectError: null,
    dapLinks: [],
    flashError: null,
    isUniversalHex: vi.fn(() => true),
    separateUniversalHex: vi.fn(() => [
        {boardId: 0x9900},
        {boardId: 0x9903}
    ]),
    webUsbDevices: [],
    webUsbTransports: []
}));

vi.mock('@microbit/microbit-universal-hex', () => ({
    isUniversalHex: mocks.isUniversalHex,
    separateUniversalHex: mocks.separateUniversalHex
}));

vi.mock('dapjs', () => {
    class WebUSB {
        constructor (device) {
            this.device = device;
            this.close = vi.fn(async () => {});
            mocks.webUsbDevices.push(device);
            mocks.webUsbTransports.push(this);
        }
    }

    class DAPLink {
        static EVENT_PROGRESS = 'progress';

        constructor (transport) {
            this.transport = transport;
            this.connected = false;
            this.on = vi.fn();
            this.connect = vi.fn(async () => {
                if (mocks.connectError) {
                    throw mocks.connectError;
                }
                this.connected = true;
            });
            this.flash = vi.fn(async () => {
                if (mocks.flashError) {
                    throw mocks.flashError;
                }
            });
            this.disconnect = vi.fn(async () => {
                this.connected = false;
            });
            mocks.dapLinks.push(this);
        }
    }

    return {DAPLink, WebUSB};
});

describe('MicroBitUpdater', () => {
    let updater;
    let requestDevice;

    beforeEach(async () => {
        vi.clearAllMocks();
        mocks.dapLinks.length = 0;
        mocks.connectError = null;
        mocks.flashError = null;
        mocks.webUsbDevices.length = 0;
        mocks.webUsbTransports.length = 0;
        mocks.isUniversalHex.mockReturnValue(true);
        mocks.separateUniversalHex.mockReturnValue([
            {boardId: 0x9900},
            {boardId: 0x9903}
        ]);
        requestDevice = vi.fn();
        vi.stubGlobal('navigator', {usb: {requestDevice}});
        vi.stubGlobal('fetch', vi.fn(async () => ({
            ok: true,
            text: async () => 'universal micro:bit hex'
        })));
        updater = await import('@/microbit/MicroBitUpdater.js');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('selects the micro:bit USB interface and flashes the universal HEX', async () => {
        const device = {serialNumber: '9903ABCDEF'};
        const progress = vi.fn();
        requestDevice.mockResolvedValue(device);

        await updater.selectAndUpdateMicroBit(progress);

        expect(requestDevice).toHaveBeenCalledWith({
            filters: [{vendorId: 0x0d28, productId: 0x0204}]
        });
        expect(mocks.webUsbDevices).toEqual([device]);
        expect(mocks.dapLinks).toHaveLength(1);
        const dapLink = mocks.dapLinks[0];
        expect(dapLink.on).toHaveBeenCalledWith('progress', progress);
        expect(dapLink.connect).toHaveBeenCalledOnce();
        expect(dapLink.flash).toHaveBeenCalledOnce();
        expect(dapLink.flash.mock.calls[0][0]).toEqual(new TextEncoder().encode('universal micro:bit hex'));
        expect(dapLink.disconnect).toHaveBeenCalledOnce();
    });

    it('rejects unsupported board identifiers before connecting to DAPLink', async () => {
        requestDevice.mockResolvedValue({serialNumber: '1234ABCDEF'});

        await expect(updater.selectAndUpdateMicroBit()).rejects.toThrow(
            'Could not identify the micro:bit board version.'
        );

        expect(mocks.dapLinks[0].connect).not.toHaveBeenCalled();
        expect(mocks.dapLinks[0].flash).not.toHaveBeenCalled();
    });

    it('reports when the browser does not expose WebUSB', () => {
        vi.stubGlobal('navigator', {});

        expect(updater.isMicroBitUpdateSupported()).toBe(false);
        return expect(updater.selectAndUpdateMicroBit()).rejects.toThrow(
            'Installing micro:bit software is not supported in this browser.'
        );
    });

    it('disconnects DAPLink when flashing fails', async () => {
        requestDevice.mockResolvedValue({serialNumber: '9901ABCDEF'});
        mocks.flashError = new Error('flash failed');

        await expect(updater.selectAndUpdateMicroBit()).rejects.toMatchObject({
            code: updater.MicroBitUpdateErrorCode.FLASH_FAILED,
            message: 'flash failed'
        });
        expect(mocks.dapLinks[0].disconnect).toHaveBeenCalledOnce();
    });

    it('classifies a claimed WebUSB interface and closes the partially opened transport', async () => {
        requestDevice.mockResolvedValue({serialNumber: '9903ABCDEF'});
        mocks.connectError = new DOMException('Unable to claim interface.', 'NetworkError');

        await expect(updater.selectAndUpdateMicroBit()).rejects.toMatchObject({
            code: updater.MicroBitUpdateErrorCode.USB_ACCESS,
            message: 'Unable to claim interface.'
        });
        expect(mocks.webUsbTransports[0].close).toHaveBeenCalledOnce();
        expect(mocks.dapLinks[0].flash).not.toHaveBeenCalled();
    });

    it('keeps missing CMSIS-DAP interfaces distinct from USB contention', async () => {
        requestDevice.mockResolvedValue({serialNumber: '9903ABCDEF'});
        mocks.connectError = new Error('No valid interfaces found.');

        await expect(updater.selectAndUpdateMicroBit()).rejects.toMatchObject({
            code: updater.MicroBitUpdateErrorCode.INTERFACE_FIRMWARE
        });
        expect(mocks.webUsbTransports[0].close).toHaveBeenCalledOnce();
    });
});
