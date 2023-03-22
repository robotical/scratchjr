import { gn } from "../utils/lib";
import Localization from "../utils/Localization";
import OS from "../tablet/OS";
import Lobby from "../lobby/Lobby";
import goToLink from "../utils/goToLink";

window.addEventListener("error", function (event) {
  console.error("An error occurred:", event.error);
  try {
    mv2.sendFeedbackToServer(event.error);
  } catch {}
});

window.addEventListener("unhandledrejection", function (event) {
  console.error("An unhandled promise rejection occurred:", event.reason);
  try {
    mv2.sendFeedbackToServer(event.reason);
  } catch {}
});

export function homeMain() {
  OS.martyCmd({cmd: "show-back-arrow"});
  gn("logotab").onclick = homeGoBack;
  homeStrings();
  OS.getsettings(doNext);
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
