import Prims from "../editor/engine/Prims";
import CogBlocks from "./CogBlocks";

class CogManager {
    constructor() {
        this.cogs = {};
    }

    addCog(cog) {
        this.cogs[cog.id] = cog;
    }

    removeCog(cog) {
        try {
            cog.blocks.destroy();
            delete this.cogs[cog.id];
        } catch { }
    }

    wireCogWithBlocks(cogId) {
        try {
            const cog = this.cogs[cogId];
            if (cog) {
                const cogBlocks = new CogBlocks(cog);
                cog.blocks = cogBlocks;
                Prims.cogBlocks = cogBlocks;
            } else {
                console.error(`Cog with id ${cogId} not found`);
            }
        } catch { }
    }

    stopAllCogs() {
        try {
            for (const cogId in this.cogs) {
                // sound
                this.cogs[cogId].sendRestMessage("audio/stop");
            }
        } catch { }
    }
}

export default CogManager;