import ScratchJr from "../editor/ScratchJr";
import OS from "../tablet/OS";
import Camera from "../painteditor/Camera";
import Record from "../editor/ui/Record";

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

export function editorMain() {
  OS.martyCmd({ cmd: "hide-back-arrow" });
  OS.getsettings(doNext);
  OS.analyticsEvent("editor", "project_editor_open");
  function doNext(str) {
    var list = str.split(",");
    OS.path = list[1] == "0" ? list[0] + "/" : undefined;
    if (list.length > 2) {
      Record.available = list[2] == "YES" ? true : false;
    }
    if (list.length > 3) {
      Camera.available = list[3] == "YES" ? true : false;
    }
    ScratchJr.appinit(window.Settings.scratchJrVersion);

    setTimeout(mv2.updateConnectionInfo, 2000);
  }
}
