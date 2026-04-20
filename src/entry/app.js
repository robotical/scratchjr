import { preprocessAndLoadCss } from "../utils/lib";
import { ensureSkipLink, setDocumentLanguage, setLocalizedDocumentTitle } from "../utils/accessibility";
import Localization from "../utils/Localization";
import InitialOptions from "../utils/InitialOptions";
import OS from "../tablet/OS";
import IO from "../tablet/IO";
import MediaLib from "../tablet/MediaLib";

import { indexMain } from "./index";
import { homeMain } from "./home";
import { editorMain } from "./editor";
import { gettingStartedMain } from "./gettingstarted";
import {
  inappInterfaceGuide,
  inappAbout,
  inappBlocksGuide,
  inappPaintEditorGuide,
  inappPrivacyPolicy,
  inappTutorials,
} from "./inapp";

// import TutorialFetcher from '../tutorial/TutorialFetcher';
import TutorialEngine from '../tutorial/TutorialEngine';

function loadSettings(settingsRoot, whenDone) {
  IO.requestFromServer(settingsRoot + "settings.json", (result) => {
    try {
      window.Settings = JSON.parse(result);
    } catch (e) {
      // on ios, on the initial load fetching the settings.json file
      // fails. It doesn't break anything, but it does cause an error
      // adding manually these properties to the window.Settings object
      // so we prevent the error
      window.Settings = {};
      window.Settings.defaultLocale = "en";
      window.Settings.supportedLocales = {
        English: "en",
      };
    }
    whenDone();
  });
}

// App-wide entry-point
window.onload = () => {
  // Function to be called after settings, locale strings, and Media Lib
  // are asynchronously loaded. This is overwritten per HTML page below.
  let entryFunction = () => { };

  // Root directory for includes. Needed in case we are in the inapp-help
  // directory (and root becomes '../')
  let root = "./";

  // scratchJrPage is defined in the HTML pages
  let page = window.scratchJrPage;
  let titleKey = null;
  let skipLinkTargetId = null;

  // Load CSS and set root/entryFunction for all pages
  switch (page) {
    case "index":
      // Index page (splash screen)
      preprocessAndLoadCss("css", "css/font.css");
      preprocessAndLoadCss("css", "css/base.css");
      preprocessAndLoadCss("css", "css/start.css");
      preprocessAndLoadCss("css", "css/thumbs.css");
      /* For parental gate. These CSS properties should be refactored */
      preprocessAndLoadCss("css", "css/editor.css");
      entryFunction = () =>
        OS.waitForInterface(function () {
          var assets = Object.keys(MediaLib.keys).join(",");
          OS.registerLibraryAssets(MediaLib.version, assets, indexMain);
        });
      titleKey = "MY_PROJECTS";
      skipLinkTargetId = "frame";
      break;
    case "home":
      // Lobby pages
      preprocessAndLoadCss("css", "css/font.css");
      preprocessAndLoadCss("css", "css/base.css");
      preprocessAndLoadCss("css", "css/lobby.css");
      preprocessAndLoadCss("css", "css/thumbs.css");
      entryFunction = () => OS.waitForInterface(homeMain);
      titleKey = "MY_PROJECTS";
      skipLinkTargetId = "wrapc";
      break;
    case "editor":
      // Editor pages
      preprocessAndLoadCss("css", "css/font.css");
      preprocessAndLoadCss("css", "css/base.css");
      preprocessAndLoadCss("css", "css/editor.css");
      preprocessAndLoadCss("css", "css/connect-btn.css");
      preprocessAndLoadCss("css", "css/disconnect-btn.css");
      preprocessAndLoadCss("css", "css/media-queries.css");
      preprocessAndLoadCss("css", "css/editorleftpanel.css");
      preprocessAndLoadCss("css", "css/editorstage.css");
      preprocessAndLoadCss("css", "css/editormodal.css");
      preprocessAndLoadCss("css", "css/librarymodal.css");
      preprocessAndLoadCss("css", "css/paintlook.css");
      preprocessAndLoadCss("css", "css/marty-battery-level.css");
      preprocessAndLoadCss("css", "css/marty-signal-strength.css");
      preprocessAndLoadCss("css", "css/connection-modal.css");
      preprocessAndLoadCss("css", "css/tutorial.css");
      entryFunction = () => OS.waitForInterface(editorMain);
      titleKey = "A11Y_PAGE_TITLE_EDITOR";
      skipLinkTargetId = "frame";
      break;
    case "gettingStarted":
      // Getting started video page
      preprocessAndLoadCss("css", "css/font.css");
      preprocessAndLoadCss("css", "css/base.css");
      preprocessAndLoadCss("css", "css/gs.css");
      entryFunction = () => OS.waitForInterface(gettingStartedMain);
      titleKey = "QUICK_INTRO";
      skipLinkTargetId = "maincontent";
      break;
    case "inappAbout":
      // About ScratchJr in-app help frame
      preprocessAndLoadCss("style", "style/about.css");
      entryFunction = () => inappAbout();
      root = "../";
      titleKey = "ABOUT_SCRATCHJR";
      skipLinkTargetId = "content";
      break;
    case "inappInterfaceGuide":
      // Interface guide in-app help frame
      preprocessAndLoadCss("style", "style/style.css");
      preprocessAndLoadCss("style", "style/interface.css");
      entryFunction = () => inappInterfaceGuide();
      root = "../";
      titleKey = "INTERFACE_GUIDE";
      skipLinkTargetId = "content";
      break;
    case "inappPaintEditorGuide":
      // Paint editor guide in-app help frame
      preprocessAndLoadCss("style", "style/style.css");
      preprocessAndLoadCss("style", "style/paint.css");
      entryFunction = () => inappPaintEditorGuide();
      root = "../";
      titleKey = "PAINT_EDITOR_GUIDE";
      skipLinkTargetId = "content";
      break;
    case "inappBlocksGuide":
      // Blocks guide in-app help frame
      preprocessAndLoadCss("style", "style/style.css");
      preprocessAndLoadCss("style", "style/blocks.css");
      entryFunction = () => inappBlocksGuide();
      root = "../";
      titleKey = "BLOCKS_GUIDE";
      skipLinkTargetId = "content";
      break;
    case "inappPrivacyPolicy":
      // Blocks guide in-app help frame
      preprocessAndLoadCss("style", "style/style.css");
      preprocessAndLoadCss("style", "style/privacy.css");
      entryFunction = () => inappPrivacyPolicy();
      root = "../";
      titleKey = "PRIVACY_POLICY";
      skipLinkTargetId = "content";
      break;
    case "inappTutorials":
      preprocessAndLoadCss("style", "style/style.css");
      preprocessAndLoadCss("style", "style/tutorials.css");
      entryFunction = () => inappTutorials();
      root = "../";
      break;
  }

  // Start up sequence
  // Load settings from JSON
  loadSettings(root, () => {

    // Load locale strings from JSON
    Localization.includeLocales(root, () => {
      // Load Media Lib from JSON
      MediaLib.loadMediaLib(root, () => {
        setDocumentLanguage(Localization.currentLocale);
        if (titleKey) {
          setLocalizedDocumentTitle(titleKey);
        }
        entryFunction();
        if (skipLinkTargetId) {
          ensureSkipLink(skipLinkTargetId, Localization.localize('A11Y_SKIP_TO_MAIN'));
        }
        
        /*Tutorial*/
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("tutorial")) {
          // Load tutorial
          const TutorialFetcher = require('../tutorial/TutorialFetcher').default;
          const tutorial = TutorialFetcher.fetchTutorial(urlParams.get("tutorial"));
          if (tutorial) {
            // For better UI, give a little time for the UI to load before starting the tutorial
            setTimeout(() => {
              window.tutorialEngine = new TutorialEngine(tutorial);
            }, 1000);
          }
        }
        /* End Tutorial */

      });
    });
    // Initialize currentUsage data
    InitialOptions.initWithSettings(window.Settings.initialOptions);
  });
};
