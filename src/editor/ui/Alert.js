import DrawPath from '../../utils/DrawPath';
import {globalx, globaly, scaleMultiplier, newCanvas,
    setCanvasSize, setProps, writeText, getStringSize} from '../../utils/lib';

let balloon = undefined;

export default class Alert {
    static get balloon () {
        return balloon;
    }

    static close () {
        if (!balloon) {
            return;
        }
        balloon.parentNode.removeChild(balloon);
        balloon = undefined;
    }

    static open (p, obj, label, color, autoCloseDuration) {
        Alert.close();
        if (!obj) {
            return;
        }
        var scale = scaleMultiplier;
        var w = 80;
        var h = 24;

        var anchorMetrics = Alert.getAnchorMetrics(p, obj);
        if (!isFinite(anchorMetrics.centerX)) {
            anchorMetrics.centerX = ((p && p.offsetWidth) ? p.offsetWidth / 2 : window.innerWidth / 2);
        }
        if (!isFinite(anchorMetrics.top)) {
            anchorMetrics.top = 0;
        }
        var bubbleWidth = Alert.getScaledBubbleWidth(w, scale);
        var dx = anchorMetrics.centerX - (bubbleWidth / 2);
        var dy = anchorMetrics.top - (h * scale);
        if (dy < 5 * scale) {
            dy = 5 * scale;
        }

        var targetZIndex = Alert.getBalloonZIndex(obj);
        balloon = newCanvas(p, dx, dy, w, h, {
            position: 'absolute',
            zIndex: targetZIndex
        });
        balloon.icon = obj;
        balloon.addEventListener('click', Alert.close);
        balloon.style.cursor = 'pointer';
        var ctx = balloon.getContext('2d');
        w = 16 + getStringSize(ctx, 'bold 14px Verdana', label).width;
        if (w < 36) {
            w = 36;
        }
        bubbleWidth = Alert.getScaledBubbleWidth(w, scale);
        dx = anchorMetrics.centerX - (bubbleWidth / 2);
        if (dx < 5 * scale) {
            dx = 5 * scale;
        }
        dx = Math.floor(dx);
        setCanvasSize(balloon, w, 36);
        setProps(balloon.style, {
            position: 'absolute',
            left: dx + 'px',
            zIndex: targetZIndex,
            webkitTransform: 'translate(' + (-w / 2) + 'px, ' + (-h / 2) + 'px) ' +
                'scale(' + scale + ', ' + scale + ') ' +
                'translate(' + (w / 2) + 'px, ' + (h / 2) + 'px) '
        });
        Alert.draw(balloon.getContext('2d'), 6, w, h, color);
        writeText(ctx, 'bold 14px Verdana', 'white', label, 20, 8);

        if (autoCloseDuration && autoCloseDuration > 0) {
            setTimeout(() => {
                Alert.close();
            }, autoCloseDuration);
        }
    }

    static draw (ctx, curve, w, h, color) {
        curve = 10;
        var path = new Array(['M', 0, curve], ['q', 0, -curve, curve, -curve], ['h', w - curve * 2],
            ['q', curve, 0, curve, curve], ['v', h - curve * 2], ['q', 0, curve, -curve, curve],
            ['h', -(w / 2) + 7 + curve], ['l', -7, 7], ['l', -7, -7], ['h', -(w / 2) + 7 + curve],
            ['q', -curve, 0, -curve, -curve], ['Z']
        );
        ctx.clearRect(0, 0, Math.max(ctx.canvas.width, w), Math.max(ctx.canvas.height, h));
        ctx.fillStyle = color;
        ctx.beginPath();
        DrawPath.render(ctx, path);
        ctx.fill();
    }

    static getBalloonZIndex (anchor) {
        var maxZ = 0;
        if (anchor && window && window.getComputedStyle) {
            var el = anchor;
            while (el && el !== document.body) {
                var computed = window.getComputedStyle(el);
                if (computed) {
                    var value = parseInt(computed.zIndex, 10);
                    if (!isNaN(value)) {
                        if (value > maxZ) {
                            maxZ = value;
                        }
                    }
                }
                el = el.parentElement;
            }
        }
        return Math.max(maxZ + 1, 12000);
    }

    static getAnchorMetrics (parent, obj) {
        var parentRect = (parent && parent.getBoundingClientRect) ? parent.getBoundingClientRect() : null;
        if (obj && obj.getBoundingClientRect && parentRect) {
            var objRect = obj.getBoundingClientRect();
            return {
                centerX: (objRect.left + (objRect.width / 2)) - parentRect.left,
                top: objRect.top - parentRect.top
            };
        }
        var parentOffsetX = parent ? Alert.safeGlobal(parent, 'offsetLeft', globalx) : 0;
        var parentOffsetY = parent ? Alert.safeGlobal(parent, 'offsetTop', globaly) : 0;
        var globalCenterX = obj ? Alert.safeGlobal(obj, 'offsetLeft', globalx) + ((obj.offsetWidth || 0) / 2) : 0;
        var globalTop = obj ? Alert.safeGlobal(obj, 'offsetTop', globaly) : 0;
        return {
            centerX: globalCenterX - parentOffsetX,
            top: globalTop - parentOffsetY
        };
    }

    static safeGlobal (element, offsetProp, fn) {
        if (!element) {
            return 0;
        }
        var offsetValue = element[offsetProp] || 0;
        return fn(element, offsetValue);
    }

    static getScaledBubbleWidth (w, scale) {
        return (w + 7 * 2 + 4) * scale;
    }
}
