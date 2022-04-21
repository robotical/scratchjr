
function battery_getFillColor (batteryPercent) {
    let colour = 'rgb(3, 125, 60)'; // green
    if (batteryPercent <= 10) {
        colour = 'rgb(91, 20, 19)'; // red
    } else if (batteryPercent > 10 && batteryPercent <= 30) {
        colour = 'rgb(250, 217, 5)'; // yellow
    }
    return colour;
}

function battery_render (batteryPercent) {
    const batterySvgElement = document.getElementById('marty-battery-svg');
    const fillColor = battery_getFillColor(batteryPercent);
    const batteryBars = Math.ceil(batteryPercent / 20);
    const svgStartPath = 3;
    for (let i = 0; i < 5; i++) {
        if (i < batteryBars) {
        batterySvgElement.children[i + svgStartPath].setAttribute(
            "fill",
            fillColor
        );
        } else {
        batterySvgElement.children[i + svgStartPath].setAttribute(
            "fill",
            "white"
        );
        }
    }
}

export default battery_render;