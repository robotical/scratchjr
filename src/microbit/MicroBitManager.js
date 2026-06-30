import Prims from '../editor/engine/Prims';
import MicroBitBlocks from './MicroBitBlocks';
import MicroBitWebBluetooth, { isMicroBitWebBluetoothSupported } from './MicroBitWebBluetooth';

class MicroBitManager {
    constructor () {
        this.microBits = {};
    }

    static isWebBluetoothSupported () {
        return isMicroBitWebBluetoothSupported();
    }

    async createAndConnectMicroBit () {
        const microBit = new MicroBitWebBluetooth();
        await microBit.connect();
        return microBit;
    }

    addMicroBit (microBit) {
        if (!microBit.id) {
            microBit.id = `microbit-${Date.now()}`;
        }
        this.microBits[microBit.id] = microBit;
    }

    removeMicroBit (microBit) {
        if (!microBit) {
            return;
        }
        const microBitId = microBit.id;
        if (microBit.blocks && typeof microBit.blocks.destroy === 'function') {
            microBit.blocks.destroy();
        }
        if (Prims.microBitBlocks === microBit.blocks) {
            Prims.microBitBlocks = null;
        }
        delete this.microBits[microBitId];
    }

    wireMicroBitWithBlocks (microBitId) {
        const microBit = this.microBits[microBitId];
        if (!microBit) {
            return;
        }

        const microBitBlocks = new MicroBitBlocks(microBit);
        microBit.blocks = microBitBlocks;
        Prims.microBitBlocks = microBitBlocks;
    }

    getActiveMicroBit () {
        const ids = Object.keys(this.microBits);
        if (ids.length === 0) {
            return null;
        }
        return this.microBits[ids[0]];
    }

    stopAllMicroBits () {
        for (const microBitId in this.microBits) {
            const microBit = this.microBits[microBitId];
            if (microBit && typeof microBit.clearDisplay === 'function') {
                microBit.clearDisplay();
            }
        }
    }
}

export default MicroBitManager;
