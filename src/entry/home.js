import { gn } from "../utils/lib";
import { setMainLandmark, setNavigationLandmark, setSelectedState } from "../utils/accessibility";
import Localization from "../utils/Localization";
import OS from "../tablet/OS";
import Lobby from "../lobby/Lobby";
import goToLink from "../utils/goToLink";
import {
  CURRICULUM_ARTIFACT_SHA256_PARAM,
  CURRICULUM_ARTIFACT_URL_PARAM,
} from "../editor/CurriculumArtifact";

export function homeMain() {
  const urlParams = new URLSearchParams(window.location.search);
  const hasTutorial = Boolean(urlParams.get("tutorial"));
  const hasCurriculumArtifact = urlParams.has(CURRICULUM_ARTIFACT_URL_PARAM) ||
    urlParams.has(CURRICULUM_ARTIFACT_SHA256_PARAM);
  /*Tutorial and curriculum artifacts open directly in the editor.*/
  if (hasTutorial || hasCurriculumArtifact) {
    const editorParams = new URLSearchParams({
      pmd5: "-1",
      mode: "edit",
    });
    if (hasTutorial) {
      editorParams.set("tutorial", urlParams.get("tutorial"));
      editorParams.set("tutorialReturnPlace", urlParams.get("tutorialReturnPlace") || "book");
      editorParams.set("tutorialReturnSubmenu", urlParams.get("tutorialReturnSubmenu") || "tutorials");
    }
    [CURRICULUM_ARTIFACT_URL_PARAM, CURRICULUM_ARTIFACT_SHA256_PARAM].forEach(function (key) {
      const value = urlParams.get(key);
      if (value) {
        editorParams.set(key, value);
      }
    });
    goToLink(`editor.html?${editorParams.toString()}`);
    return;
  }
  showHostBackControls();
  gn("logotab").onclick = null;
  gn("logotab").disabled = true;
  homeStrings();
  setNavigationLandmark(gn("topbar"), Localization.localize("A11Y_APP_NAVIGATION"));
  setNavigationLandmark(gn("footernav"), Localization.localize("A11Y_GUIDE_SECTIONS"));
  setMainLandmark(gn("wrapc"), {
    label: Localization.localize("A11Y_MAIN_CONTENT"),
  });
  gn("logotab").setAttribute("aria-hidden", "true");
  gn("logotab").setAttribute("tabindex", "-1");
  gn("hometab").setAttribute("aria-label", Localization.localize("MY_PROJECTS"));
  gn("geartab").setAttribute("aria-label", Localization.localize("SELECT_LANGUAGE"));
  gn("booktab").setAttribute("aria-label", Localization.localize("ABOUT_SCRATCHJR"));
  setSelectedState(gn("hometab"), false);
  setSelectedState(gn("geartab"), false);
  setSelectedState(gn("booktab"), false);
  OS.getsettings(doNext);
  function doNext(str) {
    var list = str.split(",");
    OS.path = list[1] == "0" ? list[0] + "/" : undefined;
    Lobby.appinit(window.Settings.scratchJrVersion);
    showHostBackControls();
  }
}

function showHostBackControls(remainingAttempts = 12) {
  OS.martyCmd({ cmd: "show-back-arrow" });
  const showBackHomeButton = window.applicationManager?.showBackHomeButton;
  if (typeof showBackHomeButton === "function") {
    showBackHomeButton.call(window.applicationManager);
    return;
  }

  if (remainingAttempts > 0) {
    window.setTimeout(function () {
      showHostBackControls(remainingAttempts - 1);
    }, 250);
  }
}

function homeStrings () {
    const setTabText = (id, localizationKey) => {
        const element = gn(id);
        if (element) {
            element.textContent = Localization.localize(localizationKey);
        }
    };

    setTabText('abouttab-text', 'ABOUT_SCRATCHJR');
    setTabText('interfacetab-text', 'INTERFACE_GUIDE');
    setTabText('painttab-text', 'PAINT_EDITOR_GUIDE');
    setTabText('blockstab-text', 'BLOCKS_GUIDE');
    setTabText('tutorialstab-text', 'TUTORIALS');
    setTabText('privacytab-text', 'PRIVACY_POLICY');

    const tabIcon = gn('tabicon');
    if (tabIcon) {
        tabIcon.setAttribute('aria-label', Localization.localize('QUICK_INTRO'));
    }
}
