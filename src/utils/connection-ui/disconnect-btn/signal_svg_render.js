import rescale from "../../rescale";

function signal_render(rssi) {
  const signalRaw = (-50 / rssi) * 100;
  const signalSvgElement = document.getElementById("marty-signal-svg");
  const signalScaled = rescale(signalRaw, 50, 100, 0, 100);
  const signalBars = signalScaled / 20;
  const colour = signalBars <= 3 ? "rgb(250, 217, 5)" : "rgb(3, 125, 60)";
  const svgStartPath = 9;
  for (let i = 0; i < 5; i++) {
    if (i < signalBars) {
      signalSvgElement.children[svgStartPath - i].setAttribute("fill", colour);
    } else {
      signalSvgElement.children[svgStartPath - i].setAttribute("fill", "white");
    }
  }
}

export default signal_render;
