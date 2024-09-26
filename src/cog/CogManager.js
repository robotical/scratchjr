import Prims from "../editor/engine/Prims";
import CogBlocks from "./CogBlocks";

export class CogManager {
    constructor() {
        this.cogs = {};
    }

    addCog(cog) {
        this.cogs[cog.id] = cog;
    }

    removeCog(cog) {
        cog.destroy();
        delete this.cogs[cog.id];
    }

    wireCogWithBlocks(cogId) {
        const cog = this.cogs[cogId];
        if (cog) {
            const cogBlocks = new CogBlocks(cog);
            Prims.cogBlocks = cogBlocks;
        } else {
            console.error(`Cog with id ${cogId} not found`);
        }
    }
}


const cogManager = new CogManager();
window.cogManager = cogManager;

export default cogManager;