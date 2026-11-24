import Cookie from './Cookie';
import englishMessages from '../../editions/free/src/localizations/en.json';
import Intl from 'intl';
import IO from '../tablet/IO';
// import IntlMessageFormat from "expose-loader?IntlMessageFormat!intl-messageformat";
import IntlMessageFormat from "expose-loader?exposes=IntlMessageFormat!intl-messageformat";
window.IntlMessageFormat = IntlMessageFormat;
if (!window.Intl) {
    window.Intl = Intl;
}

require('intl/locale-data/jsonp/ar.js');
require('intl/locale-data/jsonp/bg.js');
require('intl/locale-data/jsonp/cs.js');
require('intl/locale-data/jsonp/da.js');
require('intl/locale-data/jsonp/el.js');
require('intl/locale-data/jsonp/fi.js');
require('intl/locale-data/jsonp/nb.js');
require('intl/locale-data/jsonp/ca.js');
require('intl/locale-data/jsonp/de.js');
require('intl/locale-data/jsonp/en.js');
require('intl/locale-data/jsonp/es.js');
require('intl/locale-data/jsonp/fr.js');
require('intl/locale-data/jsonp/it.js');
require('intl/locale-data/jsonp/nl.js');
require('intl/locale-data/jsonp/ja.js');
require('intl/locale-data/jsonp/pt.js');
require('intl/locale-data/jsonp/sv.js');
require('intl/locale-data/jsonp/th.js');
require('intl/locale-data/jsonp/zh.js');

// require('expose-loader?IntlMessageFormat!intl-messageformat');
require('intl-messageformat/dist/locale-data/ar');
require('intl-messageformat/dist/locale-data/bg');
require('intl-messageformat/dist/locale-data/cs');
require('intl-messageformat/dist/locale-data/da');
require('intl-messageformat/dist/locale-data/el');
require('intl-messageformat/dist/locale-data/fi');
require('intl-messageformat/dist/locale-data/no');
require('intl-messageformat/dist/locale-data/ca');
require('intl-messageformat/dist/locale-data/de');
require('intl-messageformat/dist/locale-data/en');
require('intl-messageformat/dist/locale-data/es');
require('intl-messageformat/dist/locale-data/fr');
require('intl-messageformat/dist/locale-data/it');
require('intl-messageformat/dist/locale-data/nl');
require('intl-messageformat/dist/locale-data/ja');
require('intl-messageformat/dist/locale-data/pt');
require('intl-messageformat/dist/locale-data/sv');
require('intl-messageformat/dist/locale-data/th');
require('intl-messageformat/dist/locale-data/zh');

let currentLocale;
let localizationMessages = {};

// Configuration
const sampleKeyPrefix = 'key_';

function supportedLocale(tag) {
    const {supportedLocales, defaultLocale} = window.Settings;
    const locales = Object.values(supportedLocales);
    const normalized = (tag || defaultLocale).toLowerCase();
    const language = normalized.split('-')[0];
    return locales.find(code => code === normalized) ||
        locales.find(code => code === language) ||
        locales.find(code => code.split('-')[0] === language) || defaultLocale;
}

export default class Localization {
    static get currentLocale () {
        return currentLocale;
    }

    static determineLocaleFromBrowser () {
        return supportedLocale(window.navigator.userLanguage || window.navigator.language);
    }

    static includeLocales (localizationRoot, whenDone) {
        const {defaultLocale} = window.Settings;
        // Guide and tutorial pages can be nested one frame deeper than the host bridge.
        let hostLocale;
        let frame = window;
        try {
            while (frame) {
                hostLocale = frame.applicationManager?.selectedLocale;
                if (hostLocale || frame === frame.parent) break;
                frame = frame.parent;
            }
        } catch (error) {
            // A cross-origin parent cannot share its application manager.
        }
        const preferred = hostLocale || Cookie.get('localization');
        const locale = preferred ? supportedLocale(preferred) : this.determineLocaleFromBrowser();

        function load(code) {
            IO.requestFromServer(localizationRoot + 'localizations/' + code + '.json', result => {
                try {
                    const messages = JSON.parse(result);
                    localizationMessages = code === defaultLocale ? messages : Object.assign({}, englishMessages, messages);
                } catch (error) {
                    if (code !== defaultLocale) {
                        load(defaultLocale);
                        return;
                    }
                    localizationMessages = englishMessages;
                }
                currentLocale = code;
                whenDone();
            });
        }
        load(locale);
    }

    // Translate a particular message given the message key and info
    static localize (key, formatting) {
        var message;
        if (key in localizationMessages) {
            message = new window.IntlMessageFormat(localizationMessages[key], currentLocale);
            return message.format(formatting);
        }
        return 'String missing: ' + key;
    }

    static localizeSampleName (key) {
        var name = Localization.localizeOptional('SAMPLE_' + key);
        // If the localized name is still started with 'SAMPLE_',
        // it is not a preset name.
        if (name.startsWith('SAMPLE_')) {
            return key;
        }
        return name;
    }

    // Translate a particular message given the message key and info;
    // if key not found, assume it's just a raw text string without a translation,
    // and return that
    static localizeOptional (keyOrRawText, formatting) {
        var message;
        if (keyOrRawText in localizationMessages) {
            message = new window.IntlMessageFormat(localizationMessages[keyOrRawText], currentLocale);
            return message.format(formatting);
        }
        return keyOrRawText;
    }

    // For sample projects, some fields (sprite names, text on stage, and text in say blocks)
    // may have a special prefix to indicate that it should be replaced with a localized value.
    // E.g., we might have some text on the stage that says "Touch me" in English. This gets translated.
    static isSampleLocalizedKey (str) {
        return str.slice(0, sampleKeyPrefix.length) == sampleKeyPrefix;
    }
}
