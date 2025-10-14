
import ScratchJr from '../ScratchJr';
import OS from '../../tablet/OS';
import IO from '../../tablet/IO';
import MediaLib from '../../tablet/MediaLib';
import Paint from '../../painteditor/Paint';
import Events from '../../utils/Events';
import Localization from '../../utils/Localization';
import ScratchAudio from '../../utils/ScratchAudio';
import Alert from './Alert';
import {gn, newHTML, scaleMultiplier,
    getDocumentWidth, getDocumentHeight, setProps, newCanvas, frame,
    isTablet} from '../../utils/lib';

let selectedOne;
let nativeJr = true;
let clickThumb;
let shaking;
let type;
let timeoutEvent;
let libFrame;
let headerButtons;
let uploadButton;
let uploadInput;
let pendingSelectId;
let uploadInProgress = false;

export default class Library {
    static init () {
        libFrame = document.getElementById('libframe');
        libFrame.style.minHeight = Math.max(getDocumentHeight(), frame.offsetHeight) + 'px';
        var topbar = newHTML('div', 'topbar', libFrame);
        topbar.setAttribute('id', 'topbar');
        var actions = newHTML('div', 'actions', topbar);
        actions.setAttribute('id', 'libactions');
        var ascontainer = newHTML('div', 'assetname-container', topbar);
        var as = newHTML('div', 'assetname', ascontainer);
        var myname = newHTML('p', undefined, as);
        myname.setAttribute('id', 'assetname');
        myname.textContent = '';
        Library.layoutHeader();
    }

    static createScrollPanel () {
        var inner = newHTML('div', 'innerlibrary', libFrame);
        inner.setAttribute('id', 'asssetsview');
        var div = newHTML('div', 'scrollarea', inner);
        div.setAttribute('id', 'scrollarea');
    }

    static open (libType) {
        type = libType;
        gn('assetname').textContent = '';
        nativeJr = true;
        frame.style.display = 'none';
        libFrame.className = 'libframe appear';
        libFrame.focus();
        selectedOne = undefined;
        gn('okbut').onclick = (type == 'costumes') ? Library.closeSpriteSelection : Library.closeBkgSelection;
        Library.clean();
        Library.createScrollPanel();
    Library.updateUploadVisibility();
        Library.addThumbnails(type);
        window.ontouchstart = undefined;
        window.ontouchend = undefined;
        // window.onmousedown = undefined;
        // window.onmouseup = undefined;

        window.onpointerdown = undefined;
        window.onpointerup = undefined;
        document.ontouchmove = undefined;
        document.onpointermove = undefined;

        // document.onmousemove = undefined;
        window.onresize = undefined;

        gn('library_paintme').style.opacity = 1;
        gn('library_paintme').onclick = Library.editResource;

        // Set the back button callback
        ScratchJr.onBackButtonCallback.push(function () {
            var e = document.createEvent('TouchEvent');
            e.initTouchEvent();
            Library.cancelPick(e);
        });
    }

    static clean () {
        if (gn('scrollarea')) {
            var div = gn('scrollarea').parentNode;
            libFrame.removeChild(div);
        }
    }

    static close (e) {
        e.preventDefault();
        e.stopPropagation();
        ScratchAudio.sndFX('tap.wav');
        ScratchJr.blur();
        libFrame.className = 'libframe disappear';
        document.body.scrollTop = 0;
        frame.style.display = 'block';
        ScratchJr.editorEvents();
        ScratchJr.onBackButtonCallback.pop();
    }

    static layoutHeader () {
        var buttons = newHTML('div', 'bkgbuttons', gn('libactions'));
        headerButtons = buttons;
        var paintme = newHTML('div', 'painticon', buttons);
        paintme.id = 'library_paintme';
        paintme.onclick = Library.editResource;
    uploadButton = newHTML('div', 'uploadicon', buttons);
    uploadButton.id = 'library_upload';
    uploadButton.style.display = 'none';
    uploadButton.onclick = Library.triggerUpload;
    uploadButton.setAttribute('role', 'button');
    uploadButton.setAttribute('aria-label', 'Upload Asset');
    uploadButton.setAttribute('title', 'Upload Asset');
        var okbut = newHTML('div', 'okicon', buttons);
        okbut.setAttribute('id', 'okbut');
        var cancelbut = newHTML('div', 'cancelicon', buttons);
        cancelbut.onclick = Library.cancelPick;
        if (!uploadInput) {
            uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.accept = 'image/png,image/jpeg,image/jpg,image/svg+xml';
            uploadInput.id = 'library_upload_input';
            uploadInput.style.display = 'none';
            uploadInput.addEventListener('change', Library.handleUploadChange);
            libFrame.appendChild(uploadInput);
        }
    }

    static cancelPick (e) {
        ScratchJr.onHold = true;
        Library.close(e);
        setTimeout(function () {
            ScratchJr.onHold = false;
        }, 1000);
    }

    static addThumbnails () {
        var div = gn('scrollarea');
        Library.addEmptyThumb(div, (type == 'costumes') ? (118 * scaleMultiplier) : (120 * scaleMultiplier),
            (type == 'costumes') ? (90 * scaleMultiplier) : (90 * scaleMultiplier));
        var key = (type == 'costumes') ? 'usershapes' : 'userbkgs';
        // Student' assets
        var json = {};
        json.cond = 'ext = ? AND version = ?';
        json.items = ((type == 'costumes') ?
            ['md5', 'altmd5', 'name', 'scale', 'width', 'height'] : ['altmd5', 'md5', 'width', 'height']);
        json.values = ['svg', ScratchJr.version];
        json.order = 'ctime desc';
        IO.query(key, json, Library.displayAssets);
    }

    static skipUserAssets () {
        var div = gn('scrollarea');
        Library.addEmptyThumb(div, (type == 'costumes') ? (118 * scaleMultiplier) : (120 * scaleMultiplier),
            (type == 'costumes') ? (90 * scaleMultiplier) : (90 * scaleMultiplier));
        Library.addHR(div);
        Library.displayLibAssets((type == 'costumes') ? MediaLib.sprites : MediaLib.backgrounds);
    }

    static getpadding (div) {
        var w = Math.min(getDocumentWidth(), libFrame.offsetWidth);
        var dw = div.childNodes[1].offsetLeft - div.childNodes[0].offsetLeft;
        var qty = Math.floor(w / dw);
        var pad = Math.floor((w - (qty * dw)) / 2);
        if (pad < 10) {
            return Math.floor((w - ((qty - 1) * dw)) / 2);
        }
        return pad;
    }

    static displayAssets (str) {
        nativeJr = true;
        var div = gn('scrollarea');
        var data = JSON.parse(str);
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                Library.addAssetThumbChoose(div, data[i], 120 * scaleMultiplier, 90 * scaleMultiplier,
                    Library.selectAsset);
            }
        }
        Library.addHR(div);
        nativeJr = false;
        data = (type == 'costumes') ? MediaLib.sprites : MediaLib.backgrounds;
        Library.displayLibAssets(data);
        Library.applyPendingSelection();
    }

    static displayLibAssets (data) {
        var div = gn('scrollarea');
        if (data.length < 1) {
            return;
        }
        var order = data[0].order;
        var key = order ? order.split(',')[1] : '';
        for (var i = 0; i < data.length; i++) {
            order = data[i].order;
            var key2 = order ? order.split(',')[1] : '';
            if (key2 != key) {
                Library.addHR(div);
                key = key2;
            }
            if ('separator' in data[i]) {
                Library.addHR(div);
            } else {
                Library.addLocalThumbChoose(div, data[i], 120 * scaleMultiplier,
                    90 * scaleMultiplier, Library.selectAsset);
            }
        }
    }

    static addAssetThumbChoose (parent, aa, w, h, fcn) {
        var data = Library.parseAssetData(aa);
        var tb = document.createElement('div');
        parent.appendChild(tb);
        tb.byme = nativeJr ? 1 : 0;
        var md5 = data.md5;
        tb.setAttribute('class', 'assetbox off');
        tb.setAttribute('id', md5);
        tb.scale = (!data.scale) ? 0.5 : data.scale;
        tb.fieldname = data.name;
        tb.w = Number(data.width);
        tb.h = Number(data.height);
        var scale = Math.min(w / tb.w, h / tb.h);
        var img = newHTML('img', undefined, tb);
        img.style.left = (9 * scaleMultiplier) + 'px';
        img.style.top = (7 * scaleMultiplier) + 'px';
        img.style.position = 'relative';
        img.style.height = (data.height * scale) + 'px';
        img.ondragstart = function () {
            return false;
        };
        if (data.altmd5) {
            IO.getAsset(data.altmd5, drawMe);
        }
        function drawMe (dataurl) {
            img.src = dataurl;
        }
        // tb.ontouchstart = function (evt) {
        //     fcn(evt, tb);
        // };
        // tb.onmousedown = function (evt) {
        //     fcn(evt, tb);
        // };
        if (isTablet) {
            tb.ontouchstart = function (evt) {
                fcn(evt, tb);
            };
        } else {
            tb.onpointerdown = function (evt) {
                fcn(evt, tb);
            };
        }
        return tb;
    }

    static addLocalThumbChoose (parent, data, w, h, fcn) {
        var tb = newHTML('div', 'assetbox off', parent);
        var md5 = data.md5;
        tb.byme = nativeJr ? 1 : 0;
        tb.setAttribute('id', md5);
        tb.scale = (!data.scale) ? 0.5 : data.scale;
        tb.fieldname = data.name;
        tb.w = Number(data.width);
        tb.h = Number(data.height);

        /*MartyMode*/
        // if md5 is MartyBirdsEye.svg don't show
        if (md5 == 'MartyBirdsEye.svg') {
            tb.style.display = 'none';
        }

        var img = newHTML('img', undefined, tb);
        var scale = Math.min(w / tb.w, h / tb.h);
        img.style.height = tb.h * scale + 'px';
        img.style.width = tb.w * scale + 'px';

        img.style.left = Math.floor(((w - (scale * tb.w)) / 2) + (9 * scaleMultiplier)) + 'px';
        img.style.top = Math.floor(((h - (scale * tb.h)) / 2) + (9 * scaleMultiplier)) + 'px';
        img.style.position = 'relative';

        // Cached downsized-thumbnails are in pnglibrary
        var pngPath = MediaLib.path.replace('svg', 'png');
        img.src = pngPath + IO.getFilename(md5) + '.png';

        // tb.ontouchstart = function (evt) {
        //     fcn(evt, tb);
        // };
        // tb.onmousedown = function (evt) {
        //     fcn(evt, tb);
        // };
        if (isTablet) {
            tb.ontouchstart = function (evt) {
                fcn(evt, tb);
            };
        } else {
            tb.onpointerdown = function (evt) {
                fcn(evt, tb);
            };
        }
        return tb;
    }

    static userAssetThumbnail (img, cnv, sizew, sizeh) {
        var scale = Math.min(sizew / img.width, sizeh / img.height);
        var currentCtx = cnv.getContext('2d');
        var iw = Math.floor(scale * img.width);
        var ih = Math.floor(scale * img.height);
        var ix = Math.floor((sizew - (scale * img.width)) / 2);
        var iy = Math.floor((sizeh - (scale * img.height)) / 2);
        currentCtx.drawImage(img, 0, 0, img.width, img.height, ix, iy, iw, ih);
    }

    static addEmptyThumb (parent, w, h) {
        var tb = document.createElement('div');
        tb.setAttribute('class', 'assetbox off');
        tb.setAttribute('id', 'none');
        tb.fieldname = ((type == 'costumes') ?
            Localization.localize('LIBRARY_CHARACTER') : Localization.localize('LIBRARY_BACKGROUND'));
        tb.byme = 1;
        var cnv = newCanvas(tb, 9 * scaleMultiplier, 7 * scaleMultiplier, w, h, {
            position: 'relative'
        });
        var ctx = cnv.getContext('2d');
        ctx.fillStyle = ScratchJr.stagecolor;
        ctx.fillRect(0, 0, w, h);
        parent.appendChild(tb);
        // tb.ontouchstart = function (evt) {
        //     Library.selectAsset(evt, tb);
        // };
        // tb.onmousedown = function (evt) {
        //     Library.selectAsset(evt, tb);
        // };
        if (isTablet) {
            tb.ontouchstart = function (evt) {
                Library.selectAsset(evt, tb);
            };
        } else {
            tb.onpointerdown = function (evt) {
                Library.selectAsset(evt, tb);
            };
        }
    }

    static addHR (div) {
        var hr = document.createElement('hr');
        div.appendChild(hr);
        hr.setAttribute('class', 'bigdivide');
    }

    ///////////////////////////
    //selection


    static selectAsset (e, tb) {
        tb.pt = JSON.stringify(Events.getTargetPoint(e));
        if (shaking && (e.target.className == 'deleteasset')) {
            Library.removeFromAssetList();
            return;
        } else if (shaking) {
            Library.stopShaking();
        }
        if (tb.byme && (tb.id != 'none')) {
            holdit(tb);
        }
        tb.ontouchend = function (evt) {
            clickMe(evt, tb);
        };
        // window.onmouseup = function (evt) {
        //     clickMe(evt, tb);
        // };
        // window.onmousemove = function (evt) {
        //     clearEvents(evt, tb);
        // };
        window.onpointerup = function (evt) {
            clickMe(evt, tb);
        };
        window.onpointermove = function (evt) {
            clearEvents(evt, tb);
        };
        function holdit () {
            var repeat = function () {
                tb.ontouchend = undefined;
                // window.onmouseup = undefined;
                // window.onmousemove = undefined;
                window.onpointerup = undefined;
                window.onpointermove = undefined;
                timeoutEvent = undefined;
                Library.stopShaking();
                shaking = tb;
                Library.clearAllSelections();
                Library.startShaking(tb);
            };
            timeoutEvent = setTimeout(repeat, 500);
        }
        function clearEvents (e, tb) {
            var pt = Events.getTargetPoint(e);
            var pt2 = JSON.parse(tb.pt);
            if (Library.distance(pt, pt2) < 30) {
                return;
            }
            e.preventDefault();
            if (timeoutEvent) {
                clearTimeout(timeoutEvent);
            }
            if (clickThumb) {
                Library.unSelect(clickThumb);
            }
            timeoutEvent = undefined;
            tb.ontouchend = undefined;
            // window.onmousemove = undefined;
            // window.onmouseup = undefined;
            window.onpointermove = undefined;
            window.onpointerup = undefined;
        }
        function clickMe (e, tb) {
            if (timeoutEvent) {
                clearTimeout(timeoutEvent);
            }
            Library.selectThisAsset(e, tb);
            timeoutEvent = undefined;
            tb.ontouchend = undefined;
            // tb.onmouseup = undefined;
            // window.onmousemove = undefined;
            // window.onmouseup = undefined;
            tb.onpointerup = undefined;
            window.onpointermove = undefined;
            window.onpointerup = undefined;
        }
    }

    static startShaking (b) {
        b.className = b.className + ' shakeme';
        newHTML('div', 'deleteasset', b);
        shaking = b;
    }

    static stopShaking () {
        if (!shaking) {
            return;
        }
        var b = shaking;
        b.setAttribute('class', 'assetbox off');
        var ic = b.childNodes[b.childElementCount - 1];
        if (ic.getAttribute('class') == 'deleteasset') {
            b.removeChild(ic);
        }
        shaking = undefined;
    }

    static removeFromAssetList () {
        ScratchAudio.sndFX('cut.wav');
        var b = shaking;
        b.parentNode.removeChild(b);
        var key = (type == 'costumes') ? 'usershapes' : 'userbkgs';
        var json = {};
        json.cond = 'md5 = ?';
        json.items = ['*'];
        json.values = [b.id];
        IO.query(key, json, Library.removeAssetFromLib);
        clickThumb = undefined;
        selectedOne = undefined;
        return true;
    }

    // Determine if an asset thumbnail is unique
    // md5: thumbnail md5 to determine uniqueness
    // type: "costumes" or "backgrounds"
    // callback: called with true if unique, false if duplicate exists
    static assetThumbnailUnique (md5, type, callback) {
        var key = (type == 'costumes') ? 'usershapes' : 'userbkgs';
        var json = {};
        json.cond = 'ext = ? AND altmd5 = ?';
        json.items = ['md5', 'altmd5'];
        json.values = ['svg', md5];
        json.order = 'ctime desc';
        IO.query(key, json, function (results) {
            results = JSON.parse(results);
            callback(results.length <= 1);
        });
    }

    static removeAssetFromLib (str) {
        var key = (type == 'costumes') ? 'usershapes' : 'userbkgs';
        var aa = JSON.parse(str)[0];
        var data = Library.parseAssetData(aa);

        if (data.altmd5) {
            // Removes the thumbnail for the asset.
            // First ensure that there aren't other characters/bgs using the same thumb
            // (this is possible if we receive a duplicate project, for example)
            Library.assetThumbnailUnique(data.altmd5, type, function (isUnique) {
                if (isUnique) {
                    OS.remove(data.altmd5, OS.trace);
                }
            });
        }

        IO.deleteobject(key, data.id, OS.trace);
    }

    static parseAssetData (data) {
        var res = new Object();
        for (var key in data) {
            res[key.toLowerCase()] = data[key];
        }
        return res;
    }

    static selectThisAsset (e, tb) {
        if (tb.id == selectedOne) {
            if (type == 'costumes') {
                Library.closeSpriteSelection(e);
            } else {
                Library.closeBkgSelection(e);
            }
        } else {
            Library.clearAllSelections();

            // Disable paint editor for PNG sprites
            var thumbID = tb.id;
            var thumbType = thumbID.substr(thumbID.length - 3);
            if (thumbType == 'png') {
                gn('library_paintme').style.opacity = 0;
                gn('library_paintme').onclick = null;
            } else {
                gn('library_paintme').style.opacity = 1;
                gn('library_paintme').onclick = Library.editResource;
            }

            tb.className = 'assetbox on';
            // to avoid double click
            setTimeout(function () {
                selectedOne = tb.id;
            }, 200);
            clickThumb = tb;
            if (tb.fieldname) {
                gn('assetname').textContent = tb.fieldname;
            }
        }
    }

    static clearAllSelections () {
        var div = gn('scrollarea');
        for (var i = 0; i < div.childElementCount; i++) {
            if (div.childNodes[i].nodeName == 'DIV') {
                div.childNodes[i].className = 'assetbox off';
            }
        }
    }

    static unSelect (tb) {
        gn('assetname').textContent = '';
        tb.className = 'assetbox off';
        selectedOne = undefined;
        if (clickThumb) {
            if (tb.byme && (clickThumb.childElementCount > 1)) {
                clickThumb.childNodes[clickThumb.childElementCount - 1].style.visibility = 'hidden';
            }
            clickThumb = undefined;
        }
    }

    static manualSelect (tb) {
        if (!tb) {
            return;
        }
        Library.clearAllSelections();
        var thumbID = tb.id;
        var thumbType = thumbID.substr(thumbID.length - 3);
        if (thumbType == 'png') {
            gn('library_paintme').style.opacity = 0;
            gn('library_paintme').onclick = null;
        } else {
            gn('library_paintme').style.opacity = 1;
            gn('library_paintme').onclick = Library.editResource;
        }
        tb.className = 'assetbox on';
        selectedOne = tb.id;
        clickThumb = tb;
        if (tb.fieldname) {
            gn('assetname').textContent = tb.fieldname;
        } else {
            gn('assetname').textContent = '';
        }
    }

    static resizeScroll () {
        var w = Math.min(getDocumentWidth(), frame.offsetWidth);
        var h = Math.max(getDocumentHeight(), frame.offsetHeight);
        var dx = w - 20 * scaleMultiplier;
        setProps(gn('scrollarea').style, {
            width: dx + 'px',
            height: (h - 120 * scaleMultiplier) + 'px'
        });
    }

    ///////////////////////////////////////////
    // Object actions
    //////////////////////////////////////////

    static editResource (e) {
        Library.close(e);
        if (type != 'costumes') {
            Library.editBackground(e);
        } else {
            Library.editCostume(e);
        }
    }

    static editBackground () {
        var md5 = selectedOne && (selectedOne != 'none') ? selectedOne : undefined;
        Paint.open(true, md5);
    }

    static editCostume () {
        var sname = undefined;
        var cname = selectedOne ? clickThumb.fieldname : Localization.localize('LIBRARY_CHARACTER');
        var scale = selectedOne && (selectedOne != 'none') ? clickThumb.scale : 0.5;
        var md5 = selectedOne && (selectedOne != 'none') ? selectedOne : undefined;
        var w = selectedOne && (selectedOne != 'none') ? Math.round(clickThumb.w) : undefined;
        var h = selectedOne && (selectedOne != 'none') ? Math.round(clickThumb.h) : undefined;
        Paint.open(false, md5, sname, cname, scale, w, h);
    }

    static closeSpriteSelection (e) {
        e.preventDefault();
        e.stopPropagation();
        var id = selectedOne ? clickThumb.fieldname : Localization.localize('LIBRARY_CHARACTER');
        if (selectedOne && (selectedOne != 'none')) {
            ScratchJr.stage.currentPage.addSprite(clickThumb.scale, selectedOne, id);
        }

        // Prevent reporting user asset names
        if (clickThumb) {
            var analyticsName = clickThumb.id;
            if (!(selectedOne in MediaLib.keys)) {
                analyticsName = 'user_asset';
            }
            OS.analyticsEvent('editor', 'new_character', analyticsName);
        }
        Library.close(e);
    }

    static closeBkgSelection (e) {
        e.preventDefault();
        e.stopPropagation();
        if (selectedOne) {
            ScratchJr.stage.currentPage.setBackground(selectedOne, ScratchJr.stage.currentPage.updateBkg);
        }

        if (clickThumb) {
            var analyticsName = clickThumb.id;
            if (!(selectedOne in MediaLib.keys)) {
                analyticsName = 'user_background';
            }
            OS.analyticsEvent('editor', 'choose_background', analyticsName);
        }
        Library.close(e);
    }

    /////////////////////////////////////////
    //Key Handeling Top Level prevention
    /////////////////////////////////////////

    static distance (pt1, pt2) {
        var dx = pt1.x - pt2.x;
        var dy = pt1.y - pt2.y;
        return Math.round(Math.sqrt((dx * dx) + (dy * dy)));
    }

    /////////////////////////////////////////
    // Background upload support
    /////////////////////////////////////////

    static triggerUpload () {
        if (uploadInProgress) {
            return;
        }
        if (type != 'backgrounds' && type != 'costumes') {
            return;
        }
        ScratchAudio.sndFX('tap.wav');
        if (uploadInput) {
            uploadInput.click();
        }
    }

    static async handleUploadChange (event) {
        if (!event || !event.target) {
            console.error("Invalid upload event");
            return;
        }
        var files = event.target.files;
        if (!files || files.length < 1) {
            console.error("Invalid upload event");
            return;
        }
        if ((type != 'backgrounds') && (type != 'costumes')) {
            console.error('Upload not supported for library type', type);
            return;
        }
        var file = files[0];
        event.target.value = '';
        if (!Library.isValidUpload(file)) {
            Library.showUploadError('Unsupported file type');
            return;
        }
        try {
            uploadInProgress = true;
            Library.updateUploadState(true);
            if (type == 'backgrounds') {
                var result = await Library.importBackgroundFile(file);
                pendingSelectId = result.backgroundMd5;
                Library.reloadAssets();
                // ScratchJr.stage.currentPage.setBackground(result.backgroundMd5, ScratchJr.stage.currentPage.updateBkg);
                Library.showUploadSuccess('Background added');
            } else {
                var sprite = await Library.importSpriteFile(file);
                pendingSelectId = sprite.spriteMd5;
                Library.reloadAssets();
                // ScratchJr.stage.currentPage.addSprite(sprite.scale, sprite.spriteMd5, sprite.name);
                Library.showUploadSuccess('Character added');
            }
        } catch (err) {
            console.error('Asset upload failed', err);
            Library.showUploadError('Upload failed');
        } finally {
            uploadInProgress = false;
            Library.updateUploadState(false);
        }
    }

    static isValidUpload (file) {
        if (!file || !file.name) {
            return false;
        }
        var ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
        return ['png', 'jpg', 'jpeg', 'svg'].indexOf(ext) > -1;
    }

    static updateUploadVisibility () {
        if (!uploadButton || !headerButtons) {
            return;
        }
        var supportsUpload = (type == 'costumes') || (type == 'backgrounds');
        headerButtons.className = (type == 'costumes') ? 'shapebuttons' : 'bkgbuttons';
        if (supportsUpload) {
            uploadButton.style.display = 'inline-block';
            uploadButton.setAttribute('aria-hidden', 'false');
            var ariaLabel = (type == 'costumes') ? 'Upload Character' : 'Upload Background';
            uploadButton.setAttribute('aria-label', ariaLabel);
            uploadButton.setAttribute('title', ariaLabel);
        } else {
            uploadButton.style.display = 'none';
            uploadButton.setAttribute('aria-hidden', 'true');
        }
    }

    static updateUploadState (busy) {
        if (!uploadButton) {
            return;
        }
        if (busy) {
            uploadButton.classList.add('disabled');
            uploadButton.setAttribute('aria-busy', 'true');
        } else {
            uploadButton.classList.remove('disabled');
            uploadButton.removeAttribute('aria-busy');
        }
    }

    static showUploadError (message) {
        if (uploadButton && libFrame) {
            Alert.open(libFrame, uploadButton, message, '#ff5a5f');
        }
    }

    static showUploadSuccess (message) {
        if (uploadButton && libFrame) {
            Alert.open(libFrame, uploadButton, message, '#28A5DA');
        }
    }

    static reloadAssets () {
        Library.clean();
        Library.createScrollPanel();
        Library.addThumbnails(type);
    }

    static applyPendingSelection () {
        if (!pendingSelectId) {
            return;
        }
        var selectId = pendingSelectId;
        var selectLater = function () {
            var tb = document.getElementById(selectId);
            if (tb) {
                Library.manualSelect(tb);
                pendingSelectId = undefined;
            }
        };
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(selectLater);
        } else {
            setTimeout(selectLater, 0);
        }
    }

    static async importBackgroundFile (file) {
        console.log("Importing background file", file);
        var dataUrl = await Library.readFileAsDataURL(file);
        var image = await Library.loadImage(dataUrl);
        var stageWidth = 480;
        var stageHeight = 360;
        var canvas = document.createElement('canvas');
        canvas.width = stageWidth;
        canvas.height = stageHeight;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = ScratchJr.stagecolor || '#FFFFFF';
        ctx.fillRect(0, 0, stageWidth, stageHeight);
        var scale = Math.max(stageWidth / image.width, stageHeight / image.height);
        var drawWidth = image.width * scale;
        var drawHeight = image.height * scale;
        var dx = (stageWidth - drawWidth) / 2;
        var dy = (stageHeight - drawHeight) / 2;
        ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
        var pngDataUrl = canvas.toDataURL('image/png');
        var svgString = Library.wrapImageInSvg(pngDataUrl);
        var backgroundMd5 = await Library.saveSvg(svgString);
        var existing = await Library.fetchUserBackground(backgroundMd5);
        if (existing.length > 0) {
            var existingData = Library.parseAssetData(existing[0]);
            return {
                backgroundMd5: backgroundMd5,
                thumbnailMd5: existingData.altmd5
            };
        }
        var thumbDataUrl = Library.createThumbnailFromCanvas(canvas);
        var thumbMd5 = await Library.savePngDataUrl(thumbDataUrl);
        await Library.insertBackgroundRecord(backgroundMd5, thumbMd5);
        return {
            backgroundMd5: backgroundMd5,
            thumbnailMd5: thumbMd5
        };
    }

    static async importSpriteFile (file) {
        console.log('Importing sprite file', file);
        var dataUrl = await Library.readFileAsDataURL(file);
        var image = await Library.loadImage(dataUrl);
        var maxDimension = 300;
        var longestSide = Math.max(image.width, image.height) || 1;
        var scale = Math.min(1, maxDimension / longestSide);
        var spriteWidth = Math.max(1, Math.round(image.width * scale));
        var spriteHeight = Math.max(1, Math.round(image.height * scale));
        var canvas = document.createElement('canvas');
        canvas.width = spriteWidth;
        canvas.height = spriteHeight;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, spriteWidth, spriteHeight);
        ctx.drawImage(image, 0, 0, spriteWidth, spriteHeight);

        var spritePngDataUrl = canvas.toDataURL('image/png');
        var svgString = Library.wrapSpriteInSvg(spritePngDataUrl, spriteWidth, spriteHeight);
        var spriteMd5 = await Library.saveSvg(svgString);
        var existing = await Library.fetchUserSprite(spriteMd5);
        var defaultName = Library.generateSpriteName(file.name);
        if (existing.length > 0) {
            var existingData = Library.parseAssetData(existing[0]);
            return {
                spriteMd5: spriteMd5,
                thumbnailMd5: existingData.altmd5,
                width: Number(existingData.width),
                height: Number(existingData.height),
                scale: existingData.scale ? Number(existingData.scale) : 0.5,
                name: existingData.name || defaultName
            };
        }

        var thumbDataUrl = Library.createSpriteThumbnail(canvas);
        var thumbMd5 = await Library.savePngDataUrl(thumbDataUrl);
        var spriteScale = 0.5;
        await Library.insertSpriteRecord({
            md5: spriteMd5,
            thumbMd5: thumbMd5,
            width: spriteWidth,
            height: spriteHeight,
            scale: spriteScale,
            name: defaultName
        });
        return {
            spriteMd5: spriteMd5,
            thumbnailMd5: thumbMd5,
            width: spriteWidth,
            height: spriteHeight,
            scale: spriteScale,
            name: defaultName
        };
    }

    static readFileAsDataURL (file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }

    static loadImage (dataUrl) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                var naturalWidth = img.naturalWidth || img.width;
                var naturalHeight = img.naturalHeight || img.height;
                if (!naturalWidth || !naturalHeight) {
                    naturalWidth = 480;
                    naturalHeight = 360;
                }
                img.width = naturalWidth;
                img.height = naturalHeight;
                resolve(img);
            };
            img.onerror = function () {
                reject(new Error('Failed to load image data'));
            };
            img.src = dataUrl;
        });
    }

    static wrapImageInSvg (pngDataUrl) {
        return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="480" height="360" viewBox="0 0 480 360">' +
            '<image width="480" height="360" x="0" y="0" xlink:href="' + pngDataUrl + '" />' +
            '</svg>';
    }

    static wrapSpriteInSvg (pngDataUrl, width, height) {
        return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
            '<image width="' + width + '" height="' + height + '" x="0" y="0" xlink:href="' + pngDataUrl + '" />' +
            '</svg>';
    }

    static createThumbnailFromCanvas (canvas) {
        var thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 120;
        thumbCanvas.height = 90;
        var tctx = thumbCanvas.getContext('2d');
        tctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
        return thumbCanvas.toDataURL('image/png');
    }

    static createSpriteThumbnail (canvas) {
        var thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 120;
        thumbCanvas.height = 90;
        var tctx = thumbCanvas.getContext('2d');
        tctx.fillStyle = ScratchJr.stagecolor || '#FFFFFF';
        tctx.fillRect(0, 0, thumbCanvas.width, thumbCanvas.height);
        var scale = Math.min(thumbCanvas.width / canvas.width, thumbCanvas.height / canvas.height);
        var drawWidth = canvas.width * scale;
        var drawHeight = canvas.height * scale;
        var dx = (thumbCanvas.width - drawWidth) / 2;
        var dy = (thumbCanvas.height - drawHeight) / 2;
        tctx.drawImage(canvas, dx, dy, drawWidth, drawHeight);
        return thumbCanvas.toDataURL('image/png');
    }

    static saveSvg (svgString) {
        return new Promise(function (resolve, reject) {
            IO.setMedia(svgString, 'svg', function (md5) {
                if (!md5) {
                    reject(new Error('Failed to save svg background'));
                } else {
                    resolve(md5);
                }
            });
        });
    }

    static savePngDataUrl (dataUrl) {
        var base64 = dataUrl.split(',')[1];
        return new Promise(function (resolve, reject) {
            OS.setmedia(base64, 'png', function (md5) {
                if (!md5) {
                    reject(new Error('Failed to save thumbnail'));
                } else {
                    resolve(md5);
                }
            });
        });
    }

    static fetchUserBackground (md5) {
        return new Promise(function (resolve, reject) {
            var json = {};
            json.cond = 'md5 = ? AND version = ?';
            json.items = ['*'];
            json.values = [md5, ScratchJr.version];
            IO.query('userbkgs', json, function (str) {
                try {
                    resolve(JSON.parse(str));
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static fetchUserSprite (md5) {
        return new Promise(function (resolve, reject) {
            var json = {};
            json.cond = 'md5 = ? AND version = ?';
            json.items = ['*'];
            json.values = [md5, ScratchJr.version];
            IO.query('usershapes', json, function (str) {
                try {
                    resolve(JSON.parse(str));
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    static insertBackgroundRecord (md5, thumbMd5) {
        return new Promise(function (resolve, reject) {
            var json = {};
            var keylist = ['md5', 'altmd5', 'version', 'width', 'height', 'ext'];
            var values = '?,?,?,?,?,?';
            json.values = [md5, thumbMd5, ScratchJr.version, '480', '360', 'svg'];
            json.stmt = 'insert into userbkgs (' + keylist.toString() + ') values (' + values + ')';
            OS.stmt(json, function (res) {
                resolve(res);
            });
        });
    }

    static insertSpriteRecord (info) {
        return new Promise(function (resolve, reject) {
            var json = {};
            var keylist = ['scale', 'md5', 'altmd5', 'version', 'width', 'height', 'ext', 'name'];
            var values = '?,?,?,?,?,?,?,?';
            json.values = [info.scale.toString(), info.md5, info.thumbMd5, ScratchJr.version,
                info.width.toString(), info.height.toString(), 'svg', info.name];
            json.stmt = 'insert into usershapes (' + keylist.toString() + ') values (' + values + ')';
            OS.stmt(json, function (res) {
                resolve(res);
            });
        });
    }

    static generateSpriteName (filename) {
        var base = filename ? filename.replace(/\.[^/.]+$/, '') : '';
        try {
            base = decodeURIComponent(base);
        } catch (err) {
            // ignore decode errors
        }
        base = base.replace(/[^A-Za-z]/g, '');
        if (!base) {
            base = Localization.localize('LIBRARY_CHARACTER');
        }
        return base.length > 20 ? base.substr(0, 20) : base;
    }
}
