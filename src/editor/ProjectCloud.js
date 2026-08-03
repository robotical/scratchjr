import ScratchJr from "./ScratchJr";
import IO from "../tablet/IO";
import { dataStoreInstance } from "../webapp-interface/ScratchJRDataStore";
import StaticFiles from "../webapp-interface/StaticFiles";
import WebappInterface from "../webapp-interface/WebappInterface";

function toLowerKeys(row) {
  var result = {};
  for (var key in row) {
    if (!row.hasOwnProperty(key)) {
      continue;
    }
    result[key.toLowerCase()] = row[key];
  }
  return result;
}

function unique(array) {
  var seen = {};
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    if (!item && item !== 0) {
      continue;
    }
    if (seen[item]) {
      continue;
    }
    seen[item] = true;
    result.push(item);
  }
  return result;
}

function candidatePathsFor(md5) {
  var cleaned = md5.replace(/^\.?\//, "");
  var candidates = [];
  if (cleaned.indexOf("/") > -1) {
    candidates.push("./" + cleaned);
  }
  var extension = "";
  if (cleaned.indexOf(".") > -1) {
    extension = cleaned.substring(cleaned.lastIndexOf(".") + 1).toLowerCase();
  }
  switch (extension) {
  case "svg":
    candidates.push("./svglibrary/" + cleaned);
    break;
  case "png":
  case "jpg":
  case "jpeg":
    candidates.push("./pnglibrary/" + cleaned);
    break;
  case "mp3":
    if (cleaned === "pop.mp3") {
      candidates.push("./" + cleaned);
    } else {
      candidates.push("./sounds/" + cleaned);
    }
    break;
  case "wav":
  case "webm":
  case "m4a":
  case "ogg":
    candidates.push("./sounds/" + cleaned);
    break;
  default:
    candidates.push("./" + cleaned);
    break;
  }
  var deduped = [];
  var seen = {};
  for (var j = 0; j < candidates.length; j++) {
    var path = candidates[j];
    if (seen[path]) {
      continue;
    }
    seen[path] = true;
    deduped.push(path);
  }
  return deduped;
}

async function fetchStaticAssetBase64(md5) {
  var candidates = candidatePathsFor(md5);
  for (var i = 0; i < candidates.length; i++) {
    var path = candidates[i];
    try {
      var buffer = await StaticFiles.readFile(path);
      if (buffer && buffer.byteLength > 0) {
        return StaticFiles.arrayBufferToBase64(buffer);
      }
    } catch (err) {
      console.warn("ProjectCloud: failed to read static asset", md5, err);
    }
  }
  return null;
}

async function fetchProjectFileBase64(md5) {
  try {
    return await dataStoreInstance.readProjectFileAsBase64EncodedString(md5);
  } catch (err) {
    console.warn("ProjectCloud: failed to read project file", md5, err);
    return null;
  }
}

async function ensureProjectFile(md5, base64) {
  if (!base64) {
    return;
  }
  var existing = await fetchProjectFileBase64(md5);
  if (existing) {
    if (existing !== base64) {
      throw new Error("Project asset identifier collision: " + md5);
    }
    return;
  }
  try {
    var result = await dataStoreInstance.writeProjectFile(md5, base64, { encoding: "base64" });
    if (result === -1) {
      throw new Error("Failed to persist project asset: " + md5);
    }
  } catch (err) {
    console.warn("ProjectCloud: failed to persist asset", md5, err);
    throw err;
  }
}

function collectAssetIds(metadata) {
  var ids = [];
  if (metadata.thumbnail && metadata.thumbnail.md5) {
    ids.push(metadata.thumbnail.md5);
  }
  var projectJSON = metadata.json || {};
  var pages = projectJSON.pages || [];
  for (var i = 0; i < pages.length; i++) {
    var pageId = pages[i];
    var page = projectJSON[pageId];
    if (!page) {
      continue;
    }
    if (page.md5) {
      ids.push(page.md5);
    }
    if (!page.sprites || !page.sprites.length) {
      continue;
    }
    for (var s = 0; s < page.sprites.length; s++) {
      var spriteId = page.sprites[s];
      var sprite = page[spriteId];
      if (!sprite) {
        continue;
      }
      if (sprite.md5) {
        ids.push(sprite.md5);
      }
      if (sprite.animationFrames && sprite.animationFrames.length) {
        for (var frame = 0; frame < sprite.animationFrames.length; frame++) {
          if (sprite.animationFrames[frame]) {
            ids.push(sprite.animationFrames[frame]);
          }
        }
      }
      if (!sprite.sounds || !sprite.sounds.length) {
        continue;
      }
      for (var snd = 0; snd < sprite.sounds.length; snd++) {
        if (sprite.sounds[snd]) {
          ids.push(sprite.sounds[snd]);
        }
      }
    }
  }
  return unique(ids);
}

async function fetchProjectMetadata(projectId) {
  var db = await dataStoreInstance.getDatabaseManager();
  var rows = db.query({
    stmt: "select * from projects where id = ?",
    values: [projectId],
  });
  if (!rows || rows.length < 1) {
    throw new Error("Project not found");
  }
  var row = toLowerKeys(rows[0]);
  var metadata = {
    id: row.id,
    name: row.name,
    version: row.version,
    deleted: row.deleted,
    mtime: row.mtime,
    ctime: row.ctime,
    gallery: row.gallery,
    isgift: row.isgift,
    thumbnail: row.thumbnail ? JSON.parse(row.thumbnail) : null,
    json: row.json ? JSON.parse(row.json) : null,
  };
  return metadata;
}

async function insertProject(metadata) {
  return await new Promise(function (resolve, reject) {
    IO.createProject({
      name: metadata.name,
      version: metadata.version || ScratchJr.version,
      json: metadata.json,
      thumbnail: metadata.thumbnail,
      isgift: metadata.isgift || "0",
    }, function (result) {
      if (typeof result === "number" && result >= 0) {
        resolve(result.toString());
      } else if (typeof result === "string" && result !== "-1") {
        resolve(result);
      } else {
        reject(new Error("Failed to create project"));
      }
    });
  });
}

export default class ProjectCloud {
  static async buildExportPackage(projectId) {
    var metadata = await fetchProjectMetadata(projectId);
    if (metadata.json && typeof metadata.json === "string") {
      try {
        metadata.json = JSON.parse(metadata.json);
      } catch (err) {
        console.warn("ProjectCloud.buildExportPackage could not parse project json", err);
      }
    }
    if (metadata.thumbnail && typeof metadata.thumbnail === "string") {
      try {
        metadata.thumbnail = JSON.parse(metadata.thumbnail);
      } catch (err) {
        console.warn("ProjectCloud.buildExportPackage could not parse thumbnail json", err);
      }
    }
    var assetIds = collectAssetIds(metadata);
    var assets = {};
    for (var i = 0; i < assetIds.length; i++) {
      var md5 = assetIds[i];
      var encoded = await fetchProjectFileBase64(md5);
      if (!encoded) {
        encoded = await fetchStaticAssetBase64(md5);
      }
      if (encoded) {
        assets[md5] = encoded;
      }
    }
    return {
      formatVersion: 1,
      exportedAt: Date.now(),
      project: metadata,
      assets: assets,
    };
  }

  static async saveCurrentProjectToCloud() {
    var projectId = ScratchJr.currentProject;
    if (!projectId) {
      throw new Error("No active project to save");
    }
    var packageData = await ProjectCloud.buildExportPackage(projectId);
    var response = await WebappInterface.cloud_saveProject({
      packageData: packageData,
    });
    if (!response) {
      return {
        projectName: packageData.project && packageData.project.name,
        savedAt: Date.now(),
        customId: packageData.project && packageData.project.custom_id,
      };
    }
    if (!response.customId && packageData.project && packageData.project.custom_id) {
      response.customId = packageData.project.custom_id;
    }
    if (!response.projectName && packageData.project && packageData.project.name) {
      response.projectName = packageData.project.name;
    }
    return response;
  }

  static async loadProjectFromCloud(customId, options) {
    var result = await WebappInterface.cloud_loadProject(customId);
    if (!result || !result.packageData) {
      var notFoundError = new Error("Project not found in cloud");
      notFoundError.code = "CLOUD_PROJECT_NOT_FOUND";
      throw notFoundError;
    }
    var packageData = result.packageData;
    if (packageData && packageData.project && typeof packageData.project === "object" &&
        !packageData.project.name && result.projectName) {
      packageData.project.name = result.projectName;
    }
    var importResult = await ProjectCloud.importPackage(packageData, options);
    var newProjectId = importResult.projectId;
    var metadata = importResult.metadata;
    var newName = (metadata && metadata.name) || result.projectName || "Untitled Project";
    return {
      projectId: newProjectId,
      customId: result.customId || customId,
      projectName: newName,
      packageData: packageData,
      metadata: metadata,
      cloudId: result.cloudId || packageData.cloudId,
      savedAt: result.savedAt,
    };
  }

  static async importPackage(packageData, options) {
    if (!packageData || !packageData.project) {
      throw new Error("Invalid project package");
    }
    var assets = packageData.assets || {};
    var assetIds = Object.keys(assets);
    for (var i = 0; i < assetIds.length; i++) {
      var md5 = assetIds[i];
      await ensureProjectFile(md5, assets[md5]);
    }
    var projectMetadata = packageData.project;
    if (typeof projectMetadata === "string") {
      try {
        projectMetadata = JSON.parse(projectMetadata);
      } catch (err) {
        throw new Error("Invalid project metadata");
      }
    }
    if (!projectMetadata || typeof projectMetadata !== "object" || Array.isArray(projectMetadata)) {
      throw new Error("Invalid project metadata");
    }
    projectMetadata = Object.assign({}, projectMetadata);
    if (!projectMetadata.name) {
      projectMetadata.name = "Imported Project";
    }
    if (projectMetadata.json && typeof projectMetadata.json === "string") {
      try {
        projectMetadata.json = JSON.parse(projectMetadata.json);
      } catch (err) {
        console.warn("ProjectCloud: failed to parse project json", err);
      }
    }
    if (projectMetadata.thumbnail && typeof projectMetadata.thumbnail === "string") {
      try {
        projectMetadata.thumbnail = JSON.parse(projectMetadata.thumbnail);
      } catch (err) {
        console.warn("ProjectCloud: failed to parse thumbnail json", err);
      }
    }
    var targetVersion = options && options.targetVersion;
    projectMetadata.version = targetVersion || projectMetadata.version || ScratchJr.version;
    if (!projectMetadata.version) {
      throw new Error("Missing project version");
    }
    var newId = await insertProject(projectMetadata);
    projectMetadata.id = newId;
    if (!projectMetadata.deleted) {
      projectMetadata.deleted = "NO";
    }
    await new Promise(function (resolve) {
      IO.saveProject(projectMetadata, function () {
        resolve();
      });
    });
    var db = await dataStoreInstance.getDatabaseManager();
    await db.save();
    return {
      projectId: newId,
      metadata: projectMetadata,
    };
  }
}
