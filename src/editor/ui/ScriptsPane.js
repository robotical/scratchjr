import ScratchJr from '../ScratchJr';
import Project from './Project';
import Thumbs from './Thumbs';
import Palette from './Palette';
import Undo from './Undo';
import Events from '../../utils/Events';
import Scroll from './Scroll';
import Zoom from './Zoom';
import Menu from '../blocks/Menu';
import Localization from '../../utils/Localization';
import ScratchAudio from '../../utils/ScratchAudio';
import {
    gn, newButton, newHTML, isTablet,
    setCanvasSize, getDocumentHeight, frame
} from '../../utils/lib';

import { zoomInSvg } from '../../html-svgs/zoom-in-svg';
import { zoomOutSvg } from '../../html-svgs/zoom-out-svg';

let scroll = undefined;
let zoom = undefined;
let watermark;

function getGuideLabel(key) {
    var label = Localization.localize(key, { N: 0 });
    var parts = label.split('|');
    return parts.length > 1 ? parts.slice(1).join('|').trim() : label;
}

export default class ScriptsPane {
    static get scroll() {
        return scroll;
    }

    static get zoom() {
        return zoom;
    }

    static get watermark() {
        return watermark;
    }

    static createScripts(parent) {
        var div = newHTML('div', 'scripts', parent);
        div.setAttribute('id', 'scripts');
        div.setAttribute('role', 'group');
        div.setAttribute('aria-label', getGuideLabel('INTERFACE_GUIDE_PROGRAMMING_AREA'));
        watermark = newHTML('div', 'watermark', div);
        var h = Math.max(getDocumentHeight(), frame.offsetHeight);
        setCanvasSize(div, div.offsetWidth, h - div.offsetTop);
        scroll = new Scroll(div, 'scriptscontainer', div.offsetWidth,
            h - div.offsetTop, ScratchJr.getActiveScript, ScratchJr.getBlocks);
        scroll.contents.setAttribute('role', 'list');
        scroll.contents.setAttribute('aria-label', getGuideLabel('INTERFACE_GUIDE_PROGRAMMING_SCRIPT'));
        zoom = new Zoom(scroll.contents);

        const zoomControls = newHTML('div', 'zoom-controls', div);
        zoomControls.setAttribute('role', 'group');
        zoomControls.setAttribute('aria-label', getGuideLabel('INTERFACE_GUIDE_ZOOM'));

        const zoomOutButton = newButton('zoom-button', zoomControls, {
            ariaLabel: 'Zoom out',
            title: 'Zoom out'
        });
        zoomOutButton.innerHTML = zoomOutSvg;
        zoomOutButton.onclick = ScriptsPane.zoomOut;

        const zoomInButton = newButton('zoom-button', zoomControls, {
            ariaLabel: 'Zoom in',
            title: 'Zoom in'
        });
        zoomInButton.innerHTML = zoomInSvg;
        zoomInButton.onclick = ScriptsPane.zoomIn;
    }

    static zoomIn() {
        zoom.zoomIn();
        scroll.refresh();
    }

    static zoomOut() {
        zoom.zoomOut();
        scroll.refresh();
    }

    static getScriptPoint(sc, x, y) {
        return zoom.getLocalPoint(sc, x, y);
    }

    static getScriptPosition(sc, element) {
        var rect = element.getBoundingClientRect();
        return ScriptsPane.getScriptPoint(sc, rect.left, rect.top);
    }

    static applyDragTransform(element) {
        var scale = element.dragVisualScale || 1;
        var scaleTransform = scale == 1 ? '' : ' scale(' + scale + ')';
        element.style.webkitTransform = 'translate3d(' + element.left + 'px,' +
            element.top + 'px, 0)' + scaleTransform;
    }

    static positionDragCanvas(element, x, y) {
        element.left = x;
        element.top = y;
        ScriptsPane.applyDragTransform(element);
    }

    static moveDragCanvas(element, dx, dy) {
        ScriptsPane.positionDragCanvas(element, element.left + dx, element.top + dy);
    }

    static applyZoomToDragCanvas(element) {
        element.dragVisualScale = zoom.getRenderedScale();
        element.style.webkitTransformOrigin = '0 0';
        element.style.transformOrigin = '0 0';
        ScriptsPane.applyDragTransform(element);
    }

    static clearDragScale(element) {
        delete element.dragVisualScale;
        element.style.webkitTransformOrigin = '';
        element.style.transformOrigin = '';
    }

    static setActiveScript(sprname) {
        var currentsc = gn(sprname + '_scripts');
        if (!currentsc) {
            // Sprite not found
            return;
        }
        ScratchJr.stage.currentPage.setCurrentSprite(gn(sprname).owner);
        scroll.update();
    }

    static runBlock(e, div) {
        e.preventDefault();
        e.stopPropagation();
        var b = div.owner.findFirst();
        //	if (b.aStart) b = b.next;
        if (!b) {
            return;
        }
        ScratchJr.runtime.addRunScript(ScratchJr.getSprite(), b);
        ScratchJr.startCurrentPageStrips(['ontouch']);
        ScratchJr.userStart = true;
    }

    static prepareToDrag(e) {
        e.preventDefault();
        var pt = Events.getTargetPoint(e);
        ScriptsPane.pickBlock(pt.x, pt.y, e);
    }

    static pickBlock(x, y, e) {
        if (!ScratchJr.runtime.inactive()) {
            ScratchJr.stopStrips();
        }
        ScriptsPane.cleanCarets();
        ScratchJr.unfocus(e);
        var sc = ScratchJr.getActiveScript().owner;
        sc.dragList = sc.findGroup(Events.dragthumbnail.owner);
        sc.flowCaret = null;
        Events.dragmousex = x;
        Events.dragmousey = y;
        var draggedRect = Events.dragthumbnail.getBoundingClientRect();
        var dragLayerRect = Events.dragDiv.getBoundingClientRect();
        var mx = draggedRect.left - dragLayerRect.left;
        var my = draggedRect.top - dragLayerRect.top;
        var mtx = new WebKitCSSMatrix(window.getComputedStyle(Events.dragthumbnail).webkitTransform);
        Events.dragcanvas = Events.dragthumbnail;
        Events.dragcanvas.origin = 'scripts';
        Events.dragcanvas.startx = mtx.m41;
        Events.dragcanvas.starty = mtx.m42;
        if (!Events.dragcanvas.isReporter && Events.dragcanvas.parentNode) {
            Events.dragcanvas.parentNode.removeChild(Events.dragcanvas);
        }
        Events.dragcanvas.style.zIndex = ScratchJr.dragginLayer;
        Events.dragDiv.appendChild(Events.dragcanvas);
        ScriptsPane.applyZoomToDragCanvas(Events.dragcanvas);
        ScriptsPane.positionDragCanvas(Events.dragcanvas, mx, my);
        var b = Events.dragcanvas.owner;
        b.detachBlock();
        //	b.lift();
        if (Events.dragcanvas.owner && Events.dragcanvas.owner.isReporter) {
            return;
        }
        ScratchJr.getActiveScript().owner.prepareCaret(b);
        for (var i = 1; i < sc.dragList.length; i++) {
            b = sc.dragList[i];
            var pos = new WebKitCSSMatrix(window.getComputedStyle(b.div).webkitTransform);
            var dx = pos.m41 - mtx.m41;
            var dy = pos.m42 - mtx.m42;
            b.moveBlock(dx, dy);
            //   b.lift();
            Events.dragcanvas.appendChild(b.div);
        }
    }

    ////////////////////////////////////////////////
    //  Events MouseMove
    ////////////////////////////////////////////////

    static draggingBlock(e) {
        e.preventDefault();
        var pt = Events.getTargetPoint(e);
        var dx = pt.x - Events.dragmousex;
        var dy = pt.y - Events.dragmousey;
        ScriptsPane.moveDragCanvas(Events.dragcanvas, dx, dy);
        ScriptsPane.blockFeedback(e);
    }

    static blockFeedback(e) {
        var script = ScratchJr.getActiveScript().owner;
        var dragRect = Events.dragcanvas.getBoundingClientRect();
        var paletteRect = gn('palette').parentNode.getBoundingClientRect();
        if (dragRect.bottom < paletteRect.bottom) {
            script.removeCaret();
        } else {
            script.removeCaret();
            var position = ScriptsPane.getScriptPosition(ScratchJr.getActiveScript(), Events.dragcanvas);
            script.insertCaret(position.x, position.y);
        }
        var thumb;
        switch (Palette.getLandingPlace(script.dragList[0].div, e)) {
            case 'library':
                thumb = Palette.getHittedThumb(script.dragList[0].div, gn('spritecc'));
                if (thumb && (gn(thumb.owner).owner.type == ScratchJr.getSprite().type)) {
                    Thumbs.quickHighlight(thumb);
                } else {
                    thumb = undefined;
                }
                for (var i = 0; i < gn('spritecc').childElementCount; i++) {
                    var spr = gn('spritecc').childNodes[i];
                    if (spr.nodeName == 'FORM') {
                        continue;
                    }
                    if (thumb && (thumb.id != spr.id)) {
                        Thumbs.quickRestore(spr);
                    }
                }
                break;
            default:
                ScriptsPane.removeLibCaret();
                break;
        }
    }


    ////////////////////////////////////////////////
    //  Events MouseUP
    ////////////////////////////////////////////////

    static dropBlock(e, el) {
        e.preventDefault();
        var sc = ScratchJr.getActiveScript();
        var spr = sc.owner.spr.id;
        var page = ScratchJr.stage.currentPage;
        switch (Palette.getLandingPlace(el, e)) {
            case 'scripts':
                var position = ScriptsPane.getScriptPosition(sc, el);
                ScriptsPane.blockDropped(sc, position.x, position.y);
                // Start the story if scripts is changed.
                ScratchJr.storyStart('ScriptsPane.changed');
                break;
            case 'library':
                var thumb = Palette.getHittedThumb(el, gn('spritecc'));
                ScriptsPane.blockDropped(ScratchJr.getActiveScript(), el.startx, el.starty);
                if (thumb && (gn(thumb.owner).owner.type == gn(page.currentSpriteName).owner.type)) {
                    ScratchJr.storyStart('ScriptsPane.dropBlock:library');
                    ScratchAudio.sndFX('copy.wav');
                    Thumbs.quickHighlight(thumb);
                    setTimeout(function () {
                        Thumbs.quickRestore(thumb);
                    }, 300);
                    sc = gn(thumb.owner + '_scripts').owner;
                    var strip = Project.encodeStrip(el.owner);
                    var firstblock = strip[0];
                    var delta = sc.gettopblocks().length * 3;
                    firstblock[2] = firstblock[2] + delta;
                    firstblock[3] = firstblock[3] + delta;
                    sc.recreateStrip(strip);
                    spr = thumb.owner;
                }
                break;
            default:
                ScratchJr.getActiveScript().owner.deleteBlocks();
                scroll.adjustCanvas();
                scroll.refresh();
                scroll.fitToScreen();
                /*Tutorial*/
                if (window.tutorialEngine) {
                    // evaluate the scripts area
                    window.tutorialEngine.evaluateScriptsArea();
                }
                break;
        }
        Undo.record({
            action: 'scripts',
            where: page.id,
            who: spr
        });
        ScratchJr.getActiveScript().owner.dragList = [];
    }

    static blockDropped(sc, dx, dy) {
        Events.dragcanvas.style.zIndex = '';
        ScriptsPane.clearDragScale(Events.dragcanvas);
        var script = ScratchJr.getActiveScript().owner;
        ScriptsPane.cleanCarets();
        script.addBlockToScripts(Events.dragcanvas, dx, dy);
        script.layout(Events.dragcanvas.owner);
        if (sc.id == ScratchJr.getActiveScript().id) {
            scroll.adjustCanvas();
            scroll.refresh();
            scroll.bounceBack();
        }
    }

    static cleanCarets() {
        ScratchJr.getActiveScript().owner.removeCaret();
        ScriptsPane.removeLibCaret();
    }

    static removeLibCaret() {
        for (var i = 0; i < gn('spritecc').childElementCount; i++) {
            var spr = gn('spritecc').childNodes[i];
            if (spr.nodeName == 'FORM') {
                continue;
            }
            Thumbs.quickRestore(spr);
        }
    }

    //----------------------------------
    //  Drag Script Background
    //----------------------------------

    static dragBackground(e) {
        if (Menu.openMenu) {
            return;
        }
        if (isTablet && e.touches && (e.touches.length > 1)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var sc = ScratchJr.getActiveScript();
        sc.top = sc.offsetTop;
        sc.left = sc.offsetLeft;
        var pt = Events.getTargetPoint(e);
        Events.dragmousex = pt.x;
        Events.dragmousey = pt.y;
        Events.dragged = false;
        ScriptsPane.setDragBackgroundEvents(ScriptsPane.dragMove, ScriptsPane.dragEnd);
    }

    static setDragBackgroundEvents(fcnmove, fcnup) {
        window.ontouchmove = function (evt) {
            fcnmove(evt);
        };
        window.ontouchend = function (evt) {
            fcnup(evt);
        };
        window.ontouchleave = function (evt) {
            fcnup(evt);
        };
        window.ontouchcancel = function (evt) {
            fcnup(evt);
        };
        window.onpointermove = function (evt) {
            fcnmove(evt);
        };
        window.onpointerup = function (evt) {
            fcnup(evt);
        };
        window.onpointercancel = function (evt) {
            fcnup(evt);
        };
        window.onmousemove = function (evt) {
            fcnmove(evt);
        };
        window.onmouseup = function (evt) {
            fcnup(evt);
        };
    }

    static dragMove(e) {
        var pt = Events.getTargetPoint(e);
        if (!Events.dragged && (Events.distance(Events.dragmousex - pt.x, Events.dragmousey - pt.y) < 5)) {
            return;
        }
        Events.dragged = true;
        var dx = pt.x - Events.dragmousex;
        var dy = pt.y - Events.dragmousey;
        Events.dragmousex = pt.x;
        Events.dragmousey = pt.y;
        var renderedScale = zoom.getRenderedScale();
        Events.move3D(ScratchJr.getActiveScript(), dx / renderedScale, dy / renderedScale);
        scroll.refresh();
        e.preventDefault();
    }

    static dragEnd(e) {
        Events.dragged = false;
        e.preventDefault();
        Events.clearEvents();
        scroll.bounceBack();
    }

    //////////////////////
    //
    //////////////////////

    static updateScriptsPageBlocks(list) {
        for (var j = 0; j < list.length; j++) {
            if (!gn(list[j] + '_scripts')) {
                continue;
            }
            var sc = gn(list[j] + '_scripts').owner;
            if (!sc) {
                continue;
            }
            var allblocks = sc.getBlocks();
            for (var i = 0; i < allblocks.length; i++) {
                allblocks[i].updateBlock();
            }
        }
    }
}


window.ScriptsPane = ScriptsPane;
