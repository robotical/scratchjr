import ScratchJr from "../editor/ScratchJr";
import OS from "../tablet/OS";
import Camera from "../painteditor/Camera";
import Record from "../editor/ui/Record";
import {
  CURRICULUM_ARTIFACT_SHA256_PARAM,
  CURRICULUM_ARTIFACT_URL_PARAM,
  importCurriculumArtifactFromSearch,
} from "../editor/CurriculumArtifact";

function replaceArtifactRequestWithProject(projectId) {
  var url = new URL(window.location.href);
  url.searchParams.delete(CURRICULUM_ARTIFACT_URL_PARAM);
  url.searchParams.delete(CURRICULUM_ARTIFACT_SHA256_PARAM);
  url.searchParams.set("pmd5", projectId);
  url.searchParams.set("mode", "edit");
  window.history.replaceState(null, "", url.pathname + url.search + url.hash);
}

function showArtifactImportError() {
  window.setTimeout(function () {
    window.alert("This Blocks Jr project could not be opened. Please check the link and try again.");
  }, 0);
}

export async function editorMain() {
  OS.martyCmd({ cmd: "hide-back-arrow" });
  OS.getsettings(doNext);
  OS.analyticsEvent("editor", "project_editor_open");
  window.applicationManager?.hideBackHomeButton();
  async function doNext(str) {
    var list = str.split(",");
    OS.path = list[1] == "0" ? list[0] + "/" : undefined;
    if (list.length > 2) {
      Record.available = list[2] == "YES" ? true : false;
    }
    if (list.length > 3) {
      Camera.available = list[3] == "YES" ? true : false;
    }
    var importFailed = false;
    try {
      var importResult = await importCurriculumArtifactFromSearch(window.location.search, {
        baseUrl: window.location.href,
        allowedOrigins: window.Settings.curriculumArtifactAllowedOrigins || [],
        fetchImplementation: window.fetch ? window.fetch.bind(window) : undefined,
        projectVersion: window.Settings.scratchJrVersion,
      });
      if (importResult && importResult.projectId) {
        replaceArtifactRequestWithProject(importResult.projectId);
      }
    } catch (err) {
      importFailed = true;
      console.error("Blocks Jr curriculum artifact import failed", err);
    }
    ScratchJr.appinit(window.Settings.scratchJrVersion);
    if (importFailed) {
      showArtifactImportError();
    }
  }
}
