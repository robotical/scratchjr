import BlockSpecs from './BlockSpecs';
import {COLOUR_SWATCHES, SENSED_COLOUR_SWATCHES, addColourPaletteHeader} from './ColourPalette';
import {scaleMultiplier, setProps, setCanvasSize, newHTML, isTablet,
    newDiv, getDocumentHeight, drawThumbnail, frame, globalx, globaly} from '../../utils/lib';
import Path from '../../painteditor/Path';

let openMenu = undefined;

export default class Menu {
    static get openMenu () {
        return openMenu;
    }

    static set openMenu (newOpenMenu) {
        openMenu = newOpenMenu;
    }

    static openDropDown (b, fcn) {
        var size = 50;
        var isColourSensor = b.owner.blocktype === 'martycoloursensed';
        var isColourPalette = b.owner.blocktype === 'selectcolour' || isColourSensor;
        var color = b.owner.blocktype == 'setspeed' ? 'orange' : 'yellow';
        if (b.owner.spec[9]) {
            color = b.owner.spec[9]; // menu colour
        }
        var list = JSON.parse(b.owner.arg.list);
        var num = b.owner.arg.numperrow;
        var dh = size * Math.round(list.length / num);
        var rows = list.length / num;
        var w = size * list.length / rows;
        if (isColourPalette) {
            w = 260;
            dh = 260;
        }
        var position = Menu.getDropDownPosition(b, w, dh);
        var dx = position.x;
        var dy = position.y;
        var mu = newDiv(frame, dx, dy, w, dh, {
            position: 'absolute',
            zIndex: 100000,
            webkitTransform: 'translate(' + (-w / 2) + 'px,' + (-dh / 2) + 'px) ' +
                'scale(' + scaleMultiplier + ', ' + scaleMultiplier + ') ' +
                'translate(' + (w / 2) + 'px, ' + (dh / 2) + 'px)'
        });
        mu.setAttribute('class', isColourPalette ? 'menustyle colour-palette' : 'menustyle ' + color);
        if (isColourSensor) mu.classList.add('colour-palette-sensing');
        mu.active = b;
        if (isColourPalette) {
            var grid = addColourPaletteHeader(mu, isColourSensor ? 'marty-sensor' : 'cog');
            var swatches = isColourSensor ? SENSED_COLOUR_SWATCHES : COLOUR_SWATCHES;
            swatches.forEach(function (swatch) {
                var choice = newHTML('button', 'colour-palette-swatch', grid);
                choice.type = 'button';
                choice.style.background = swatch.colour;
                choice.setAttribute('aria-label', swatch.label || swatch.name);
                if (swatch.name === 'none') {
                    choice.classList.add('colour-palette-none');
                    choice.textContent = swatch.label;
                }
                choice.onclick = function (evt) {
                    fcn(evt, mu, b, (isColourSensor ? 'martycoloursensed' : 'selectcolour') + swatch.name);
                };
                choice.onpointerdown = function (evt) { evt.stopPropagation(); };
                choice.ontouchstart = function (evt) { evt.stopPropagation(); };
            });
        } else {
            for (var i = 0; i < list.length; i++) {
                Menu.addImageToDropDown(mu, list[i], b, fcn);
            }
        }
        openMenu = mu;
    }

    // Both device colour pickers use the same block anchor and edge clamping.
    static getDropDownPosition (b, w, dh) {
        var p = b.parentNode;
        var scaledWidth = w * scaleMultiplier;
        var dx = b.left + (b.offsetWidth - scaledWidth) / 2;
        if ((dx + scaledWidth) > p.width) {
            dx -= ((dx + scaledWidth) - p.width);
        }
        if (dx < 5) {
            dx = 5;
        }
        dx += globalx(p, 0);
        var dy = b.top + b.offsetHeight - ((10 + 18) * scaleMultiplier) + globaly(p, 0);
        if ((dy + ((10 + dh) * scaleMultiplier)) > getDocumentHeight()) {
            dy = getDocumentHeight() - ((15 + dh) * scaleMultiplier);
        }
        return {x: dx, y: Math.max(5, dy)};
    }

    static addImageToDropDown (mu, c, block, fcn) {
        var img = BlockSpecs.getImageFrom('assets/blockicons/' + c, 'svg');
        var cs = newHTML('div', 'ddchoice', mu);
        var micon = newHTML('canvas', undefined, cs);
        var iconSize = 42;
        var scaledIconSize = iconSize * window.devicePixelRatio;
        setCanvasSize(micon, scaledIconSize, scaledIconSize);
        setProps(micon.style, {
            webkitTransform: 'translate(' + (-scaledIconSize / 2) + 'px, ' + (-scaledIconSize / 2) + 'px) ' +
                'scale(' + (1 / window.devicePixelRatio) + ', ' + (1 / window.devicePixelRatio) + ') ' +
                'translate(' + (scaledIconSize / 2) + 'px, ' + (scaledIconSize / 2) + 'px)'
        });
        if (!img.complete) {
            img.onload = function () {
                drawThumbnail(img, micon);
            };
        } else {
            drawThumbnail(img, micon);
        }
        cs.ontouchstart = function (evt) {
            handleTouchStart(evt);
        };
        cs.onmouseover = function (evt) {
            Path.highlightDot(evt);
        };
        cs.onmouseout = function (evt) {
            Path.unhighlightDot(evt);
        };
        cs.onpointerdown = function (evt) {
            fcn(evt, mu, block, c);
        };
        function handleTouchStart (e) {
            if (isTablet && e.touches && (e.touches.length > 1)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            fcn(e, mu, block, c);
        }
    }

    static closeMyOpenMenu () {
        if (!openMenu) {
            return;
        }
        openMenu.parentNode.removeChild(openMenu);
        openMenu = undefined;
    }
}
