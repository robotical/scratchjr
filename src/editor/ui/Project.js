import ScratchJr from '../ScratchJr';
import BlockSpecs from '../blocks/BlockSpecs';
import Alert from './Alert';
import Palette from './Palette';
import UI from './UI';
import Page from '../engine/Page';
import Sprite from '../engine/Sprite';
import OS from '../../tablet/OS';
import IO from '../../tablet/IO';
import Paint from '../../painteditor/Paint';
import SVG2Canvas from '../../utils/SVG2Canvas';
import Localization from '../../utils/Localization';
import {frame, gn, newHTML, scaleMultiplier, getIdFor,
    isAndroid, setProps, setCanvasSize} from '../../utils/lib';

let metadata = undefined;
let mediaCount = -1;
let saving = false;
let pendingSave = undefined;
let interval = undefined;
let pageid;
let loadIcon = undefined;
let error = false;
let projectbarsize = 66;
let mediaCountBase = 1;
let pendingEditorMode = null;
let recoverySnapshotLoaded = false;

const THUMBNAIL_SAVE_TIMEOUT = 3000;
const PROJECT_SAVE_TIMEOUT = 5000;
const RECOVERY_SNAPSHOT_KEY_PREFIX = 'scratchjrProjectRecovery:';

const EDITOR_MODE_MARTY = 'marty';
const EDITOR_MODE_SPRITE = 'sprite';
const MICROBIT_EXTENSION_ID = 'microbit';
const MICROBIT_EXTENSION_BLOCK_PREFIX = 'microbit';

export default class Project {
    static get metadata () {
        return metadata;
    }

    static set metadata (newMetadata) {
        metadata = newMetadata;
    }

    static get mediaCount () {
        return mediaCount;
    }

    static set mediaCount (newMediaCount) {
        mediaCount = newMediaCount;
    }

    static set loadIcon (newLoadIcon) {
        loadIcon = newLoadIcon;
    }

    static get loadIcon () {
        return loadIcon;
    }

    static get error () {
        return error;
    }

    static get saving () {
        return saving;
    }


    static clear () {
        ScratchJr.stage.clear();
        UI.clear();
    }

    static load () {
        mediaCountBase = 1;
        ScratchJr.log('Project load status', ScratchJr.getTime(), 'sec', BlockSpecs.loadCount);
        if (BlockSpecs.loadCount > 0) {
            setTimeout(function () {
                Project.delayLoad();
            }, 32);
        } else {
            Project.startLoad();
        }
    }

    static delayLoad () {
        if (BlockSpecs.loadCount < 1) {
            Project.startLoad();
        } else {
            setTimeout(function () {
                Project.delayLoad();
            }, 32);
        }
    }

    static startLoad () {
        ScratchJr.log('all UI assets recieved - procced to call server', ScratchJr.getTime(), 'sec');
        Project.setProgress(20);
        UI.layout();
        if (!ScratchJr.currentProject) {
            Project.dataRecieved(JSON.stringify([{
                name: Localization.localize('TUTORIALS'),
                version: ScratchJr.version,
                mtime: (new Date()).getTime().toString()
            }]));
            return;
        }
        IO.getObject(ScratchJr.currentProject, Project.dataRecieved);
    }

    static dataRecieved (str) {
        ScratchJr.log('got project metadata', ScratchJr.getTime(), 'sec');
        var data = JSON.parse(str)[0];
        metadata = IO.parseProjectData(data);
        var recoverySnapshot = Project.loadRecoverySnapshot(ScratchJr.currentProject, metadata);
        recoverySnapshotLoaded = Boolean(recoverySnapshot);
        if (recoverySnapshot) {
            metadata.json = recoverySnapshot;
        }
        mediaCount = -1;
        if (metadata.json) {
            Project.loadData(metadata.json, doneProjectLoad);
        } else {
            mediaCount = 0;
            new Page(getIdFor('page'));
            Palette.selectCategory(1);
            // On Android 4.2, this comes up blank the first time, so try again in 100ms.
            setTimeout(function () {
                Palette.selectCategory(1);
            }, 100);
            Project.loadwait(doneProjectLoad);
        }
        function doneProjectLoad () {
            // Clear gift flag
            if ('id' in metadata) {
                metadata.isgift = '0';
                IO.setProjectIsGift(metadata);
            }
            Palette.selectCategory(1);
            // On Android 4.2, this comes up blank the first time, so try again in 100ms.
            setTimeout(function () {
                Palette.selectCategory(1);
            }, 100);
            Paint.layout();
            Project.setProgress(100);
            Project.liftCurtain();
            ScratchJr.stage.currentPage.update();
            Project.applyLoadedEditorMode();
            ScratchJr.changed = recoverySnapshotLoaded;
            ScratchJr.storyStarted = false;
            UI.needsScroll();
            UI.setProjectInfoEnabled(true);
            ScratchJr.log('all thumbnails updated', ScratchJr.getTime(), 'sec');
            if (isAndroid) {
                AndroidInterface.notifyEditorDoneLoading();
            }
        }
    }


    static init () {
        ScratchJr.log('Project init', ScratchJr.getTime(), 'sec');
        window.addEventListener('pagehide', Project.storeRecoverySnapshot);
        document.addEventListener('visibilitychange', Project.handleVisibilityChange);
        var bd = newHTML('div', 'modal-backdrop fade', frame.parentNode);
        bd.setAttribute('id', 'backdrop');
        setProps(gn('backdrop').style, {
            display: 'none'
        });
        var modalOuter = newHTML('div', 'modal-outer', frame.parentNode);
        modalOuter.setAttribute('aria-hidden', 'true');
        var modalMiddle = newHTML('div', 'modal-middle', modalOuter);
        var modal = newHTML('div', 'modal hide fade', modalMiddle);
        modal.setAttribute('id', 'modaldialog');
        setProps(gn('modaldialog').style, {});
        var body = newHTML('div', 'modal-body', modal);
        body.setAttribute('id', 'modalbody');
        setProps(body.style, {
            zoom: scaleMultiplier
        });
        if (loadIcon.complete) {
            Project.addFeedback();
        } else {
            loadIcon.onload = function () {
                Project.addFeedback();
            };
        }
        Project.drawBlind();
    }

    static addFeedback () {
        var body = gn('modalbody');
        newHTML('div', 'loadscreenfill', body);
        newHTML('div', 'topfill', body);
        var cover = newHTML('div', 'loadscreencover', body);
        cover.setAttribute('id', 'progressbar');
        var topcover = newHTML('div', 'topcover', body);
        topcover.setAttribute('id', 'topcover');
        var cover2 = newHTML('div', 'progressbar2', body);
        cover2.setAttribute('id', 'progressbar2');
        var li = newHTML('div', 'loadicon', body);
        li.appendChild(loadIcon);
    }

    static setProgress (perc) {
        if (!gn('progressbar')) {
            return;
        }
        var h = projectbarsize - Math.round(projectbarsize * perc / 100);
        ScratchJr.log('setProgress', perc, h, mediaCount, mediaCountBase);
        gn('progressbar').style.height = h + 'px';
        if (h == 0) {
            gn('progressbar2').style.height = '0px';
            gn('topcover').style.background = '#F9A737';
        }

    }

    static drawBlind () {
        gn('backdrop').setAttribute('class', 'modal-backdrop fade in');
        setProps(gn('backdrop').style, {
            display: 'block'
        });
        setProps(gn('modaldialog').style, {
            display: 'block'
        });
        gn('modaldialog').setAttribute('class', 'modal fade in');
    }

    static loadwait (whenDone) {
        if (interval != null) {
            window.clearInterval(interval);
        }
        mediaCountBase = mediaCount;
        if (mediaCount <= 0) {
            Project.getStarted(whenDone);
        } else {
            interval = window.setInterval(function () {
                Project.loadTask(whenDone);
            }, 32);
        }
    }

    static loadTask (whenDone) {
        if (mediaCount <= 0) {
            Project.getStarted(whenDone);
        } else {
            Project.setProgress(Project.getMediaLoadRatio(70));
        }
    }

    static getMediaLoadRatio (f) {
        if (mediaCount > mediaCountBase) {
            mediaCountBase = mediaCount;
        }
        return 20 + f - (mediaCount / mediaCountBase) * f;
    }

    static getStarted (whenDone) {
        Project.setProgress(90);
        if (interval) {
            window.clearInterval(interval);
        }
        interval = null;
        ScratchJr.log('Project images retrieved from server', ScratchJr.getTime(), 'sec');
        Project.setLoadPage(pageid, whenDone);
        ScratchJr.log('load done', ScratchJr.getTime(), 'sec', '-- media missing = ', mediaCount);
        ScratchJr.stage.resetPages();
        ScratchJr.runtime.beginTimer();
    }

    static liftCurtain () {
        gn('backdrop').setAttribute('class', 'modal-backdrop fade');
        setProps(gn('backdrop').style, {
            display: 'none'
        });
        gn('modaldialog').setAttribute('class', 'modal fade');
        setProps(gn('modaldialog').style, {
            display: 'none'
        });
    }

    static setLoadPage (pageid, whenDone) {
        ScratchJr.log('setLoadPage', ScratchJr.getTime(), 'sec');
        var pages = ScratchJr.stage.getPagesID();
        var page;
        if (pages.indexOf(pageid) < 0) {
            page = ScratchJr.stage.pages[0];
        } else {
            page = ScratchJr.stage.getPage(pageid);
        }
        ScratchJr.stage.setViewPage(page);
        var list = ScratchJr.stage.pages;
        for (var i = 0; i < list.length; i++) {
            if (ScratchJr.stage.currentPage == list[i]) {
                ScratchJr.stage.currentPage.setPageSprites('visible');
            } else {
                list[i].setPageSprites('hidden');
            }
        }
        if (whenDone) {
            whenDone();
        }
    }

    static loadData (data, fcn) {
        try {
            data = (typeof data === 'string') ? JSON.parse(data) : data;
            Project.applyLoadedExtensionState(data);
            pendingEditorMode = Project.getEditorModeFromProjectData(data);
            mediaCount = 0;
            Project.loadme(data, fcn);
            error = false;
        } catch (e) {
            console.log(e); //eslint-disable-line no-console
            var errorMessage = 'Error -- project data corrupted.';

            if (window.reloadDebug) {
                document.write(e.message + '\n' + metadata['json']);
                return;
            }

            Alert.open(frame, gn('flip'), errorMessage, '#ff0000');
            if (interval) {
                window.clearInterval(interval);
            }
            interval = null;
            Palette.selectCategory(1);
            // On Android 4.2, this comes up blank the first time, so try again in 100ms.
            setTimeout(function () {
                Palette.selectCategory(1);
            }, 100);
            Project.liftCurtain();
            error = true;
        }
    }

    static applyLoadedExtensionState (data) {
        const shouldEnableMicroBitExtension =
            Project.getEnabledExtensionsFromProjectData(data).indexOf(MICROBIT_EXTENSION_ID) > -1 ||
            !!window.microBitManager?.getActiveMicroBit?.();

        if (shouldEnableMicroBitExtension) {
            UI.enableMicroBitExtension({selectCategory: false});
            return;
        }

        ScratchJr.isMicroBitExtensionEnabled = false;
        UI.updateMicroBitExtensionControls();
        UI.updateExtensionsLibraryState();
        if (Palette.parent) {
            Palette.recreateRightCategory();
        }
    }

    static getEnabledExtensionsFromProjectData (data) {
        const enabledExtensions = Array.isArray(data?.enabledExtensions) ? data.enabledExtensions.slice() : [];
        if (
            enabledExtensions.indexOf(MICROBIT_EXTENSION_ID) < 0 &&
            Project.projectUsesBlockPrefix(data, MICROBIT_EXTENSION_BLOCK_PREFIX)
        ) {
            enabledExtensions.push(MICROBIT_EXTENSION_ID);
        }
        return enabledExtensions;
    }

    static projectUsesBlockPrefix (data, blockPrefix) {
        if (!data || !Array.isArray(data.pages)) {
            return false;
        }
        for (var pageIndex = 0; pageIndex < data.pages.length; pageIndex++) {
            const page = data[data.pages[pageIndex]];
            if (!page || !Array.isArray(page.sprites)) {
                continue;
            }
            for (var spriteIndex = 0; spriteIndex < page.sprites.length; spriteIndex++) {
                const sprite = page[page.sprites[spriteIndex]];
                if (!sprite || !Array.isArray(sprite.scripts)) {
                    continue;
                }
                for (var scriptIndex = 0; scriptIndex < sprite.scripts.length; scriptIndex++) {
                    if (Project.stripUsesBlockPrefix(sprite.scripts[scriptIndex], blockPrefix)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static stripUsesBlockPrefix (strip, blockPrefix) {
        if (!Array.isArray(strip)) {
            return false;
        }
        for (var blockIndex = 0; blockIndex < strip.length; blockIndex++) {
            const block = strip[blockIndex];
            if (!Array.isArray(block)) {
                continue;
            }
            if (typeof block[0] === 'string' && block[0].indexOf(blockPrefix) === 0) {
                return true;
            }
            for (var argIndex = 1; argIndex < block.length; argIndex++) {
                if (Project.stripUsesBlockPrefix(block[argIndex], blockPrefix)) {
                    return true;
                }
            }
        }
        return false;
    }

    static getEditorModeFromProjectData (data) {
        if (data?.editorMode == EDITOR_MODE_MARTY || data?.editorMode == EDITOR_MODE_SPRITE) {
            return data.editorMode;
        }
        const currentPage = data && data.currentPage ? data[data.currentPage] : null;
        if (!currentPage || !currentPage.lastSprite) {
            return null;
        }
        return currentPage.lastSprite.indexOf(ScratchJr.BIRDS_EYE_SPRITE_NAME) > -1 ?
            EDITOR_MODE_MARTY :
            EDITOR_MODE_SPRITE;
    }

    static applyLoadedEditorMode () {
        if (!pendingEditorMode) {
            Project.setModeFromConnectedMarty();
            return;
        }
        const shouldEnableMartyMode = pendingEditorMode == EDITOR_MODE_MARTY;
        pendingEditorMode = null;
        if (ScratchJr.isMartyModeEnabled !== shouldEnableMartyMode) {
            ScratchJr.isMartyModeEnabled = shouldEnableMartyMode;
        }
        UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled);
        UI.ensureSpriteModeForStandaloneMicroBit();
    }

    static setModeFromConnectedMarty () {
        var connectedMarty = null;
        if (window.martyManager && typeof window.martyManager.getActiveMarty === 'function') {
            connectedMarty = window.martyManager.getActiveMarty();
        }
        if (!connectedMarty &&
            window.applicationManager &&
            typeof window.applicationManager.getTheCurrentlySelectedDeviceOrFirstOfItsKind === 'function') {
            connectedMarty = window.applicationManager.getTheCurrentlySelectedDeviceOrFirstOfItsKind('Marty');
        }
        const shouldEnableMartyMode = !!connectedMarty;
        if (ScratchJr.isMartyModeEnabled !== shouldEnableMartyMode) {
            ScratchJr.isMartyModeEnabled = shouldEnableMartyMode;
            UI.renderCorrectMartyModeIcon(ScratchJr.isMartyModeEnabled);
        }
    }

    static loadme (data, fcn) {
        Project.recreate(data);
        Project.loadwait(fcn);
    }

    static getLoadType (bkgid, sid, cid) {
        if (bkgid != null) {
            return 'bkg';
        }
        if (!cid) {
            return 'none';
        }
        if (sid && cid) {
            return 'modify';
        }
        return 'add';
    }

    //////////////////////////////////////////////////
    // load project data
    //////////////////////////////////////////////////

    static recreate (data) {
        ScratchJr.log('Project data structures start loading', ScratchJr.getTime(), 'sec');
        mediaCount = 0;
        ScratchJr.stage.pages = [];
        var pages = data.pages;
        pageid = data.currentPage;
        for (var i = 0; i < pages.length; i++) {
            Project.recreatePage(pages[i], data[pages[i]]);
        }
        mediaCountBase = mediaCount;
    }

    static recreatePage (name, data, fcn) {
        var page = new Page(name, data, fcn);
        page.div.style.visibility = 'hidden';
    }

    static substractCount () {
        mediaCount--;
        if ((gn('backdrop').className != 'modal-backdrop fade in') || (mediaCountBase == 0)) {
            return;
        }
        Project.setProgress(Project.getMediaLoadRatio(70));
    }

    static recreateObject (page, name, data, callBack, active) {
        var list = data.scripts;
        //delete data.scripts;
        var spr;
        data.page = page;
        if (data.type == 'sprite') {
            mediaCount++;
            var fcn = function (spr) {
                spr.setPos(data.xcoor, data.ycoor);
                mediaCount--;
                if (gn('backdrop').className == 'modal-backdrop fade in') {
                    Project.setProgress(Project.getMediaLoadRatio(70));
                }
                ScratchJr.log(spr.name, ScratchJr.getTime(), 'sec');
                if (callBack) {
                    callBack(spr);
                }
            };
            if (!data.defaultScale) {
                data.defaultScale = 0.5;
            }
            spr = new Sprite(data, fcn);
            // load scripts
            var sc = gn(name + '_scripts').owner;
            for (var j = 0; j < list.length; j++) {
                sc.recreateStrip(list[j]);
            }
            if (active) {
                sc.activate();
            } else {
                sc.deactivate();
            }
        } else {
            spr = new Sprite(data, callBack);
        }
        spr.div.style.opacity = spr.shown ? 1 : 0;
        return spr;
    }

    //////////////////////////////////////////////////
    // Save project data
    //////////////////////////////////////////////////

    static handleVisibilityChange () {
        if (document.visibilityState === 'hidden') {
            Project.storeRecoverySnapshot();
        }
    }

    static recoverySnapshotKey (id) {
        return RECOVERY_SNAPSHOT_KEY_PREFIX + String(id);
    }

    static storeRecoverySnapshot () {
        var id = ScratchJr.currentProject;
        if (!id || ScratchJr.isSampleOrStarter() || !ScratchJr.stage || !ScratchJr.stage.pages[0]) {
            return;
        }
        try {
            var projectJSON = Project.getProject(ScratchJr.stage.pages[0].id);
            if (!ScratchJr.changed && metadata && Project.projectDataMatches(projectJSON, metadata.json)) {
                return;
            }
            window.localStorage.setItem(Project.recoverySnapshotKey(id), JSON.stringify({
                id: String(id),
                json: projectJSON,
                projectCtime: metadata && metadata.ctime ? String(metadata.ctime) : null,
                savedAt: Date.now(),
                version: 1
            }));
        } catch (err) {
            console.warn('Could not store the project recovery snapshot', err); //eslint-disable-line no-console
        }
    }

    static loadRecoverySnapshot (id, durableMetadata) {
        if (!id) {
            return null;
        }
        var key = Project.recoverySnapshotKey(id);
        try {
            var rawSnapshot = window.localStorage.getItem(key);
            if (!rawSnapshot) {
                return null;
            }
            var snapshot = JSON.parse(rawSnapshot);
            if (snapshot.version !== 1 || snapshot.id !== String(id) ||
                typeof snapshot.savedAt !== 'number' || !isFinite(snapshot.savedAt) ||
                !snapshot.json || !Array.isArray(snapshot.json.pages)) {
                throw new Error('Invalid project recovery snapshot');
            }
            var durableMtime = durableMetadata ? parseInt(durableMetadata.mtime, 10) : NaN;
            if (!isNaN(durableMtime) && snapshot.savedAt < durableMtime) {
                throw new Error('Stale project recovery snapshot');
            }
            if (snapshot.projectCtime && durableMetadata && durableMetadata.ctime &&
                snapshot.projectCtime !== String(durableMetadata.ctime)) {
                throw new Error('Recovery snapshot belongs to a different project');
            }
            return snapshot.json;
        } catch (err) {
            try {
                window.localStorage.removeItem(key);
            } catch (removeError) {
                // Ignore storage access failures; the database copy can still be loaded.
            }
            return null;
        }
    }

    static clearRecoverySnapshot (id) {
        if (!id) {
            return;
        }
        try {
            window.localStorage.removeItem(Project.recoverySnapshotKey(id));
        } catch (err) {
            // A stale recovery entry is safe: it will be overwritten or cleared by a later save.
        }
    }

    static projectDataMatches (firstProject, secondProject) {
        try {
            var first = typeof firstProject === 'string' ? JSON.parse(firstProject) : firstProject;
            var second = typeof secondProject === 'string' ? JSON.parse(secondProject) : secondProject;
            return JSON.stringify(first) === JSON.stringify(second);
        } catch (err) {
            return false;
        }
    }

    static prepareToSave (id, whenDone) {
        if (saving) {
            Alert.open(frame, gn('flip'), 'Waiting', '#28A5DA');
            Project.waitUntilSaved(id, whenDone);
        } else {
            Alert.open(frame, gn('flip'), 'Saving', '#28A5DA');
            Project.save(id, whenDone);
        }
    }

    static waitUntilSaved (id, fcn) {
        if (!saving) {
            Project.save(id, fcn);
            return;
        }

        if (!pendingSave) {
            pendingSave = {
                id: id,
                callbacks: []
            };
        } else {
            pendingSave.id = id;
        }
        if (fcn) {
            pendingSave.callbacks.push(fcn);
        }
    }

    // Determine if thumbnailMD5 is unique to projectID
    // callback(true/false)
    static thumbnailUnique (thumbnailMD5, projectID, callback) {
        var json = {};
        json.cond = 'deleted = ? AND id != ? AND gallery IS NULL';
        json.items = ['name', 'thumbnail', 'id'];
        json.values = ['NO', projectID];
        IO.query(OS.database, json, function (result) {
            var pdata = JSON.parse(result);
            var isUnique = true;
            for (var p = 0; p < pdata.length; p++) {
                var thispdata = IO.parseProjectData(pdata[p]);
                var th = thispdata.thumbnail;
                if (th) {
                    var thumb = (typeof th == 'string') ? JSON.parse(th) : th;
                    if (thumb && thumb.md5) {
                        if (thumb.md5 == thumbnailMD5) {
                            isUnique = false;
                        }
                    }
                }
            }
            callback(isUnique);
        });
    }

    static save (id, whenDone) {
        saving = true;
        if (!metadata) {
            saving = false;
            if (whenDone) {
                whenDone(false);
            }
            return;
        }

        var previousThumbnail = metadata.thumbnail;
        if (typeof previousThumbnail === 'string') {
            try {
                previousThumbnail = JSON.parse(previousThumbnail);
            } catch (err) {
                // Preserve the original value if an older project contains malformed thumbnail metadata.
            }
        }
        var savedProjectJSON;
        var thumbnailFinished = false;
        var saveFinished = false;
        var persistTimer;
        var thumbnailTimer = setTimeout(function () {
            persistProject(previousThumbnail);
        }, THUMBNAIL_SAVE_TIMEOUT);

        try {
            metadata.id = id;
            savedProjectJSON = Project.getProject(ScratchJr.stage.pages[0].id);
            metadata.json = savedProjectJSON;
            Project.getThumbnailPNG(ScratchJr.stage.pages[0], 192, 144, getMD5);
        } catch (err) {
            persistProject(previousThumbnail);
        }

        function getMD5 (dataurl) {
            try {
                var pngBase64 = dataurl && dataurl.split(',')[1];
                if (!pngBase64) {
                    persistProject(previousThumbnail);
                    return;
                }
                OS.getmd5(pngBase64, function (str) {
                    if (!str) {
                        persistProject(previousThumbnail);
                        return;
                    }
                    savePNG(str, pngBase64);
                });
            } catch (err) {
                persistProject(previousThumbnail);
            }
        }

        function savePNG (md5, pngBase64) {
            try {
                var filename = ScratchJr.currentProject + '_' + md5;
                OS.setmedianame(pngBase64, filename, 'png', doNext);
            } catch (err) {
                persistProject(previousThumbnail);
            }
        }

        function doNext (md5) {
            if (!md5) {
                persistProject(previousThumbnail);
                return;
            }
            persistProject({
                'pagecount': ScratchJr.stage.pages.length,
                'md5': md5
            });
        }

        function persistProject (nextThumbnail) {
            if (thumbnailFinished) {
                return;
            }
            thumbnailFinished = true;
            clearTimeout(thumbnailTimer);
            metadata.thumbnail = nextThumbnail;
            metadata.mtime = (new Date()).getTime().toString();
            persistTimer = setTimeout(function () {
                saveDone(false);
            }, PROJECT_SAVE_TIMEOUT);
            try {
                IO.saveProject(metadata, function (result) {
                    saveDone(saveResultSucceeded(result));
                });
            } catch (err) {
                saveDone(false);
            }
        }

        function saveResultSucceeded (result) {
            if (result === null || result === false || result === -1 || result === '-1') {
                return false;
            }
            return typeof result !== 'string' || !/^(JSON|SQL) error:/.test(result);
        }

        function saveDone (persisted) {
            if (saveFinished) {
                return;
            }
            saveFinished = true;
            clearTimeout(thumbnailTimer);
            clearTimeout(persistTimer);

            var nextSave = pendingSave;
            pendingSave = undefined;
            saving = false;
            if (persisted && !nextSave && projectMatchesSavedJSON()) {
                ScratchJr.changed = false;
                Project.clearRecoverySnapshot(id);
            }
            if (whenDone) {
                try {
                    whenDone(persisted);
                } catch (err) {
                    // A completion callback must not prevent a coalesced save from running.
                }
            }
            if (nextSave) {
                var runNextCallbacks = function (nextSavePersisted) {
                    for (var i = 0; i < nextSave.callbacks.length; i++) {
                        try {
                            nextSave.callbacks[i](nextSavePersisted);
                        } catch (err) {
                            // One completion callback must not prevent the others from running.
                        }
                    }
                };
                if (saving) {
                    Project.waitUntilSaved(nextSave.id, runNextCallbacks);
                } else {
                    Project.save(nextSave.id, runNextCallbacks);
                }
            }
        }

        function projectMatchesSavedJSON () {
            if (!savedProjectJSON || !ScratchJr.stage || !ScratchJr.stage.pages[0]) {
                return false;
            }
            try {
                var currentProjectJSON = Project.getProject(ScratchJr.stage.pages[0].id);
                return Project.projectDataMatches(currentProjectJSON, savedProjectJSON);
            } catch (err) {
                return false;
            }
        }
    }

    static getProject (pageid) {
        var obj = {};
        obj.pages = ScratchJr.stage.getPagesID();
        obj.currentPage = pageid;
        obj.editorMode = ScratchJr.isMartyModeEnabled ? EDITOR_MODE_MARTY : EDITOR_MODE_SPRITE;
        obj.enabledExtensions = ScratchJr.isMicroBitExtensionEnabled ? [MICROBIT_EXTENSION_ID] : [];
        for (var i = 0; i < ScratchJr.stage.pages.length; i++) {
            obj[ScratchJr.stage.pages[i].id] = ScratchJr.stage.pages[i].encodePage();
        }
        return obj;
    }

    static getUndo () {
        return Project.getProject(ScratchJr.stage.currentPage.id);
    }

    static encodeSprite (name) {
        return gn(name).owner.getData();
    }

    static encodeStrip (b) {
        var res = [];
        var hasargs = ['playsnd', 'gotopage', 'playusersnd', 'setcolor', 'onmessage', 'message', 'setspeed'];
        var loops = ['repeat'];
        var carets = ['caretcmd', 'caretend', 'caretstart'];
        while (b != null) {
            var bt = b.blocktype;
            // Don't encode carets in a strip
            if (carets.indexOf(bt) > -1) {
                b = b.next;
                continue;
            }
            if (bt == 'caretrepeat') {
                // Convert repeat carets to actual repeats for the encoding
                bt = 'repeat';
            }
            var arg = (b.arg != null) || (hasargs.indexOf(bt) > -1) ? b.getArgValue() : null;
            if (!arg && (arg != 0)) {
                arg = 'null';
            }
            var dx = b.div.left / b.scale;
            var dy = b.div.top / b.scale;
            var data = [bt, arg, dx, dy];
            if (loops.indexOf(bt) > -1) {
                var inside = Project.encodeStrip(b.inside);
                data.push(inside);
            }
            res.push(data);
            b = b.next;
        }
        return res;
    }

    /////////////////////////////
    // Project PNG Thumbnail
    /////////////////////////////

    static getThumbnailPNG (page, w, h, fcn) {
        var scale = w / 480;
        var data = {};
        data.pagecount = ScratchJr.stage.pages.length;
        var c = document.createElement('canvas');
        setCanvasSize(c, w, h);
        var ctx = c.getContext('2d');
        var md5 = page.md5;
        ctx.fillStyle = window.Settings.stageColor;
        ctx.fillRect(0, 0, w, h);
        if (!md5) {
            Project.drawSprites(page, scale, c, w, h, fcn);
        } else {
            var pcnv;
            if (md5.substr(md5.length - 3) == 'png') {
                var bgimg = page.div.firstElementChild.firstElementChild;
                pcnv = Project.drawPNGInCanvas(bgimg, 480, 360);
            } else {
                pcnv = Project.drawSVGinCanvas(page.svg, 480, 360);
            }
            ctx.drawImage(pcnv, 0, 0, 480, 360, 0, 0, w, h);
            Project.drawSprites(page, scale, c, w, h, fcn);
        }
    }
    static drawPNGInCanvas (png, w, h) {
        var srccnv = document.createElement('canvas');
        setCanvasSize(srccnv, w, h);
        var ctx = srccnv.getContext('2d');
        ctx.drawImage(png, 0, 0, w, h);
        return srccnv;
    }

    static drawSVGinCanvas (extxml, w, h) {
        var srccnv = document.createElement('canvas');
        setCanvasSize(srccnv, w, h);
        var ctx = srccnv.getContext('2d');
        for (var i = 0; i < extxml.childElementCount; i++) {
            SVG2Canvas.drawLayer(extxml.childNodes[i], ctx, SVG2Canvas.drawLayer);
        }
        return srccnv;
    }

    static maskBorders (ctx, w, h) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-in';
        if (window.Settings.edition != 'PBS') {
            ctx.drawImage(BlockSpecs.projectThumb, 0, 0, w, h);
        }
        ctx.restore();
    }

    static drawSprites (page, scale, c, w, h, fcn) {
        var ctx = c.getContext('2d');
        doNext(1);
        function doNext (n) {
            if (!(n < page.div.childElementCount)) {
                Project.maskBorders(c.getContext('2d'), w, h);
                fcn(c.toDataURL('image/png'));
            } else {
                var spr = page.div.childNodes[n].owner;
                if (!spr || !spr.shown) {
                    doNext(n + 1);
                } else {
                    drawLoadedImage(page, ctx, spr.outline, spr, scale, n);
                }
            }
        }

        function drawLoadedImage (page, ctx, img, spr, scale, n) {
            page.drawSpriteImage(ctx, img, spr, scale);
            doNext(n + 1);
        }

    }
}
