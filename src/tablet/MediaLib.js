import IO from './IO';
import Localization from '../utils/Localization';

let path;
let samples;
let backgrounds;
let sprites;
let legacySprites;
let sounds;
let keys = {};
let version = 0;

export default class MediaLib {
    static get path () {
        return path;
    }

    static get samples () {
        return samples;
    }

    static get sprites () {
        return sprites;
    }

    static get backgrounds () {
        return backgrounds;
    }

    static get sounds () {
        return sounds;
    }

    static get keys () {
        return keys;
    }

    static get version () {
        return version;
    }

    static loadMediaLib (root, whenDone) {
        IO.requestFromServer(root + 'media.json', (result) => {
            let parsedResult = JSON.parse(result);
            path = parsedResult.path;
            samples = parsedResult.samples;
            sprites = parsedResult.sprites;
            legacySprites = parsedResult.legacySprites || [];
            backgrounds = parsedResult.backgrounds;
            sounds = parsedResult.sounds;

            if (parsedResult.assetLibraryVersion) {
                version = parsedResult.assetLibraryVersion;
            }

            MediaLib.localizeMediaNames();
            MediaLib.generateKeys();

            whenDone();
        });
    }

    static localizeMediaNames () {
        // Localize names of sprites
        for (let i = 0; i < sprites.length; i++) {
            sprites[i].name = MediaLib.localizeMediaName('CHARACTER_', sprites[i]);
        }

        // Localize names of backgrounds
        for (let i = 0; i < backgrounds.length; i++) {
            backgrounds[i].name = MediaLib.localizeMediaName('BACKGROUND_', backgrounds[i]);
        }

        // Localize names of legacy sprites
        for (let i = 0; i < legacySprites.length; i++) {
            legacySprites[i].name = MediaLib.localizeMediaName('CHARACTER_', legacySprites[i]);
        }
    }

    static localizeMediaName (prefix, asset) {
        var key = prefix + asset.md5;
        var localized = Localization.localizeOptional(key);
        return localized == key ? asset.name : localized;
    }

    static generateKeys () {
        for (let i = 0; i < backgrounds.length; i++) {
            var bg = backgrounds[i];
            keys[bg.md5] = MediaLib.getKeyForAsset(bg);
        }

        for (let i = 0; i < sprites.length; i++) {
            var spr = sprites[i];
            keys[spr.md5] = MediaLib.getKeyForAsset(spr);
            MediaLib.registerAnimationFrames(spr);
        }

        // when we change sprites (or remove them) the old ones still need to be in keys
        // for projects that were created before the change
        for (let i = 0; i < legacySprites.length; i++) {
            var legacySpr = legacySprites[i];
            keys[legacySpr.md5] = MediaLib.getKeyForAsset(legacySpr);
            MediaLib.registerAnimationFrames(legacySpr);
        }
    }

    static getKeyForAsset (asset) {
        var key = {width: asset.width, height: asset.height, name: asset.name};
        if (asset.animationFrames && asset.animationFrames.length > 1) {
            key.animationFrames = asset.animationFrames.slice(0);
            key.animationFrameRate = asset.animationFrameRate;
        }
        return key;
    }

    static registerAnimationFrames (asset) {
        if (!asset.animationFrames || asset.animationFrames.length < 1) {
            return;
        }
        for (let i = 0; i < asset.animationFrames.length; i++) {
            var frameMd5 = asset.animationFrames[i];
            if (!keys[frameMd5]) {
                keys[frameMd5] = {width: asset.width, height: asset.height, name: asset.name};
            }
        }
    }
}
