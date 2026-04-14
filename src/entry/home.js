import { gn } from "../utils/lib";
import Localization from "../utils/Localization";
import OS from "../tablet/OS";
import Lobby from "../lobby/Lobby";
import goToLink from "../utils/goToLink";

export function homeMain() {
  const urlParams = new URLSearchParams(window.location.search);
  /*Tutorial*/
  if (urlParams.get("tutorial")) {
    const editorParams = new URLSearchParams({
      pmd5: "-1",
      mode: "edit",
      tutorial: urlParams.get("tutorial"),
      tutorialReturnPlace: urlParams.get("tutorialReturnPlace") || "book",
      tutorialReturnSubmenu: urlParams.get("tutorialReturnSubmenu") || "tutorials"
    });
    window.location.href = `editor.html?${editorParams.toString()}`;
    return;
  }
  OS.martyCmd({cmd: "show-back-arrow"});
  gn("logotab").onclick = homeGoBack;
  homeStrings();
  OS.getsettings(doNext);
  window.applicationManager?.showBackHomeButton();
  function doNext(str) {
    var list = str.split(",");
    OS.path = list[1] == "0" ? list[0] + "/" : undefined;
    Lobby.appinit(window.Settings.scratchJrVersion);
  }
}

function homeGoBack() {
  goToLink("index.html?back=yes");
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
}
