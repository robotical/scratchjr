export default class Zoom {
    constructor(scriptsContainer) {
        this.scriptsContainer = scriptsContainer;
        this.zoomLevel = 1;
        this.zoomInterval = null; // Add this line
    }

    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2); // Max zoom level 2x
        this.applyZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel - 0.6, 0.1); // Min zoom level 0.1x
        this.applyZoom();
    }

    zoomReset() {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    applyZoom() {
        if (this.scriptsContainer) {
            this.scriptsContainer.style.transform = `scale(${this.zoomLevel})`;
            // this.scriptsContainer.style.transformOrigin = '0 0';
        }
    }
}
