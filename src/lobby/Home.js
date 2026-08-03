//////////////////////////////////////////////////
// Home Screen
//////////////////////////////////////////////////

import Lobby from "./Lobby";
import OS from "../tablet/OS";
import IO from "../tablet/IO";
import Project from "../editor/ui/Project";
import ProjectCloud from "../editor/ProjectCloud";
import Localization from "../utils/Localization";
import ScratchAudio from "../utils/ScratchAudio";
import Vector from "../geom/Vector";
import { gn, newHTML, newButton, isTablet } from "../utils/lib";
import { closeDialog, openDialog, registerDialog } from "../utils/accessibility";
import { addStoredCloudId, getStoredCloudIds } from "../utils/cloudLocalStore";
import goToLink from "../utils/goToLink";

let frame;
let scrollvalue;
let version;
let pendingProjectFocus;

export default class Home {
  static init() {
    version = Lobby.version;
    frame = gn("htmlcontents");
    var inner = newHTML("div", "inner", frame);
    var div = newHTML("div", "scrollarea", inner);
    div.setAttribute("id", "scrollarea");
    var status = newHTML("p", "sr-only", frame);
    status.id = "project-action-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    if (window.PointerEvent || !('ontouchstart' in window)) {
      frame.onpointerdown = Home.handleTouchStart;
      frame.onpointerup = Home.handleTouchEnd;
    } else {
      frame.ontouchstart = Home.handleTouchStart;
      frame.ontouchend = Home.handleTouchEnd;
    }
    Home.displayYourProjects();
  }

  ////////////////////////////
  // Home Screen
  ////////////////////////////

  static emptyProjectThumbnail(parent) {
    var tb = newHTML("div", "projectthumb", parent);
    newHTML("div", "aproject empty", tb);
    tb.id = "newproject";
    Home.addCardActionButton(
      tb,
      "card-action-open",
      Localization.localize("A11Y_CREATE") + " " + Localization.localize("NEW_PROJECT_PREFIX"),
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        Home.performActionForTarget(tb, "project");
      }
    );
  }

  static cloudProjectThumbnail(parent) {
    var tb = newHTML("div", "projectthumb cloud-project-thumb", parent);
    var card = newHTML("div", "aproject cloud", tb);
    var icon = newHTML("div", "cloud-project-icon", card);
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "☁";
    tb.id = "cloudproject";
    var label = newHTML("div", "projecttitle", tb);
    var title = newHTML("h4", undefined, label);
    title.textContent = Localization.localizeOptional("Load cloud project");
    Home.addCardActionButton(
      tb,
      "card-action-open",
      Localization.localizeOptional("Load cloud project"),
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        Home.showCloudLoadDialog();
      }
    );
  }

  //////////////////////////
  // Events
  //////////////////////////

  static handleTouchStart(e) {
    if (typeof e.button == "number" && e.button != 0) {
      return;
    }
    Home.dragging = false;
    Home.actionTarget = Home.getMouseTarget(e);
    Home.initialPt = Events.getTargetPoint(e);
    if (Home.actionTarget) {
      frame.ontouchmove = Home.handleMove;
      frame.onpointermove = Home.handleMove;
    }
    Home.scrolltop = document.body.scrollTop;
  }

  static handleMove(e) {
    var pt = Events.getTargetPoint(e);
    var delta = Vector.diff(pt, Home.initialPt);
    if (!Home.dragging && Vector.len(delta) > 20) {
      Home.dragging = true;
    }
    if (!Home.dragging) {
      return;
    }
  }

  static getMouseTarget(e) {
    var t = e.target;
    if (t == frame) {
      return null;
    }
    if (t.parentNode && !t.parentNode.tagName) {
      return null;
    }
    while (
      t.parentNode &&
      t.parentNode != frame &&
      t.parentNode.getAttribute("class") != "scrollarea"
    ) {
      t = t.parentNode;
    }
    return !t.parentNode || t.parentNode == frame ? null : t;
  }

  static handleTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.button == "number" && e.button != 0) {
      return;
    }
    if (e.touches && e.touches.length > 1) {
      return;
    }
    frame.ontouchmove = undefined;
    frame.onpointermove = undefined;
    if (Home.dragging) {
      return;
    }
    Home.performAction(e);
  }

  static performAction(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!Home.actionTarget) {
      return;
    }
    Home.performActionForTarget(Home.actionTarget, "project");
  }

  static performActionForTarget(target, action) {
    if (!target) {
      return;
    }
    Home.actionTarget = target;
    var md5 = target.id;
    switch (action) {
      case "project":
        ScratchAudio.sndFX("keydown.wav");
        if (md5 && md5 == "newproject") {
          Home.createNewProject();
        } else if (md5 && md5 == "cloudproject") {
          Home.showCloudLoadDialog();
        } else if (md5) {
          OS.setfile("homescroll.sjr", gn("wrapc").scrollTop, function () {
            doNext(md5);
          });
        }
        break;
      case "delete":
        ScratchAudio.sndFX("cut.wav");
        Project.thumbnailUnique(
          target.thumb,
          target.id,
          function (isUnique) {
            if (isUnique) {
              OS.remove(target.thumb, OS.trace);
            }
          }
        );
        OS.setfield(
          OS.database,
          target.id,
          "deleted",
          "YES",
          Home.removeProjThumb
        );
        break;
      case "duplicate":
        Home.duplicateProject(target);
        break;
      default:
        break;
    }
    function doNext() {
      OS.analyticsEvent("lobby", "existing_project_edited");
      goToLink("editor.html?pmd5=" + md5 + "&mode=edit");
    }
  }

  static createNewProject() {
    OS.analyticsEvent("lobby", "project_created");
    var obj = {};
    // XXX: for localization, the new project name should likely be refactored
    obj.name = Home.getNextName(Localization.localize("NEW_PROJECT_PREFIX"));
    obj.version = version;
    obj.mtime = new Date().getTime().toString();
    IO.createProject(obj, Home.gotoEditor);
  }

  static gotoEditor(md5) {
    OS.setfile("homescroll.sjr", gn("wrapc").scrollTop, function () {
      doNext(md5);
    });
    function doNext(md5) {
      goToLink("editor.html?pmd5=" + md5 + "&mode=edit");
    }
  }

  // Project names are given by reading the DOM elements of existing projects...
  static getNextName(name) {
    var pn = [];
    var div = gn("scrollarea");
    for (var i = 0; i < div.childElementCount; i++) {
      if (div.childNodes[i].id == "newproject") {
        continue;
      }
      pn.push(div.childNodes[i].childNodes[1].childNodes[0].textContent);
    }
    var n = 1;
    while (pn.indexOf(name + " " + n) > -1) {
      n++;
    }
    return name + " " + n;
  }

  static removeProjThumb() {
    if (Home.actionTarget && Home.actionTarget.parentNode) {
      Home.actionTarget.parentNode.removeChild(Home.actionTarget);
    }
    Home.actionTarget = undefined;
  }

  static stopCardGesture(element) {
    var stop = function (e) {
      e.stopPropagation();
    };
    element.onpointerdown = stop;
    element.onpointerup = stop;
    element.ontouchstart = stop;
    element.ontouchend = stop;
  }

  static duplicateProject(target) {
    if (!target || target.getAttribute("aria-busy") == "true") {
      return;
    }
    var button = target.querySelector(".project-duplicate-button");
    var sourceName = target.querySelector(".projecttitle h4");
    sourceName = sourceName ? sourceName.textContent : "";
    target.setAttribute("aria-busy", "true");
    if (button) {
      button.disabled = true;
    }

    IO.getObject(target.id, function (result) {
      var source;
      try {
        var rows = JSON.parse(result);
        if (!Array.isArray(rows) || rows.length < 1) {
          throw new Error("Project not found");
        }
        source = IO.parseProjectData(rows[0]);
        source.json = typeof source.json == "string" ? JSON.parse(source.json) : source.json;
        source.thumbnail = typeof source.thumbnail == "string"
          ? JSON.parse(source.thumbnail)
          : source.thumbnail;
      } catch (err) {
        Home.projectDuplicateFailed(target, button, err);
        return;
      }

      IO.uniqueProjectName({ name: source.name || sourceName }, function (namedProject) {
        try {
          IO.createProject({
            name: namedProject.name,
            version: source.version || version,
            json: source.json,
            thumbnail: source.thumbnail,
            isgift: "0"
          }, function (newProjectId) {
            if (!Home.isValidProjectId(newProjectId)) {
              Home.projectDuplicateFailed(
                target,
                button,
                new Error("Project copy could not be saved")
              );
              return;
            }
            pendingProjectFocus = String(newProjectId);
            Home.setProjectActionStatus(
              Localization.localizeOptional("Duplicated project") + " " +
              sourceName + " " + Localization.localizeOptional("as") + " " + namedProject.name + "."
            );
            OS.analyticsEvent("lobby", "project_duplicated");
            Home.displayYourProjects();
          });
        } catch (err) {
          Home.projectDuplicateFailed(target, button, err);
        }
      });
    });
  }

  static projectDuplicateFailed(target, button, err) {
    console.warn("Home: project duplication failed", err);
    target.removeAttribute("aria-busy");
    if (button) {
      button.disabled = false;
      button.focus();
    }
    Home.setProjectActionStatus(
      Localization.localizeOptional("Project could not be duplicated. Please try again.")
    );
  }

  static isValidProjectId(projectId) {
    if (typeof projectId == "number") {
      return projectId > 0;
    }
    return typeof projectId == "string" && /^[0-9]+$/.test(projectId) && Number(projectId) > 0;
  }

  static setProjectActionStatus(message) {
    var status = gn("project-action-status");
    if (status) {
      status.textContent = message;
    }
  }

  static addProjectDuplicateButton(target, projectName, parent) {
    var button = newButton("project-duplicate-button", parent, {
      ariaLabel: Localization.localizeOptional("Duplicate project") + " " + projectName,
      title: Localization.localizeOptional("Duplicate project")
    });
    var icon = newHTML("span", "project-duplicate-icon", button);
    icon.setAttribute("aria-hidden", "true");
    newHTML("span", "project-duplicate-icon-back", icon);
    newHTML("span", "project-duplicate-icon-front", icon);
    Home.stopCardGesture(button);
    button.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      button.focus();
      Home.performActionForTarget(target, "duplicate");
    };
  }

  static addProjectDeleteButton(target, projectName, parent) {
    var button = newButton("project-delete-button", parent, {
      ariaLabel: Localization.localize("A11Y_DELETE") + " " + projectName,
      title: Localization.localizeOptional("Delete project"),
      textContent: "\u00d7"
    });
    Home.stopCardGesture(button);
    button.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      button.focus();
      Home.showDeleteConfirmation(target, projectName);
    };
    target.oncontextmenu = function (e) {
      e.preventDefault();
      e.stopPropagation();
    };
  }

  static showDeleteConfirmation(target, projectName) {
    var dialog = newHTML("div", "project-delete-dialog-backdrop", frame);
    var panel = newHTML("div", "project-delete-dialog", dialog);
    var titleId = "project-delete-title-" + target.id;
    var descriptionId = "project-delete-description-" + target.id;
    var title = newHTML("h2", "project-delete-dialog-title", panel);
    title.id = titleId;
    title.textContent = Localization.localizeOptional("Delete project") + "?";
    var description = newHTML("p", "project-delete-dialog-description", panel);
    description.id = descriptionId;
    description.textContent = "\u201c" + projectName + "\u201d "
      + Localization.localizeOptional("will be permanently deleted.");
    var actions = newHTML("div", "project-delete-dialog-actions", panel);
    var cancelButton = newButton("project-delete-cancel", actions, {
      textContent: Localization.localizeOptional("Cancel")
    });
    var deleteButton = newButton("project-delete-confirm", actions, {
      textContent: Localization.localizeOptional("Delete project")
    });

    Home.stopCardGesture(dialog);
    var closeConfirmation = function (restoreFocus) {
      closeDialog(dialog, { restoreFocus: restoreFocus });
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    };
    cancelButton.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeConfirmation(true);
    };
    deleteButton.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeConfirmation(false);
      Home.performActionForTarget(target, "delete");
    };
    dialog.onclick = function (e) {
      if (e.target == dialog) {
        closeConfirmation(true);
      }
    };
    registerDialog(dialog, {
      labelledBy: titleId,
      describedBy: descriptionId,
      initialFocus: cancelButton,
      scope: frame,
      onRequestClose: function () {
        closeConfirmation(true);
      }
    });
    openDialog(dialog);
  }

  static showCloudLoadDialog() {
    if (gn("cloud-project-load-dialog")) {
      return;
    }

    var dialog = newHTML("div", "cloud-project-dialog-backdrop", frame);
    dialog.id = "cloud-project-load-dialog";
    var panel = newHTML("div", "cloud-project-dialog", dialog);
    var titleId = "cloud-project-load-title";
    var descriptionId = "cloud-project-load-description";
    var title = newHTML("h2", "cloud-project-dialog-title", panel);
    title.id = titleId;
    title.textContent = Localization.localizeOptional("Load cloud project");
    var description = newHTML("p", "cloud-project-dialog-description", panel);
    description.id = descriptionId;
    description.textContent = Localization.localizeOptional(
      "Enter a cloud project ID. The project will be imported as a new local copy."
    );

    var form = newHTML("form", "cloud-project-load-form", panel);
    var inputLabel = newHTML("label", "cloud-project-input-label", form);
    inputLabel.setAttribute("for", "cloud-project-id-input");
    inputLabel.textContent = Localization.localizeOptional("Project ID");
    var input = newHTML("input", "cloud-project-id-input", form);
    input.id = "cloud-project-id-input";
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.maxLength = 64;

    var actions = newHTML("div", "cloud-project-dialog-actions", form);
    var cancelButton = newButton("cloud-project-cancel", actions, {
      textContent: Localization.localizeOptional("Cancel")
    });
    var loadButton = newButton("cloud-project-load", actions, {
      type: "submit",
      textContent: Localization.localizeOptional("Load project")
    });
    loadButton.id = "cloud-project-load-submit";

    var status = newHTML("p", "cloud-project-load-status", panel);
    status.id = "cloud-project-load-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    var storedEntries = getStoredCloudIds();
    storedEntries.sort(function (a, b) {
      return (b.lastUsed || b.savedAt || 0) - (a.lastUsed || a.savedAt || 0);
    });
    var savedSection = newHTML("div", "cloud-project-saved-section", panel);
    var savedTitle = newHTML("h3", "cloud-project-saved-title", savedSection);
    savedTitle.textContent = Localization.localizeOptional("Saved cloud IDs");
    var savedList = newHTML("div", "cloud-project-saved-list", savedSection);
    if (storedEntries.length < 1) {
      var emptyMessage = newHTML("p", "cloud-project-saved-empty", savedList);
      emptyMessage.textContent = Localization.localizeOptional("No saved cloud IDs on this device yet.");
    }

    var loading = false;
    var savedButtons = [];

    function setLoading(isLoading) {
      loading = isLoading;
      input.disabled = isLoading;
      loadButton.disabled = isLoading;
      cancelButton.disabled = isLoading;
      for (var i = 0; i < savedButtons.length; i++) {
        savedButtons[i].disabled = isLoading;
      }
      panel.setAttribute("aria-busy", isLoading ? "true" : "false");
    }

    function setStatus(message, isError) {
      status.textContent = message;
      status.className = isError
        ? "cloud-project-load-status error"
        : "cloud-project-load-status";
      status.setAttribute("role", isError ? "alert" : "status");
    }

    function closeLoadDialog(restoreFocus) {
      if (loading) {
        return;
      }
      closeDialog(dialog, { restoreFocus: restoreFocus });
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    }

    function loadCloudProject(customId) {
      var trimmedId = customId ? customId.trim() : "";
      if (loading) {
        return;
      }
      if (!trimmedId) {
        setStatus(Localization.localizeOptional("Enter a cloud project ID."), true);
        input.focus();
        return;
      }
      setLoading(true);
      setStatus(Localization.localizeOptional("Loading cloud project…"), false);
      ProjectCloud.loadProjectFromCloud(trimmedId, { targetVersion: version }).then(function (result) {
        if (!result || !result.projectId) {
          throw new Error("Cloud project import did not return a local project ID");
        }
        addStoredCloudId({
          customId: result.customId || trimmedId,
          projectName: result.projectName || "",
          savedAt: result.savedAt || Date.now(),
          lastUsed: Date.now()
        });
        setStatus(Localization.localizeOptional("Cloud project loaded. Opening…"), false);
        Home.gotoEditor(result.projectId);
      }).catch(function (err) {
        console.warn("Home: cloud project load failed", err);
        setLoading(false);
        setStatus(
          Localization.localizeOptional("Cloud project could not be loaded. Check the ID and try again."),
          true
        );
        input.focus();
        input.select();
      });
    }

    for (var i = 0; i < storedEntries.length; i++) {
      (function (entry) {
        var label = entry.projectName
          ? entry.projectName + " (" + entry.customId + ")"
          : entry.customId;
        var savedButton = newButton("cloud-project-saved-button", savedList, {
          textContent: label,
          ariaLabel: Localization.localizeOptional("Load cloud project") + " " + label
        });
        savedButton.setAttribute("data-cloud-id", entry.customId);
        savedButton.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          loadCloudProject(entry.customId);
        };
        savedButtons.push(savedButton);
      })(storedEntries[i]);
    }

    Home.stopCardGesture(dialog);
    form.onsubmit = function (e) {
      e.preventDefault();
      e.stopPropagation();
      loadCloudProject(input.value);
    };
    cancelButton.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeLoadDialog(true);
    };
    dialog.onclick = function (e) {
      if (e.target == dialog) {
        closeLoadDialog(true);
      }
    };
    registerDialog(dialog, {
      labelledBy: titleId,
      describedBy: descriptionId,
      initialFocus: input,
      scope: frame,
      onRequestClose: function () {
        closeLoadDialog(true);
      }
    });
    openDialog(dialog);
  }

  //////////////////////////
  // Gather projects
  //////////////////////////

  static displayYourProjects() {
    OS.getfile("homescroll.sjr", gotScrollsState);
    function gotScrollsState(str) {
      let num = Number(atob(str));
      scrollvalue = num.toString() == "NaN" ? 0 : num;
      var json = {};
      json.cond = "deleted = ? AND version = ? AND gallery IS NULL";
      json.items = ["name", "thumbnail", "id", "isgift"];
      json.values = ["NO", version];
      json.order = "ctime desc";
      IO.query(OS.database, json, Home.displayProjects);
    }
  }

  static displayProjects(str) {
    console.log("displayProjects", str);
    setTimeout(function () {
      let data = JSON.parse(str);
      var div = gn("scrollarea");
      while (div.childElementCount > 0) {
        div.removeChild(div.childNodes[0]);
      }
      Home.emptyProjectThumbnail(div);
      Home.cloudProjectThumbnail(div);
      for (var i = 0; i < data.length; i++) {
        Home.addProjectLink(div, data[i]);
      }
      if (pendingProjectFocus) {
        var duplicatedCard = gn(pendingProjectFocus);
        var duplicateButton = duplicatedCard
          ? duplicatedCard.querySelector(".project-duplicate-button")
          : null;
        pendingProjectFocus = undefined;
        if (duplicateButton) {
          duplicateButton.focus();
        }
      }
      setTimeout(function () {
        Lobby.busy = false;
      }, 1000);
      if (gn("wrapc")) {
        gn("wrapc").scrollTop = scrollvalue;
      }
    }, 3);
  }

  static addProjectLink(parent, aa) {
    var data = IO.parseProjectData(aa);
    var id = data.id;
    var th = data.thumbnail;
    if (!th) {
      return;
    }
    var thumb = typeof th === "string" ? JSON.parse(th) : th;
    var pc = thumb.pagecount ? thumb.pagecount : 1;
    var tb = newHTML("div", "projectthumb", parent);
    tb.setAttribute("id", id);
    tb.type = "projectthumb";
    tb.thumb = thumb.md5;
    var mt = newHTML("div", "aproject p" + pc, tb);
    Home.insertThumbnail(mt, 192, 144, thumb);
    var label = newHTML("div", "projecttitle", tb);
    var txt = newHTML("h4", undefined, label);
    txt.textContent = data.name;

    var bow = newHTML("div", "share", tb);
    var ribbonHorizontal = newHTML("div", "ribbonHorizontal", tb);
    var ribbonVertical = newHTML("div", "ribbonVertical", tb);

    if (data.isgift != "0") {
      // If it's a gift, show the bow and ribbon
      bow.style.visibility = "visible";
      ribbonHorizontal.style.visibility = "visible";
      ribbonVertical.style.visibility = "visible";
    }

    Home.addProjectDuplicateButton(tb, data.name, mt);
    Home.addProjectDeleteButton(tb, data.name, mt);
    Home.addCardActionButton(
      tb,
      "card-action-open",
      Localization.localize("A11Y_OPEN") + " " + data.name,
      function (e) {
        e.preventDefault();
        e.stopPropagation();
        Home.performActionForTarget(tb, "project");
      }
    );
  }

  static insertThumbnail(p, w, h, data) {
    var md5 = data.md5;
    var img = newHTML("img", undefined, p);
    img.alt = "";
    img.draggable = false;
    if (md5) {
      IO.getAsset(md5, drawMe);
    }
    img.ondragstart = function () {
      return false;
    };
    function drawMe(url) {
      img.src = url;
    }
  }

  static addCardActionButton(parent, className, label, handler) {
    var button = newButton("sr-only-focusable lobby-card-action " + className, parent, {
      ariaLabel: label
    });
    button.textContent = label;
    button.onclick = handler;
    return button;
  }
}

class Events {
  static getTargetPoint(e) {
    if (isTablet) {
      if (e.touches && e.touches.length > 0) {
        return {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY,
        };
      } else if (e.changedTouches) {
        return {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY,
        };
      }
    }
    return {
      x: e.clientX,
      y: e.clientY,
    };
  }
}
