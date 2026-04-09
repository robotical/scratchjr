//////////////////////////////////////
//   Pages
/////////////////////////////////////

import ScratchJr from '../ScratchJr';
import Palette from './Palette';
import Page from '../engine/Page';
import ScriptsPane from './ScriptsPane';
import Undo from './Undo';
import UI from './UI';
import OS from '../../tablet/OS';
import Events from '../../utils/Events';
import Localization from '../../utils/Localization';
import ScratchAudio from '../../utils/ScratchAudio';
import {
    makeSemanticButton,
    moveFocusByKey,
    setAccessibleName,
    setPressedState,
    setSelectedState
} from '../../utils/accessibility';
import {
    frame, gn, localx, newHTML, newButton, scaleMultiplier, getIdFor,
    isTablet, newImage, localy, setProps
} from '../../utils/lib';

let caret = undefined;

export default class Thumbs {
    static getVisibleFocusableChildren(containerId) {
        var container = gn(containerId);
        if (!container) {
            return [];
        }
        return Array.from(container.childNodes).filter((element) => {
            if (!element || !element.matches) {
                return false;
            }
            if (element.getAttribute('role') !== 'button') {
                return false;
            }
            var style = window.getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
    }

    static getPageThumbLabel(pageNumber) {
        return Localization.localize('BLOCK_DESC_GO_TO_PAGE', {
            PAGE: pageNumber
        });
    }

    static getSpriteThumbLabel(spriteName) {
        return Localization.localize('LIBRARY_CHARACTER') + ' ' + spriteName;
    }

    static focusWhenAvailable(selector, fallbackSelector) {
        window.setTimeout(function () {
            var target = document.querySelector(selector);
            if (!target && fallbackSelector) {
                target = document.querySelector(fallbackSelector);
            }
            if (target) {
                target.focus();
            }
        }, 0);
    }

    static getDeletePageLabel(pageNumber) {
        return Localization.localize('A11Y_DELETE_PAGE', {
            PAGE: pageNumber
        });
    }

    static getMovePageEarlierLabel(pageNumber) {
        return Localization.localize('A11Y_MOVE_PAGE_EARLIER', {
            PAGE: pageNumber
        });
    }

    static getMovePageLaterLabel(pageNumber) {
        return Localization.localize('A11Y_MOVE_PAGE_LATER', {
            PAGE: pageNumber
        });
    }

    static getCopyToPageLabel(pageNumber) {
        return Localization.localize('A11Y_COPY_TO_PAGE', {
            PAGE: pageNumber
        });
    }

    static decoratePageThumb(tb, page) {
        if (!tb) {
            return;
        }
        tb.setAttribute('data-owner', page.id);
        makeSemanticButton(tb, {
            label: Thumbs.getPageThumbLabel(page.num),
            onActivate: function (event) {
                Thumbs.clickOnPage(event, tb.owner);
            }
        });
        tb.onkeydown = Thumbs.handlePageThumbKeyDown;
        if (!ScratchJr.isEditable()) {
            return;
        }
    }

    static decorateEmptyPageThumb(tb) {
        if (!tb) {
            return;
        }
        makeSemanticButton(tb, {
            label: Localization.localize('A11Y_ADD_PAGE'),
            onActivate: Thumbs.clickOnEmptyPage
        });
        tb.onkeydown = Thumbs.handlePageThumbKeyDown;
    }

    static refreshSpriteThumbAccessibility(tb, spr) {
        if (!tb || !spr) {
            return;
        }
        setAccessibleName(tb, Thumbs.getSpriteThumbLabel(spr.name));
    }

    static decorateSpriteThumb(tb, spr) {
        if (!tb || !spr) {
            return;
        }
        tb.setAttribute('data-owner', spr.id);
        makeSemanticButton(tb, {
            label: Thumbs.getSpriteThumbLabel(spr.name),
            onActivate: function (event) {
                Thumbs.clickOnSprite(event, tb);
            }
        });
        tb.onkeydown = Thumbs.handleSpriteThumbKeyDown;
        setPressedState(tb, false);
    }

    static handlePageThumbKeyDown(event) {
        if (!event || !event.currentTarget) {
            return;
        }
        var currentTarget = event.currentTarget;
        var pageId = currentTarget.getAttribute('data-owner');
        if (ScratchJr.isEditable() && pageId) {
            if ((event.key == 'Delete') || (event.key == 'Backspace')) {
                Thumbs.deletePageAction(event, pageId);
                return;
            }
            if (event.shiftKey && ((event.key == 'ArrowLeft') || (event.key == 'ArrowUp'))) {
                Thumbs.movePageBy(event, pageId, -1);
                return;
            }
            if (event.shiftKey && ((event.key == 'ArrowRight') || (event.key == 'ArrowDown'))) {
                Thumbs.movePageBy(event, pageId, 1);
                return;
            }
            if ((event.key.toLowerCase() == 'c') && Thumbs.canCopyCurrentSpriteToPage(pageId)) {
                Thumbs.copyCurrentSpriteToPage(event, pageId);
                return;
            }
        }
        moveFocusByKey(event, Thumbs.getVisibleFocusableChildren('pagecc'), currentTarget, {
            horizontal: true,
            vertical: true
        });
    }

    static handleSpriteThumbKeyDown(event) {
        if (moveFocusByKey(event, Thumbs.getVisibleFocusableChildren('spritecc'), event.currentTarget, {
            horizontal: true,
            vertical: true
        })) {
            return;
        }
        if (!ScratchJr.isEditable()) {
            return;
        }
        if ((event.key != 'Delete') && (event.key != 'Backspace')) {
            return;
        }
        var spriteId = event.currentTarget ? event.currentTarget.getAttribute('data-owner') : undefined;
        if (!spriteId || !gn(spriteId)) {
            return;
        }
        Thumbs.deleteSpriteAction(event, spriteId);
    }

    static updatePages() {
        var pthumbs = gn('pagecc');
        while (pthumbs.childElementCount > 0) {
            pthumbs.removeChild(pthumbs.childNodes[0]);
        }
        var prev = undefined;
        for (var i = 0; i < ScratchJr.stage.pages.length; i++) {
            var page = ScratchJr.stage.pages[i];
            page.num = i + 1;
            var th = page.pageThumbnail(pthumbs);
            th.prev = prev;
            if (prev) {
                prev.next = th;
            }
            if (page.id == ScratchJr.stage.currentPage.id) {
                Thumbs.highlighPage(th);
            } else {
                Thumbs.unhighlighPage(th);
            }
            ScriptsPane.updateScriptsPageBlocks(JSON.parse(page.sprites));
            prev = th;
        }
        if ((ScratchJr.stage.pages.length > 3) || !ScratchJr.isEditable()) {
            return;
        }
        var ep = Thumbs.emptyPage(pthumbs);
        ep.prev = prev;
        th.next = ep;
    }

    static getObjectFor(div, id) {
        for (var i = 0; i < div.childElementCount; i++) {
            if (div.childNodes[i].owner == id) {
                return div.childNodes[i];
            }
        }
        return div.childNodes[0];
    }

    static getType(div, str) {
        while (div != null) {
            if (div.type == str) {
                return div;
            }
            div = div.parentNode;
        }
        return null;
    }

    static pageMouseDown(e) {
        if (e.touches && (e.touches.length > 1)) {
            return;
        }
        if (ScratchJr.onHold) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (window.event) {
            Thumbs.t = window.event.srcElement;
        } else {
            Thumbs.t = e.target;
        }
        var tb = Thumbs.getType(Thumbs.t, 'pagethumb');
        if (ScratchJr.shaking && (e.target.className == 'deletethumb')) {
            ScratchJr.clearSelection();
            OS.analyticsEvent('editor', 'delete_scene');
            ScratchJr.stage.deletePage(tb.owner);
            return;
        }
        if (ScratchJr.shaking) {
            ScratchJr.clearSelection();
            return;
        }
        if (!tb) {
            return;
        }
        if (!ScratchJr.isEditable() || (gn('pagecc').childElementCount < 3)) {
            Thumbs.clickOnPage(e, tb.owner);
        } else {
            Events.startDrag(e, tb, Thumbs.prepareToDragPage, Thumbs.dropPage, Thumbs.draggingPage,
                Thumbs.clickPage, Thumbs.startPageShaking);
        }
    }

    static prepareToDragPage(e) {
        e.preventDefault();
        e.stopPropagation();
        ScratchAudio.sndFX('grab.wav');
        var pt = Events.getTargetPoint(e);
        Events.dragmousex = pt.x;
        Events.dragmousey = pt.y;
        var mx = Events.dragmousex - frame.offsetLeft - localx(Events.dragthumbnail, Events.dragmousex);
        var my = Events.dragmousey - frame.offsetTop - localy(Events.dragthumbnail, Events.dragmousey);
        var mstyle = {
            position: 'absolute',
            left: '0px',
            top: '0px',
            zIndex: ScratchJr.dragginLayer
        };
        Events.dragcanvas = Events.dragthumbnail;
        setProps(Events.dragcanvas.style, mstyle);
        Events.move3D(Events.dragcanvas, mx, my);
        frame.appendChild(Events.dragcanvas);
        caret = newHTML('div', 'pagethumb caret', gn('pagecc'));
        caret.prev = Events.dragthumbnail.prev;
        caret.next = Events.dragthumbnail.next;
        if (Events.dragthumbnail.prev) {
            (Events.dragthumbnail.prev).next = caret;
        }
        if (Events.dragthumbnail.next) {
            (Events.dragthumbnail.next).prev = caret;
        }
        Thumbs.layoutPages();
        Events.dragthumbnail.pos = Thumbs.getPagePos(Events.dragcanvas.top);
    }

    static layoutPages() {
        var thispage = Thumbs.findFirst();
        var p = gn('pagecc');
        while (thispage) {
            p.appendChild(thispage);
            thispage = thispage.next;
        }
    }

    static findFirst() {
        var kid = gn('pagecc').childNodes[0];
        while (kid.prev) {
            kid = kid.prev;
        }
        return kid;
    }

    static findLast() {
        var kid = gn('pagecc').childNodes[0];
        while (kid.next) {
            kid = kid.next;
        }
        return kid;
    }

    static getPageOrder() {
        var page = Thumbs.findFirst();
        var res = [];
        while (page) {
            var pagename = page.owner;
            if (pagename) {
                res.push(gn(pagename).owner);
            }
            page = page.next;
        }
        return res;
    }

    static draggingPage(e, el) {
        e.preventDefault();
        var pt = Events.getTargetPoint(e);
        var dx = pt.x - Events.dragmousex;
        var dy = pt.y - Events.dragmousey;
        Events.move3D(el, dx, dy);
        if (!caret) {
            return;
        }
        Thumbs.removeCaret();
        Thumbs.insertCaret(el);
        Thumbs.layoutPages();
    }

    static removeCaret() {
        var myprev = caret.prev;
        var mynext = caret.next;
        if (myprev) {
            myprev.next = mynext;
        }
        if (mynext) {
            mynext.prev = myprev;
        }
        caret.prev = undefined;
        caret.next = undefined;
        var p = caret.parentNode;
        if (p) {
            p.removeChild(caret);
        }
    }

    static insertCaret(el) {
        var pos = Thumbs.getPagePos(el.top);
        Thumbs.positionMe(pos, caret);
        gn('pagecc').appendChild(caret);
    }

    static getPagePos(dy) {
        var delta = gn('pagecc').childNodes[1].offsetTop - gn('pagecc').childNodes[0].offsetTop;
        var pos = Math.floor(localy(gn('pagecc'), dy + (delta / 2)) / delta);
        pos = Math.max(0, pos);
        var max = Thumbs.getPageOrder().length;
        return Math.min(max, pos);
    }

    static positionMe(pos, elem) {
        var beforewho = pos >= gn('pagecc').childElementCount ? undefined : gn('pagecc').childNodes[pos];
        if (!beforewho) {
            var last = Thumbs.findLast();
            last.next = elem;
            elem.prev = last;
            elem.next = undefined;
        } else {
            var prev = beforewho.prev;
            beforewho.prev = elem;
            elem.next = beforewho;
            if (prev) {
                prev.next = elem;
                elem.prev = prev;
            }
        }
    }

    static repositionThumb(thumb, dy) {
        var pos = Thumbs.getPagePos(dy);
        if (pos != thumb.pos) {
            ScratchAudio.sndFX('snap.wav');
        }
        var myprev = thumb.prev;
        var mynext = thumb.next;
        if (myprev) {
            myprev.next = mynext;
        }
        if (mynext) {
            mynext.prev = myprev;
        }
        Thumbs.positionMe(pos, thumb);
    }

    static dropPage(e) {
        ScratchJr.storyStart('Thumbs.dropPage');
        e.preventDefault();
        if (!caret) {
            return;
        }
        Events.dragthumbnail.prev = caret.prev;
        Events.dragthumbnail.next = caret.next;
        if (Events.dragthumbnail.prev) {
            (Events.dragthumbnail.prev).next = Events.dragthumbnail;
        }
        if (Events.dragthumbnail.next) {
            (Events.dragthumbnail.next).prev = Events.dragthumbnail;
        }
        if (caret.parentNode) {
            caret.parentNode.removeChild(caret);
        }
        caret = undefined;
        Events.dragthumbnail.style.position = '';
        Events.dragthumbnail.style.left = '';
        Events.dragthumbnail.style.top = '';
        Events.dragthumbnail.style.webkitTransform = '';
        var oldpos = Number(Events.dragthumbnail.childNodes[1].childNodes[0].textContent) - 1;
        var oldpage = Events.dragthumbnail.owner;
        Thumbs.repositionThumb(Events.dragthumbnail, Events.dragthumbnail.top);
        var oldlist = ScratchJr.stage.getPagesID();
        ScratchJr.stage.pages = Thumbs.getPageOrder();
        Thumbs.layoutPages();
        Thumbs.updatePages();
        ScratchJr.stage.renumberPageBlocks(oldlist);
        if (Palette.numcat == 5) {
            Palette.selectCategory(5);
        }
        if (Thumbs.getPageOrder()[oldpos].id != oldpage) {
            Undo.record({
                action: 'pageorder',
                who: oldpage,
                where: oldpage
            });
        }
    }

    static clickPage(e) {
        ScratchJr.clearSelection();
        Thumbs.clickOnPage(e, Events.dragthumbnail.owner);
        Events.clearEvents();
        Events.dragthumbnail = undefined;
    }

    static clickOnPage(e, pagename) {
        ScratchJr.unfocus(e);
        var pthumbs = gn('pagecc');
        for (var i = 0; i < pthumbs.childElementCount; i++) {
            var thumb = pthumbs.childNodes[i];
            if (thumb.id == 'emptypage') {
                continue;
            }
        }
        if (ScratchJr.stage.currentPage.id == pagename) {
            return;
        }
        var page = gn(pagename).owner;
        ScratchJr.stage.setPage(page, false);
        Undo.record({
            action: 'changepage',
            who: pagename,
            where: pagename
        });
    }

    static movePageBy(event, pageId, delta) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        var oldlist = ScratchJr.stage.getPagesID();
        var oldIndex = oldlist.indexOf(pageId);
        if (oldIndex < 0) {
            return;
        }
        var newIndex = Math.max(0, Math.min(ScratchJr.stage.pages.length - 1, oldIndex + delta));
        if (newIndex === oldIndex) {
            return;
        }
        var movedPage = ScratchJr.stage.pages.splice(oldIndex, 1)[0];
        ScratchJr.stage.pages.splice(newIndex, 0, movedPage);
        ScratchAudio.sndFX('snap.wav');
        Thumbs.updatePages();
        ScratchJr.stage.renumberPageBlocks(oldlist);
        if (Palette.numcat == 5) {
            Palette.selectCategory(5);
        }
        Undo.record({
            action: 'pageorder',
            who: pageId,
            where: pageId
        });
        Thumbs.focusWhenAvailable('.pagethumb[data-owner="' + pageId + '"]', '#emptypage');
    }

    static deletePageAction(event, pageId) {
        event.preventDefault();
        event.stopPropagation();
        ScratchJr.clearSelection();
        OS.analyticsEvent('editor', 'delete_scene');
        ScratchJr.stage.deletePage(pageId);
        Thumbs.focusWhenAvailable('#pagecc .pagethumb[aria-current="page"]', '#pagecc .pagethumb');
    }

    static copyCurrentSpriteToPage(event, pageId) {
        event.preventDefault();
        event.stopPropagation();
        if (!Thumbs.canCopyCurrentSpriteToPage(pageId)) {
            return;
        }
        var currentSprite = ScratchJr.getSprite();
        var thumb = Thumbs.getObjectFor(gn('pagecc'), pageId);
        if (!thumb) {
            return;
        }
        ScratchJr.clearSelection();
        ScratchJr.stage.copySprite({
            owner: currentSprite.id
        }, thumb);
        Thumbs.focusWhenAvailable('.pagethumb[data-owner="' + pageId + '"]', '#emptypage');
    }

    static canCopyCurrentSpriteToPage(pageId) {
        var currentSprite = ScratchJr.getSprite();
        return Boolean(
            currentSprite &&
            currentSprite.type == 'sprite' &&
            pageId &&
            pageId != ScratchJr.stage.currentPage.id
        );
    }


    static startPageShaking(tb) {
        ScratchJr.shaking = tb;
        ScratchJr.stopShaking = Thumbs.stopPageShaking;
        var cc = tb.getAttribute('class');
        tb.setAttribute('class', cc + ' shakeme');
        tb.childNodes[tb.childElementCount - 1].style.visibility = 'visible';
    }


    static stopPageShaking(b) {
        ScratchJr.shaking = undefined;
        ScratchJr.stopShaking = undefined;
        var cc = b.getAttribute('class');
        cc = cc.substr(0, cc.length - 8);
        b.setAttribute('class', cc);
        b.childNodes[b.childElementCount - 1].style.visibility = 'hidden';
    }

    static emptyPage(p) {
        var tb = newHTML('div', 'pagethumb', p);
        var c = newHTML('div', 'empty', tb);
        var img;
        if (window.Settings.edition == 'PBS') {
            img = newImage(c, 'assets/ui/newpage.svg');
        } else {
            img = newImage(c, 'assets/ui/newpage.png', {
                position: 'absolute'
            });
        }
        img.alt = '';
        img.setAttribute('class', 'unselectable');
        tb.setAttribute('id', 'emptypage');
        tb.onclick = function (evt) {
            Thumbs.clickOnEmptyPage(evt);
        };
        Thumbs.decorateEmptyPageThumb(tb);
        return tb;
    }

    static clickOnEmptyPage(e) {
        if (isTablet && e.touches && (e.touches.length > 1)) {
            return;
        }
        ScratchAudio.sndFX('tap.wav');
        e.preventDefault();
        ScratchJr.stage.currentPage.div.style.visibility = 'hidden';
        ScratchJr.stage.currentPage.setPageSprites('hidden');
        var sc = gn(ScratchJr.stage.currentPage.currentSpriteName + '_scripts');
        if (sc) {
            sc.owner.deactivate();
        }
        ScratchJr.unfocus(e);
        OS.analyticsEvent('editor', 'add_scene');
        new Page(getIdFor('page'));
    }

    static highlighPage(page) {
        page.setAttribute('class', 'pagethumb on');
        setSelectedState(page, true);
    }

    static unhighlighPage(page) {
        page.setAttribute('class', 'pagethumb off');
        setSelectedState(page, false);
    }

    static overpage(page) {
        page.setAttribute('class', 'pagethumb drop');
    }

    //////////////////////////////////////
    //   Library
    /////////////////////////////////////

    static updateSprites() {
        var costumes = gn('spritecc');
        costumes.style.top = '0px';
        while (costumes.childElementCount > 0) {
            costumes.removeChild(costumes.childNodes[0]);
        }
        var sprites = JSON.parse(ScratchJr.stage.currentPage.sprites);
        for (var i = 0; i < sprites.length; i++) {
            var s = gn(sprites[i]);
            if (!s) {
                continue;
            }
            var spr = s.owner;
            if (spr.type != 'sprite') {
                continue;
            }
            var th = spr.spriteThumbnail(costumes);
            if (spr.id == ScratchJr.stage.currentPage.currentSpriteName) {
                if (th) Thumbs.highlighSprite(th);
            } else {
                if (th) Thumbs.unhighlighSprite(th);
            }
        }
        if (!ScratchJr.getSprite()) {
            ScratchJr.stage.currentPage.setCurrentSprite(undefined);
        }
        UI.resetSpriteLibrary();
    }

    static updateSprite(spr) {
        if (!spr) {
            return;
        }
        if (spr.thumbnail) {
            spr.updateSpriteThumb();
        } else {
            var costumes = gn('spritecc');
            if (spr.type != 'sprite') {
                return;
            }
            spr.spriteThumbnail(costumes);
            Thumbs.selectThisSprite(spr);
            UI.resetSpriteLibrary();
        }
    }

    /////////////////////////////////////////////
    //  Sprite Thumbnails
    ////////////////////////////////////////////

    static startDragThumb(e, tb) {
        if (ScratchJr.shaking && (e.target.id == 'deletespritethumb')) {
            ScratchJr.clearSelection();
            ScratchJr.stage.removeSprite(gn(tb.owner).owner);
        }
        if (ScratchJr.shaking) {
            ScratchJr.clearSelection();
        }
        if (!ScratchJr.isEditable()) {
            Thumbs.clickOnSprite(e, tb);
        } else {
            Events.startDrag(e, tb, Thumbs.prepareToDrag, Thumbs.drop,
                Thumbs.dragging, Thumbs.click, Thumbs.startCharShaking);
        }
    }

    static startCharShaking(tb) {
        if (!tb) {
            return;
        }
        ScratchJr.shaking = tb;
        ScratchJr.stopShaking = Thumbs.stopCharShaking;
        var cc = tb.getAttribute('class');
        tb.setAttribute('class', cc + ' shakethumb');
        var close = newHTML('div', 'deletespritethumb', tb);
        close.id = 'deletespritethumb';
    }

    static stopCharShaking(b) {
        ScratchJr.shaking = undefined;
        ScratchJr.stopShaking = undefined;
        var cc = b.getAttribute('class');
        cc = cc.substr(0, cc.length - 8);
        b.setAttribute('class', cc);
        var ic = b.childNodes[b.childElementCount - 1];
        if (ic.getAttribute('class') == 'deletespritethumb') {
            b.removeChild(ic);
        }
    }

    static selectThisSprite(spr) {
        var costumes = gn('spritecc');
        var el = spr.thumbnail;
        for (var i = 0; i < costumes.childElementCount; i++) {
            var th = costumes.childNodes[i];
            if (th == el) {
                Thumbs.highlighSprite(el);
            } else {
                Thumbs.unhighlighSprite(th);
            }
        }
    }

    static clickOnSprite(e, el) {
        if (ScratchJr.shaking && (ScratchJr.shaking == el)) {
            ScratchJr.clearSelection();
            ScratchJr.stage.removeSprite(gn(el.owner).owner);
            return;
        }
        var spritename = el.owner;
        if (!gn(spritename)) {
            return;
        }
        ScratchJr.unfocus(e);
        var spr = gn(spritename).owner;
        var page = spr.div.parentNode.owner;

        /*MartyMode*/
        ScratchJr.isMartyModeEnabled = false;
        UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled);

        page.setCurrentSprite(spr);
        Thumbs.selectThisSprite(spr);
    }

    static deleteSpriteAction(event, spriteId) {
        event.preventDefault();
        event.stopPropagation();
        if (!gn(spriteId)) {
            return;
        }
        ScratchJr.clearSelection();
        ScratchJr.stage.removeSprite(gn(spriteId).owner);
        Thumbs.focusWhenAvailable('#spritecc .spritethumb[aria-pressed="true"]', '#addsprite');
    }

    static prepareToDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        ScratchAudio.sndFX('grab.wav');
        var pt = Events.getTargetPoint(e);
        Events.dragmousex = pt.x;
        Events.dragmousey = pt.y;
        Events.dragthumbnail = Thumbs.getObjectFor(gn('spritecc'), Events.dragthumbnail.owner);
        var mx = Events.dragmousex - frame.offsetLeft -
            localx(Events.dragthumbnail, Events.dragmousex) - gn('topsection').offsetLeft;
        var my = Events.dragmousey - frame.offsetTop -
            localy(Events.dragthumbnail, Events.dragmousey) - gn('topsection').offsetTop;
        var sy = Events.dragthumbnail.parentNode.parentNode.scrollTop;
        var sx = Events.dragthumbnail.parentNode.parentNode.scrollLeft;
        my -= sy;
        mx -= sx;
        var mstyle = {
            position: 'absolute',
            left: '0px',
            top: '0px',
            zIndex: ScratchJr.dragginLayer,
            zoom: (100 / window.devicePixelRatio) + '%'
        };
        var spr = gn(Events.dragthumbnail.owner).owner;
        Events.dragcanvas = document.createElement('canvas');
        spr.drawMyImage(Events.dragcanvas,
            76 * scaleMultiplier * window.devicePixelRatio,
            (76 - 12) * scaleMultiplier * window.devicePixelRatio
        );
        setProps(Events.dragcanvas.style, mstyle);
        Events.move3D(Events.dragcanvas, mx * window.devicePixelRatio, my * window.devicePixelRatio);
        Events.dragcanvas.owner = Events.dragthumbnail.owner;
        frame.appendChild(Events.dragcanvas);
    }

    static dragging(e, el) {
        e.preventDefault();
        var pt = Events.getTargetPoint(e);
        var dx = pt.x - Events.dragmousex;
        var dy = pt.y - Events.dragmousey;
        Events.move3D(el, dx * window.devicePixelRatio, dy * window.devicePixelRatio);
        if (Palette.getLandingPlace(el, e, window.devicePixelRatio) != 'pages') {
            Thumbs.removePagesCaret();
            return;
        }
        var thumb = Palette.getHittedThumb(el, gn('pagecc'), window.devicePixelRatio);
        if (thumb && !thumb.owner) {
            thumb = undefined;
        }
        if (thumb) {
            Thumbs.overpage(thumb);
        }
        for (var i = 0; i < gn('pagecc').childElementCount; i++) {
            var spr = gn('pagecc').childNodes[i];
            if (!spr.owner) {
                continue;
            }
            var page = gn(spr.owner);
            if (thumb && (thumb.id != spr.id)) {
                if (page.owner.id == ScratchJr.stage.currentPage.id) {
                    Thumbs.highlighPage(spr);
                } else {
                    Thumbs.unhighlighPage(spr);
                }
            }
        }
    }

    static removePagesCaret() {
        for (var i = 0; i < gn('pagecc').childElementCount; i++) {
            var spr = gn('pagecc').childNodes[i];
            if (!spr.owner) {
                continue;
            }
            var page = gn(spr.owner);
            if (page.owner.id == ScratchJr.stage.currentPage.id) {
                Thumbs.highlighPage(spr);
            } else {
                Thumbs.unhighlighPage(spr);
            }
        }
    }

    static drop(e, el) {
        e.preventDefault();
        switch (Palette.getLandingPlace(el, e, window.devicePixelRatio)) {
            case 'pages':
                var thumb = Palette.getHittedThumb(el, gn('pagecc'), window.devicePixelRatio);
                if (thumb && thumb.id != 'emptypage') {
                    ScratchJr.stage.copySprite(el, thumb);
                }
                break;
            default:
                break;
        }
        if (Events.dragcanvas) {
            Events.dragcanvas.parentNode.removeChild(Events.dragcanvas);
        }
        Events.dragcanvas = undefined;
    }

    static click(e, el) {
        e.preventDefault();
        e.stopPropagation();
        if (window.event) {
            Thumbs.t = window.event.srcElement;
        } else {
            Thumbs.t = e.target;
        }
        el.setAttribute('class', ScratchJr.isEditable() ? 'spritethumb on' : 'spritethumb noneditable');
        Thumbs.clickOnSprite(e, el);
    }

    static highlighSprite(spr) {
        if (spr.owner.includes('Marty')) { // we don't want to make Marty editable as our svg is can't be edited
            spr.setAttribute('class', 'spritethumb on martynoneditable');
        } else {
            spr.setAttribute('class', ScratchJr.isEditable() ? 'spritethumb on' : 'spritethumb noneditable');
        }
        setPressedState(spr, true);
        ScriptsPane.setActiveScript(spr.owner);
        Palette.reset();
    }

    static unhighlighSprite(spr) {
        spr.setAttribute('class', 'spritethumb off');
        setPressedState(spr, false);
        var currentsc = gn(spr.owner + '_scripts');
        currentsc.owner.deactivate();
        for (var i = 0; i < currentsc.childElementCount; i++) {
            if (currentsc.childNodes[i].owner) {
                currentsc.childNodes[i].owner.unhighlight();
            }
        }
    }

    static quickHighlight(spr) {
        if (spr.owner == ScratchJr.stage.currentPage.currentSpriteName) {
            spr.className = 'spritethumb on target';
        } else {
            spr.className = 'spritethumb off target';
        }
    }

    static quickRestore(spr) {
        if (spr.owner == ScratchJr.stage.currentPage.currentSpriteName) {
            spr.className = ScratchJr.isEditable() ? 'spritethumb on' : 'spritethumb noneditable';
        } else {
            spr.className = 'spritethumb off';
        }
    }
}
