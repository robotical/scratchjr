import ScratchJr from '../ScratchJr';
import Project from '../ui/Project';
import Thumbs from '../ui/Thumbs';
import UI from '../ui/UI';
import Sprite from './Sprite';
import Palette from '../ui/Palette';
import BlockSpecs from '../blocks/BlockSpecs';
import OS from '../../tablet/OS';
import IO from '../../tablet/IO';
import MediaLib from '../../tablet/MediaLib';
import Undo from '../ui/Undo';
import Matrix from '../../geom/Matrix';
import Vector from '../../geom/Vector';
import {
    newHTML, newDiv, gn,
    setCanvasSizeScaledToWindowDocumentHeight,
    DEGTOR, getIdFor, setProps,
    isTablet
} from '../../utils/lib';

export default class Page {
    constructor(id, data, fcn) {
        var container = ScratchJr.stage.pagesdiv;
        this.div = newHTML('div', 'stagepage', container); // newDiv(container,0,0, 480, 360, {position: 'absolute'});
        this.div.owner = this;
        this.id = id;
        this.textstartat = 36;
        this.div.setAttribute('id', this.id);
        ScratchJr.stage.currentPage = this;
        this.num = data ? data.num : ScratchJr.stage.pages.length + 1;
        this.sprites = JSON.stringify([]);
        this.bkg = newDiv(this.div, 0, 0, 480, 360, {
            position: 'absolute',
            zIndex: '-10',
            background: ScratchJr.stagecolor
        });
        this.bkg.type = 'background';
        ScratchJr.stage.pages.push(this);
        if (!data) {
            this.emptyPage();
        } else {
            this.loadPageData(data, fcn);
        }
    }

    async loadPageData(data, fcn) {
        this.currentSpriteName = data.lastSprite;
        const me = this;
        if (data.textstartat) {
            this.textstartat = Number(data.textstartat);
        }
        if (data.md5 && (data.md5 != 'undefined')) {
            Project.mediaCount++;
            this.setBackground(data.md5, checkBkgDone);
        } else {
            this.clearBackground();
        }
        var list = data.sprites;
        for (var j = 0; j < list.length; j++) {
            Project.recreateObject(this, list[j], data[list[j]], checkCount);
        }
        for (var i = 0; i < data.layers.length; i++) {
            var obj = gn(data.layers[i]);
            if (obj) {
                this.div.appendChild(obj);
            }
        }
        function checkCount() {
            /*MartyMode*/
            // Checkout cb will run when a sprite is added to the page. 
            // When a sprite is added, we check if the current sprite is a marty bird's eye sprite and if so, we enable Marty Mode
            if (me.currentSpriteName && me.currentSpriteName.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                ScratchJr.isMartyModeEnabled = true;
                UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled)
            }
            if (!fcn) {
                return;
            }
            if (Project.mediaCount < 1) {
                fcn();
            }
        }

        function checkBkgDone() {
            Project.substractCount();
            if (!fcn) {
                return;
            }
            if (Project.mediaCount < 1) {
                fcn();
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    emptyPage() {
        this.clearBackground();
        this.createCat();
    }

    setCurrentSprite(spr) { // set the sprite and toggles UI if no sprite is available
        if (ScratchJr.getSprite()) {
            ScratchJr.getSprite().unselect();
        }
        if (spr) {
            this.currentSpriteName = spr.id;
            /*MartyMode*/
            // only set visible if the sprite is not a bird's eye sprite
            if (!spr.name || !spr.name.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                spr.div.style.visibility = 'visible';
            }
            Palette.show();
            gn('scripts').style.display = ScratchJr.inFullscreen ? 'none' : 'block';
            gn('palette').style.display = 'block';
            spr.activate();
        } else {
            this.currentSpriteName = undefined;
            Palette.hide();
            gn('scripts').style.display = 'none';
            gn('palette').style.display = 'none';
        }
    }

    clearBackground() {
        while (this.bkg.childElementCount > 0) {
            this.bkg.removeChild(this.bkg.childNodes[0]);
        }
    }

    setBackground(name, fcn) {
        if (name == 'undefined') {
            return;
        }
        this.clearBackground();
        this.md5 = undefined;
        if (name == 'none') {
            if (fcn) {
                fcn();
            }
            return;
        }
        this.md5 = name;
        if (!name) {
            return;
        }
        var me = this;
        var url = (MediaLib.keys[name]) ?
            MediaLib.path + name :
            (name.indexOf('/') < 0) ? OS.path + name : name;
        var md5 = (MediaLib.keys[name]) ? MediaLib.path + name : name;

        var duplicateBkg = function () {
            var fileName = IO.getFilenameWithExt(md5);
            if (MediaLib.keys[name]) {
                OS.duplicateAsset(md5, fileName);
            } else if (name.indexOf('/') > -1) {
                OS.duplicateAsset(md5, fileName);
                me.md5 = name;
            }
        };

        var isPng = md5.substr(md5.length - 3) == 'png';
        if (isPng && (MediaLib.keys[name] || name.indexOf('/') > -1)) {
            duplicateBkg();
            this.setBackgroundImage(url, fcn);
            this.svg = null;
            return;
        }

        if (md5.indexOf('/') > -1) {
            IO.requestFromServer(md5, doNext);
        } else {
            OS.getmedia(md5, nextStep);
        }
        function nextStep(base64) {
            if (isPng) {
                var data = IO.getImageDataURL(name, base64);
                me.setBackgroundImage(data, fcn);
                me.svg = null;
            } else {
                doNext(atob(base64));
            }
        }
        function doNext(str) {
            duplicateBkg();
            str = str.replace(/>\s*</g, '><');
            me.setSVG(str);
            IO.getImagesInSVG(str, function () {
                var base64 = IO.getImageDataURL(me.md5, btoa(str));
                me.setBackgroundImage(base64, fcn);
            });
        }
    }

    setSVG(str) {
        var xmlDoc = new DOMParser().parseFromString(str, 'text/xml');
        var extxml = document.importNode(xmlDoc.documentElement, true);
        if (extxml.childNodes[0].nodeName == '#comment') {
            extxml.removeChild(extxml.childNodes[0]);
        }
        this.svg = extxml;
    }

    setBackgroundImage(url, fcn) {
        var img = document.createElement('img');
        var me = this;
        var finished = false;
        var loadImgTimeLimit = null;
        var finishLoad = function (loaded) {
            if (finished) {
                return;
            }
            finished = true;
            if (loadImgTimeLimit) {
                clearTimeout(loadImgTimeLimit);
            }
            if (!loaded) {
                me.clearBackground();
            } else if (gn('backdrop').className == 'modal-backdrop fade in') {
                Project.setProgress(Project.getMediaLoadRatio(70));
            }
            if (fcn) {
                fcn();
            }
        };
        img.onload = function () {
            finishLoad(true);
        };
        img.onerror = function () {
            finishLoad(false);
        };
        img.src = url;
        this.bkg.originalImg = img.cloneNode(false);
        this.bkg.appendChild(img);
        setProps(img.style, {
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%'
        });
        this.bkg.img = img;
        if (!img.complete) {
            loadImgTimeLimit = setTimeout(() => {
                // if the bckground img doesnt load within 
                // 5 seconds it means that it doesnt exist
                // so we move on with empty image
                finishLoad(false);
            }, 5000);
        } else {
            finishLoad(img.naturalWidth !== 0 || img.naturalHeight !== 0);
        }
    }

    /*MartyMode*/
    // Method that toggles the visibility of the Marty Bird's Eye sprite and all other sprites in the stage
    toggleMartyBirdsEyeSpriteVisibility(showBirdsEye, martyBirdsEyeSprite) {
        console.log(`Setting visibility of Marty Bird's Eye sprite to: ${showBirdsEye}`);
        console.log(`Setting visibility of all other sprites to: ${!showBirdsEye}`);

        // Check if martyBirdsEyeSprite exists
        if (martyBirdsEyeSprite) {
            martyBirdsEyeSprite.shown = showBirdsEye;
            martyBirdsEyeSprite.homeshown = showBirdsEye;
            martyBirdsEyeSprite.div.style.opacity = showBirdsEye ? '1' : '0';
            martyBirdsEyeSprite.div.style.visibility = showBirdsEye ? 'visible' : 'hidden';
        }

        // Retrieve all sprites on the current page with the texts included
        const allSprites = this.getSprites(true);

        // Loop through each sprite and set visibility based on `showBirdsEye`
        allSprites.forEach(sprite => {
            const spr = this.getSprite(sprite);

            // Set visibility of all other sprites
            if (spr && !sprite.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                spr.shown = !showBirdsEye;
                spr.homeshown = !showBirdsEye;
                spr.div.style.opacity = !showBirdsEye ? '1' : '0';
                spr.div.style.visibility = showBirdsEye ? 'hidden' : 'visible';
            }
        });
    }

    setPageSprites(showstate) {
        if (showstate == 'hidden') {
            var list = JSON.parse(this.sprites);
            for (var i = 0; i < list.length; i++) {
                gn(list[i]).style.visibility = showstate;
            }
            return;
        }
        /*MartyMode*/
        // If the showstate is 'visible', we show the Marty Bird's Eye sprite only if Marty Mode is enabled
        // we show only the marty birds eye sprite and hide all other sprites
        // OR, we show all sprites and hide the marty birds eye sprite
        const martyBirdsEyeSprite = this.getMartyBirdsEyeSprite();
        this.toggleMartyBirdsEyeSpriteVisibility(showstate === 'visible' && ScratchJr.isMartyModeEnabled, martyBirdsEyeSprite);

        // var list = JSON.parse(this.sprites);
        // for (var i = 0; i < list.length; i++) {
        //     console.log("setting sprite", list[i], "to", showstate);
        //     gn(list[i]).style.visibility = showstate;
        // }
    }

    redoChangeBkg(data) {
        var me = this;
        var md5 = data[this.id].md5 ? data[this.id].md5 : 'none';
        this.setBackground(md5, me.updateThumb);
    }

    //////////////////////////////////////
    // page thumbnail
    /////////////////////////////////////

    updateThumb(page) {
        var me = page ? page : ScratchJr.stage.currentPage;
        if (!me.thumbnail) {
            return;
        }
        var c = me.thumbnail.childNodes[0].childNodes[0];
        me.setPageThumb(c);
    }

    pageThumbnail(p) {
        var tb = newHTML('div', 'pagethumb', p);
        tb.setAttribute('id', getIdFor('pagethumb'));
        tb.owner = this.id;
        tb.type = 'pagethumb';
        var container = newHTML('div', 'pc-container', tb);
        var c = newHTML('canvas', 'pc', container);
        this.setPageThumb(c);
        var num = newHTML('div', 'pagenum', tb);
        var pq = newHTML('p', undefined, num);
        pq.textContent = this.num;
        newHTML('div', 'deletethumb', tb);
        if (isTablet) {
            tb.ontouchstart = function (evt) {
                Thumbs.pageMouseDown(evt);
            };
        } else {
            tb.onpointerdown = function (evt) {
                Thumbs.pageMouseDown(evt);
            };
        }
        // tb.ontouchstart = function (evt) {
        //     Thumbs.pageMouseDown(evt);
        // };
        // tb.onmousedown = function (evt) {
        //     Thumbs.pageMouseDown(evt);
        // };
        Thumbs.decoratePageThumb(tb, this);
        this.thumbnail = tb;
        return tb;
    }

    setPageThumb(c) {
        var w0, h0;
        if (window.Settings.edition == 'PBS') {
            w0 = 136;
            h0 = 101;
        } else {
            w0 = 132;
            h0 = 99;
        }
        setCanvasSizeScaledToWindowDocumentHeight(c, w0, h0);
        var w = c.width;
        var h = c.height;
        var ctx = c.getContext('2d');

        if (window.Settings.edition == 'PBS') {

            ctx.rect(0, 0, w, h);
            ctx.fillStyle = '#fff';
            ctx.fill();
        } else {
            ctx.drawImage(BlockSpecs.canvasMask, 0, 0, w, h);
        }
        if (this.bkg.childElementCount > 0) {
            var img = this.bkg.originalImg;
            var imgw = img.naturalWidth ? img.naturalWidth : img.width;
            var imgh = img.naturalHeight ? img.naturalHeight : img.height;
            ctx.drawImage(img, 0, 0, imgw, imgh, 0, 0, w, h);
        }
        var scale = w / 480;
        for (var i = 0; i < this.div.childElementCount; i++) {
            var spr = this.div.childNodes[i].owner;
            if (!spr) {
                continue;
            }
            /*MartyMode*/
            // only print MartyBird's eye sprite if we are in MartyMode,
            // otherwise print all the rest sprites
            if (this.currentSpriteName && this.currentSpriteName.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                if (spr.name?.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                    this.stampSpriteAt(ctx, spr, scale);
                }
            }
            if (this.currentSpriteName && !this.currentSpriteName.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                if (!spr.name || !spr.name.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME)) {
                    this.stampSpriteAt(ctx, spr, scale);
                }
            }
        }
        if (window.Settings.edition != 'PBS') {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(BlockSpecs.canvasMask, 0, 0, w, h);
            ctx.restore();
        }
    }

    stampSpriteAt(ctx, spr, scale) {
        if (!spr.shown) {
            return;
        }
        var img = (spr.type == 'sprite') ? spr.originalImg : spr.outline;
        this.drawSpriteImage(ctx, img, spr, scale);
    }

    drawSpriteImage(ctx, img, spr, scale) {
        if (!spr.shown) {
            return;
        }
        if (!img) {
            return;
        }
        var imgw = img.naturalWidth ? img.naturalWidth : img.width;
        var imgh = img.naturalHeight ? img.naturalHeight : img.height;
        var sw = imgw * spr.scale;
        var sh = imgh * spr.scale;
        ctx.save();
        var pt = {
            x: spr.cx * spr.scale * scale,
            y: spr.cy * spr.scale * scale
        };
        ctx.translate(pt.x, pt.y);
        ctx.rotate(spr.angle * DEGTOR);
        ctx.translate(-pt.x, -pt.y);
        if (spr.flip) {
            ctx.scale(-1, 1);
            ctx.translate(-img.width * scale * spr.scale, 0);
        }
        var mtx = this.getMatrixFor(spr, scale);
        var pos = Vector.floor(mtx.transformPoint({
            x: Math.floor(spr.screenLeft() * scale),
            y: Math.floor(spr.screenTop() * scale)
        }));
        ctx.drawImage(img, 0, 0, imgw, imgh, pos.x, pos.y, Math.floor(sw * scale), Math.floor(sh * scale));
        ctx.restore();
    }

    getMatrixFor(spr) {
        var sx = new Matrix();
        var angle = spr.angle ? -spr.angle : 0;
        if (spr.flip) {
            sx.a = -1;
            sx.d = 1;
        }
        var rx = new Matrix();
        rx.rotate(angle);
        return sx.multiply(rx);
    }

    /////////////////////
    // Saving
    /////////////////////

    encodePage() {
        var p = this.div;
        var spritelist = JSON.parse(this.sprites);
        var data = {};
        data.textstartat = this.textstartat;
        data.sprites = spritelist;
        var md5 = this.md5;
        if (md5) {
            data.md5 = md5;
        }
        data.num = this.num;
        this.currentSpriteName = !this.currentSpriteName ?
            undefined : (gn(this.currentSpriteName).owner.type == 'sprite') ?
                this.currentSpriteName : this.getSprites()[0];
        data.lastSprite = this.currentSpriteName;
        for (var j = 0; j < spritelist.length; j++) {
            data[spritelist[j]] = Project.encodeSprite(spritelist[j]);
        }
        var layers = [];
        for (var i = 1; i < p.childElementCount; i++) {
            var layerid = p.childNodes[i].id;
            if (layerid && (layerid != '')) {
                layers.push(layerid);
            }
        }
        data.layers = layers;
        return data;
    }

    getSprites(textsIncluded = false) {
        var spritelist = JSON.parse(this.sprites);
        var res = [];
        for (var i = 0; i < spritelist.length; i++) {
            if (!textsIncluded) {
                if (gn(spritelist[i]).owner.type == 'sprite') {
                    res.push(spritelist[i]);
                }
            } else {
                res.push(spritelist[i]);
            }
        }
        return res;
    }

    getSprite(spriteName) {
        if (!gn(spriteName)) {
            return undefined;
        }
        return gn(spriteName).owner;
    }

    getMartyBirdsEyeSprite() {
        /*MartyMode*/
        // get Marty Bird's Eye sprite of the current page
        const allPageSprites = this.getSprites();
        const martyBirdsEyeSprite = allPageSprites.find(sprite => sprite.includes(ScratchJr.BIRDS_EYE_SPRITE_NAME));
        if (martyBirdsEyeSprite) {
            return this.getSprite(martyBirdsEyeSprite);
        }
    }



    /////////////////////////////
    // Object creation
    /////////////////////////////

    createText() {
        var textAttr = {
            shown: true,
            type: 'text',
            scale: 1,
            defaultScale: 1,
            speed: 2,
            dirx: 1,
            diry: 1,
            angle: 0,
            homex: 240,
            homey: this.textstartat,
            xcoor: 240,
            ycoor: this.textstartat,
            str: '',
            color: BlockSpecs.fontcolors[BlockSpecs.fontcolors.length - 1],
            fontsize: 36,
            cx: 0,
            cy: (32 * 1.35 / 2),
            w: 0,
            h: 36 * 1.35
        };
        textAttr.page = this;
        textAttr.id = getIdFor('Text');
        console.log("Creating text with id", textAttr.id);
        new Sprite(textAttr);
    }

    async createCat() {
        var sprAttr = UI.mascotData(ScratchJr.stage.currentPage);
        Project.mediaCount++;
        var me = this;
        const preserveMartyMode = ScratchJr.isMartyModeEnabled;
        me.preserveMartyModeOnPageCreate = preserveMartyMode;
        /*MartyMode*/
        // if Marty Bird's Eye sprite exists, add just the cat sprite
        // if (this.getMartyBirdsEyeSprite()) {
        // if Marty Bird's Eye sprite exists, add just the cat sprite
        // new Sprite(sprAttr, me.pageAdded);
        // } else { // if Marty Bird's Eye sprite doesn't exist, add it and when it's added, add the cat sprite
        this.addSprite(0.5, "MartyBirdsEye.svg", ScratchJr.BIRDS_EYE_SPRITE_NAME, (spr) => {
            if (!preserveMartyMode) {
                // keep existing behavior when creating a page from sprite mode
                ScratchJr.isMartyModeEnabled = false;
                UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled);
            }
            new Sprite(sprAttr, me.pageAdded);
            me.martyBirdsEyeSpriteAdded(spr);
        });
        // }
    }

    update(spr) {
        if (spr) {
            Undo.record({
                action: 'modify',
                where: this.id,
                who: spr.id
            });
        } else {
            Undo.record({
                action: 'recreatepage',
                where: this.id,
                who: this.id
            });
        }
        if (spr) {
            Thumbs.updateSprite(spr);
        } else {
            Thumbs.updateSprites();
        }
        Thumbs.updatePages();
    }

    updateBkg() {
        var me = ScratchJr.stage.currentPage;
        ScratchJr.storyStart('Page.prototype.updateBkg');
        Undo.record({
            action: 'changebkg',
            where: me.id,
            who: me.id
        });
        Thumbs.updatePages();
    }

    spriteAdded(spr) {
        if (spr.name !== ScratchJr.BIRDS_EYE_SPRITE_NAME) {
            /*MartyMode*/
            ScratchJr.isMartyModeEnabled = false;
            UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled)
        }
        var me = spr.div.parentNode.owner;
        me.setCurrentSprite(spr);
        me.update(spr);
        UI.spriteInView(spr);
        ScratchJr.onHold = false;
    }

    martyBirdsEyeSpriteAdded(spr) {
        try {
            var me = spr.div.parentNode.owner;
            me.update(spr);
            var currentSprite = ScratchJr.getSprite();
            if (currentSprite && currentSprite !== spr) {
                currentSprite.unselect();
            }
            spr.shown = false;
        } finally {
            ScratchJr.onHold = false;
        }
    }

    pageAdded(spr) {
        var me = spr.div.parentNode.owner;
        Project.mediaCount--;
        me.setCurrentSprite(spr);
        ScratchJr.storyStart('Page.prototype.pageAdded');
        if (ScratchJr.stage.pages.length > 1) {
            Undo.record({
                action: 'addpage',
                where: me.id,
                who: me.id
            });
        }
        Thumbs.updateSprites();
        Thumbs.updatePages();
        if (me.preserveMartyModeOnPageCreate) {
            // Re-apply mode after page setup so adding a page does not flip modes.
            ScratchJr.isMartyModeEnabled = true;
            UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled);
        }
        me.preserveMartyModeOnPageCreate = false;
    }

    addSprite(scale, md5, cname, fcn) {
        ScratchJr.onHold = true;
        var sprAttr = {
            flip: false,
            angle: 0,
            shown: true,
            type: 'sprite',
            scale: scale,
            defaultScale: scale,
            speed: 2,
            dirx: 1,
            diry: 1,
            sounds: ['pop.mp3'],
            homex: 240,
            homescale: scale,
            homey: 180,
            xcoor: 240,
            ycoor: 180,
            homeshown: true,
        };
        sprAttr.page = ScratchJr.stage.currentPage;
        sprAttr.id = getIdFor(cname);
        sprAttr.name = cname;
        sprAttr.md5 = md5;
        new Sprite(sprAttr, fcn || this.spriteAdded);
    }

    createSprite(data) {
        new Sprite(data, this.spriteAdded);
    }

    modifySprite(md5, cid, sid) {
        var sprite = gn(unescape(sid)).owner;
        if (!sprite) {
            sprite = ScratchJr.getSprite();
        }
        sprite.md5 = md5;
        sprite.name = cid;
        var me = this;
        sprite.getAsset(gotImage);
        function gotImage(dataurl) {
            sprite.setCostume(dataurl, me.spriteAdded);
        }
    }

    modifySpriteName(cid, sid) {
        var sprite = gn(unescape(sid)).owner;
        if (!sprite) {
            sprite = ScratchJr.getSprite();
        }
        sprite.name = cid;
        sprite.thumbnail.childNodes[1].textContent = cid;
        Undo.record({
            action: 'modify',
            where: this.id,
            who: sprite.id
        });
        ScratchJr.storyStart('Page.prototype.modifySpriteName');
    }
}
