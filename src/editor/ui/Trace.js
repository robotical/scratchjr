import { gn, newCanvas, setProps } from "../../utils/lib";
import ScratchJr from "../ScratchJr";

let hidden = true;
let width = 482;
let height = 362;
let size = 24;

let prevX = 0;
let prevY = 0;

export default class Trace {
  static get hidden() {
    return hidden;
  }

  static init(div) {
    var traceStage = newCanvas(div, 0, 0, width, height, {
      position: "absolute",
      zIndex: ScratchJr.layerTop,
    });
    traceStage.setAttribute("id", "trace");
    Trace.createTrace(traceStage);
  }

  static createTrace(cnv) {
    var ctx = cnv.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, cnv.width, cnv.height);
  }

  static updateTrace() {
    const c = gn("trace");
    if (!c) {
      return;
    }
    if (hidden) {
      return;
    }
    if (ScratchJr.inFullscreen) {
      return;
    }
    if (!ScratchJr.stage.currentPage) {
      return;
    }
    if (!ScratchJr.getSprite()) {
      c.style.visibility = "hidden";
      return;
    }
    // if the parent of the trace canvas is not the current page, move it
    if (c.parentElement.id != ScratchJr.stage.currentPage.id) {
      c.parentElement.removeChild(c);
      gn(ScratchJr.stage.currentPage.id).appendChild(c);
    }

    var spr = gn(ScratchJr.stage.currentPage.currentSpriteName);
    if (!spr) {
      return;
    }
    var obj = spr.owner;

    var dx = obj.xcoor + size / 2;
    var dy = obj.ycoor - size / 2;
    c.style.visibility = "visible";
    Trace.setTraceValues(dx, dy);
  }

  static setTraceValues(dx, dy) {
    var cnv = gn("trace");
    let numX = +(dx / size).toFixed(2);
    let numY = +(dy / size).toFixed(2);
    numY *= size + 3;
    numX *= size - 1;
    // setProps(c.style, {
    //   position: "absolute",
    //   top: numY * 24 + "px",
    //   left: (numX - 1) * 24 + "px",
    // });

    var ctx = cnv.getContext("2d");

    // Store the previous position
    prevX = numX;
    prevY = numY;

    // Update the current position
    numX += 2;
    numY += 2;

    // Draw the trace line
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(numX, numY);
    ctx.stroke();
  }

  static clear = () => {
    const c = gn("trace");
    if (!c) {
      return;
    }
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
  };

  static hide(b) {
    hidden = b;
    var mystate = hidden ? "hidden" : "visible";
    gn("trace").style.visibility = mystate;
    if (ScratchJr.stage.currentPage) {
      mystate = !ScratchJr.getSprite() ? "hidden" : mystate;
    }
    gn("trace").style.visibility = mystate;
  }
}
