import { gn } from "../utils/lib";
import Localization from "../utils/Localization";
import OS from "../tablet/OS";
import Lobby from "../lobby/Lobby";
import goToLink from "../utils/goToLink";


export function homeMain() {
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
    gn('abouttab-text').textContent = Localization.localize('ABOUT_SCRATCHJR');
    gn('interfacetab-text').textContent = Localization.localize('INTERFACE_GUIDE');
    gn('painttab-text').textContent = Localization.localize('PAINT_EDITOR_GUIDE');
    gn('blockstab-text').textContent = Localization.localize('BLOCKS_GUIDE');
    gn('privacytab-text').textContent = Localization.localize('PRIVACY_POLICY');
}
