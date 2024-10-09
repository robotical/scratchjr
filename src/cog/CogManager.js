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
        cog.blocks.destroy();
        delete this.cogs[cog.id];
    }

    wireCogWithBlocks(cogId) {
        const cog = this.cogs[cogId];
        if (cog) {
            const cogBlocks = new CogBlocks(cog);
            cog.blocks = cogBlocks;
            Prims.cogBlocks = cogBlocks;
        } else {
            console.error(`Cog with id ${cogId} not found`);
        }
    }
}

export default CogManager;