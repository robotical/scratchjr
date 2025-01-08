import Prims from "../editor/engine/Prims";
import MartyBlocks from "./MartyBlocks";

class MartyManager {
    constructor() {
        this.martys = {};
    }

    addMarty(marty) {
        this.martys[marty.id] = marty;
    }

    removeMarty(marty) {
        marty.blocks.destroy();
        delete this.martys[marty.id];
    }

    wireMartyWithBlocks(martyId) {
        const marty = this.martys[martyId];
        if (marty) {
            const martyBlocks = new MartyBlocks(marty);
            marty.blocks = martyBlocks;
            Prims.martyBlocks = martyBlocks;
        } else {
            console.error(`Marty with id ${martyId} not found`);
        }
    }

    stopAllMartys() {
        for (const martyId in this.martys) {
            // motion
            this.martys[martyId].sendRestMessage("robot/stopAfterMove");
        }
    }
}

export default MartyManager;