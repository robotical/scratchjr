const ZOOM_STEP = 0.2;
const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 2;

export default class Zoom {
    constructor (scriptsContainer) {
        this.scriptsContainer = scriptsContainer;
        this.zoomLevel = 1;
    }

    zoomIn () {
        this.changeZoom(ZOOM_STEP);
    }

    zoomOut () {
        this.changeZoom(-ZOOM_STEP);
    }

    zoomReset () {
        this.zoomLevel = 1;
        this.applyZoom();
    }

    changeZoom (amount) {
        const nextZoomLevel = Number((this.zoomLevel + amount).toFixed(1));
        this.zoomLevel = Math.min(Math.max(nextZoomLevel, MIN_ZOOM_LEVEL), MAX_ZOOM_LEVEL);
        this.applyZoom();
    }

    getLocalPoint (element, x, y) {
        const rect = element.getBoundingClientRect();
        const scale = this.getElementScale(element, rect);
        return {
            x: (x - rect.left) / scale.x,
            y: (y - rect.top) / scale.y
        };
    }

    getElementScale (element, rect) {
        rect = rect || element.getBoundingClientRect();
        return {
            x: element.offsetWidth ? rect.width / element.offsetWidth : this.zoomLevel,
            y: element.offsetHeight ? rect.height / element.offsetHeight : this.zoomLevel
        };
    }

    getRenderedScale () {
        return this.getElementScale(this.scriptsContainer).x;
    }

    applyZoom () {
        if (this.scriptsContainer) {
            this.scriptsContainer.style.transform = `scale(${this.zoomLevel})`;
        }
    }
}
