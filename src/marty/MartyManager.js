import Prims from "../editor/engine/Prims";
import MartyBlocks from "./MartyBlocks";

class MartyManager {
    constructor() {
        this.martys = {};
        this.sensorAvailabilityById = {};
    }

    addMarty(marty) {
        this.martys[marty.id] = marty;
        this.sensorAvailabilityById[marty.id] = MartyManager.defaultSensorAvailability();
    }

    removeMarty(marty) {
        if (marty.blocks && typeof marty.blocks.destroy === 'function') {
            marty.blocks.destroy();
        }
        delete this.martys[marty.id];
        delete this.sensorAvailabilityById[marty.id];
        this.notifySensorAvailabilityChanged();
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

    setMartySensorAvailability(martyId, availability) {
        console.log(`Setting sensor availability for Marty ${martyId}:`, availability);
        const marty = this.martys[martyId];
        if (!marty) {
            console.warn(`Attempted to set sensor availability for unknown Marty: ${martyId}`);
            return;
        }

        const currentAvailability = this.sensorAvailabilityById[martyId] || MartyManager.defaultSensorAvailability();
        this.sensorAvailabilityById[martyId] = {
            colour: MartyManager.toBoolean(availability?.colour, currentAvailability.colour),
            obstacle: MartyManager.toBoolean(availability?.obstacle, currentAvailability.obstacle),
            light: MartyManager.toBoolean(availability?.light, currentAvailability.light),
            noise: MartyManager.toBoolean(availability?.noise, currentAvailability.noise)
        };
        this.notifySensorAvailabilityChanged();
    }

    getVisibleMartySensorBlocks() {
        const availability = this.getActiveSensorAvailability();
        const visibleBlocks = [];

        if (availability.colour) {
            visibleBlocks.push(MartyManager.SENSOR_BLOCKS.colour);
        }
        if (availability.obstacle) {
            visibleBlocks.push(MartyManager.SENSOR_BLOCKS.obstacle);
        }
        if (availability.light) {
            visibleBlocks.push(MartyManager.SENSOR_BLOCKS.light);
        }
        if (availability.noise) {
            visibleBlocks.push(MartyManager.SENSOR_BLOCKS.noise);
        }

        return visibleBlocks;
    }

    getActiveSensorAvailability() {
        const activeMarty = this.getActiveMarty();
        if (!activeMarty) {
            return MartyManager.defaultSensorAvailability();
        }
        return this.sensorAvailabilityById[activeMarty.id] || MartyManager.defaultSensorAvailability();
    }

    getActiveMarty() {
        const activeFromApplicationManager = window.applicationManager?.getTheCurrentlySelectedDeviceOrFirstOfItsKind?.('Marty');
        if (activeFromApplicationManager && this.martys[activeFromApplicationManager.id]) {
            return this.martys[activeFromApplicationManager.id];
        }
        const ids = Object.keys(this.martys);
        if (ids.length === 0) {
            return null;
        }
        return this.martys[ids[0]];
    }

    notifySensorAvailabilityChanged() {
        if (window.Palette && typeof window.Palette.refreshMartySensorBlocks === 'function') {
            window.Palette.refreshMartySensorBlocks();
        } else if (window.Palette && typeof window.Palette.recreateCategories === 'function') {
            window.Palette.recreateCategories();
        }
    }

    static defaultSensorAvailability() {
        return {
            colour: false,
            obstacle: false,
            light: false,
            noise: false
        };
    }

    static toBoolean(value, fallback) {
        if (typeof value === 'boolean') {
            return value;
        }
        return !!fallback;
    }
}

export default MartyManager;

MartyManager.SENSOR_BLOCKS = Object.freeze({
    colour: 'martycoloursensed',
    obstacle: 'martyobstaclesensed',
    light: 'martylightsensed',
    noise: 'martynoisesensed'
});