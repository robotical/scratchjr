import { gn } from "../utils/lib";
import { setMainLandmark, setNavigationLandmark, setSelectedState } from "../utils/accessibility";
import Localization from "../utils/Localization";
import OS from "../tablet/OS";
import Lobby from "../lobby/Lobby";

export function homeMain() {
  const urlParams = new URLSearchParams(window.location.search);
  /*Tutorial*/
  if (urlParams.get("tutorial")) {
    window.location.href = "editor.html?pmd5=" + -1 + "&mode=edit&tutorial=" + urlParams.get("tutorial");
  }
  hideHostBackControls();
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
    hideHostBackControls();
  }
}

function hideHostBackControls(remainingAttempts = 40) {
  OS.martyCmd({ cmd: "hide-back-arrow" });
  window.applicationManager?.hideBackHomeButton?.();
  if (remainingAttempts > 0) {
    window.setTimeout(function () {
      hideHostBackControls(remainingAttempts - 1);
    }, 250);
  }
}

function homeStrings () {
    gn('abouttab-text').textContent = Localization.localize('ABOUT_SCRATCHJR');
    gn('interfacetab-text').textContent = Localization.localize('INTERFACE_GUIDE');
    gn('painttab-text').textContent = Localization.localize('PAINT_EDITOR_GUIDE');
    gn('blockstab-text').textContent = Localization.localize('BLOCKS_GUIDE');
    gn('privacytab-text').textContent = Localization.localize('PRIVACY_POLICY');
    gn('tabicon').setAttribute('aria-label', Localization.localize('QUICK_INTRO'));
}
