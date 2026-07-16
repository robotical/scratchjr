import crypto from "crypto-js";
import ProjectCloud from "./ProjectCloud";

export const CURRICULUM_ARTIFACT_URL_PARAM = "curriculumArtifactUrl";
export const CURRICULUM_ARTIFACT_SHA256_PARAM = "curriculumArtifactSha256";
export const CURRICULUM_ARTIFACT_KIND = "robotical.curriculum-code-artifact";
export const CURRICULUM_ARTIFACT_FORMAT_VERSION = 1;
export const CURRICULUM_ARTIFACT_PLATFORM = "martyblocksjr";

export const CURRICULUM_ARTIFACT_LIMITS = Object.freeze({
  maxUrlLength: 4096,
  maxDownloadBytes: 20 * 1024 * 1024,
  maxProjectJsonBytes: 2 * 1024 * 1024,
  maxAssets: 512,
  maxAssetBytes: 8 * 1024 * 1024,
  maxTotalAssetBytes: 13 * 1024 * 1024,
  maxAssetIdLength: 255,
  maxProjectNameLength: 120,
  maxPages: 64,
  maxSpritesPerPage: 256,
  maxScriptsPerSprite: 512,
  maxBlocksPerScript: 2048,
  maxScriptNestingDepth: 32,
  maxAnimationFramesPerSprite: 128,
  maxSoundsPerSprite: 128,
  fetchTimeoutMs: 15000,
});

const JSON_CONTENT_TYPES = [
  "application/json",
  "application/vnd.robotical.curriculum-code-artifact+json",
];

function fail(message) {
  throw new Error("Invalid curriculum artifact: " + message);
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  var prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function utf8ByteLength(value) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(value).byteLength;
  }
  return unescape(encodeURIComponent(value)).length; // eslint-disable-line no-undef
}

function cloneJson(value, label) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (err) {
    fail(label + " must contain valid JSON data");
  }
}

function parseJsonObject(value, label) {
  var parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch (err) {
      fail(label + " is not valid JSON");
    }
  }
  if (!isPlainObject(parsed)) {
    fail(label + " must be an object");
  }
  return parsed;
}

function validateShortString(value, label, maximumLength, required) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      fail(label + " is required");
    }
    return undefined;
  }
  if (typeof value !== "string") {
    fail(label + " must be a string");
  }
  var trimmed = value.trim();
  if ((required && !trimmed) || trimmed.length > maximumLength || /[\x00-\x1f\x7f]/.test(trimmed)) {
    fail(label + " is invalid");
  }
  return trimmed;
}

function validateAssetId(value, label) {
  var assetId = validateShortString(
    value,
    label,
    CURRICULUM_ARTIFACT_LIMITS.maxAssetIdLength,
    true
  );
  var lowered = assetId.toLowerCase();
  if (
    assetId.charAt(0) === "/" ||
    assetId.indexOf("\\") > -1 ||
    assetId.indexOf(":") > -1 ||
    assetId.indexOf("%") > -1 ||
    assetId.indexOf("?") > -1 ||
    assetId.indexOf("#") > -1 ||
    assetId.indexOf("://") > -1 ||
    assetId.split("/").some(function (part) { return !part || part === "." || part === ".."; }) ||
    lowered === "__proto__" ||
    lowered === "prototype" ||
    lowered === "constructor"
  ) {
    fail(label + " must be a safe relative asset identifier");
  }
  return assetId;
}

function validateStringArray(value, label, maximumLength) {
  if (!Array.isArray(value) || value.length > maximumLength) {
    fail(label + " must be an array with at most " + maximumLength + " entries");
  }
  var seen = Object.create(null);
  return value.map(function (item, index) {
    var result = validateShortString(item, label + "[" + index + "]", 255, true);
    if (seen[result]) {
      fail(label + " contains duplicate identifiers");
    }
    seen[result] = true;
    return result;
  });
}

function addAssetReference(references, value, label) {
  if (value === undefined || value === null || value === "" || value === "none") {
    return;
  }
  references[validateAssetId(value, label)] = true;
}

function validateScriptValue(value, label, depth) {
  if (depth > CURRICULUM_ARTIFACT_LIMITS.maxScriptNestingDepth) {
    fail(label + " is nested too deeply");
  }
  if (!Array.isArray(value)) {
    if (
      value !== null &&
      typeof value !== "string" &&
      typeof value !== "number" &&
      typeof value !== "boolean"
    ) {
      fail(label + " contains an unsupported value");
    }
    return;
  }
  if (value.length > CURRICULUM_ARTIFACT_LIMITS.maxBlocksPerScript) {
    fail(label + " contains too many values");
  }
  value.forEach(function (item, index) {
    validateScriptValue(item, label + "[" + index + "]", depth + 1);
  });
}

function validateScripts(value, spriteId) {
  if (!Array.isArray(value) || value.length > CURRICULUM_ARTIFACT_LIMITS.maxScriptsPerSprite) {
    fail("sprite " + spriteId + " scripts are invalid");
  }
  value.forEach(function (strip, stripIndex) {
    if (!Array.isArray(strip) || strip.length > CURRICULUM_ARTIFACT_LIMITS.maxBlocksPerScript) {
      fail("sprite " + spriteId + " script " + stripIndex + " is invalid");
    }
    strip.forEach(function (block, blockIndex) {
      if (!Array.isArray(block) || typeof block[0] !== "string" || !block[0]) {
        fail("sprite " + spriteId + " script " + stripIndex + " block " + blockIndex + " is invalid");
      }
      validateScriptValue(block, "sprite " + spriteId + " script " + stripIndex + " block " + blockIndex, 0);
    });
  });
}

function validateProjectJson(projectJson) {
  var serialized;
  try {
    serialized = JSON.stringify(projectJson);
  } catch (err) {
    fail("projectPackage.project.json must be serializable");
  }
  if (!serialized || utf8ByteLength(serialized) > CURRICULUM_ARTIFACT_LIMITS.maxProjectJsonBytes) {
    fail("projectPackage.project.json is too large");
  }

  var pages = validateStringArray(
    projectJson.pages,
    "projectPackage.project.json.pages",
    CURRICULUM_ARTIFACT_LIMITS.maxPages
  );
  if (pages.length < 1) {
    fail("projectPackage.project.json.pages must contain at least one page");
  }
  if (typeof projectJson.currentPage !== "string" || pages.indexOf(projectJson.currentPage) < 0) {
    fail("projectPackage.project.json.currentPage must reference a page");
  }

  var assetReferences = Object.create(null);
  pages.forEach(function (pageId) {
    if (!hasOwn(projectJson, pageId) || !isPlainObject(projectJson[pageId])) {
      fail("projectPackage.project.json is missing page " + pageId);
    }
    var page = projectJson[pageId];
    addAssetReference(assetReferences, page.md5, "page " + pageId + " background");
    var sprites = validateStringArray(
      page.sprites,
      "page " + pageId + " sprites",
      CURRICULUM_ARTIFACT_LIMITS.maxSpritesPerPage
    );
    var layers = validateStringArray(
      page.layers,
      "page " + pageId + " layers",
      CURRICULUM_ARTIFACT_LIMITS.maxSpritesPerPage
    );
    if (
      layers.length !== sprites.length ||
      layers.some(function (layerId) { return sprites.indexOf(layerId) < 0; })
    ) {
      fail("page " + pageId + " layers must contain every sprite exactly once");
    }
    if (page.lastSprite !== undefined && sprites.indexOf(page.lastSprite) < 0) {
      fail("page " + pageId + " lastSprite must reference a sprite");
    }
    sprites.forEach(function (spriteId) {
      if (!hasOwn(page, spriteId) || !isPlainObject(page[spriteId])) {
        fail("page " + pageId + " is missing sprite " + spriteId);
      }
      var sprite = page[spriteId];
      if (sprite.id !== spriteId || (sprite.type !== "sprite" && sprite.type !== "text")) {
        fail("sprite " + spriteId + " identity or type is invalid");
      }
      if (sprite.type === "sprite") {
        addAssetReference(assetReferences, sprite.md5, "sprite " + spriteId + " image");
        if (!sprite.md5) {
          fail("sprite " + spriteId + " image is required");
        }
        if (!Array.isArray(sprite.sounds) || sprite.sounds.length > CURRICULUM_ARTIFACT_LIMITS.maxSoundsPerSprite) {
          fail("sprite " + spriteId + " sounds are invalid");
        }
        sprite.sounds.forEach(function (sound, index) {
          addAssetReference(assetReferences, sound, "sprite " + spriteId + " sound " + index);
        });
        if (sprite.animationFrames !== undefined) {
          if (
            !Array.isArray(sprite.animationFrames) ||
            sprite.animationFrames.length > CURRICULUM_ARTIFACT_LIMITS.maxAnimationFramesPerSprite
          ) {
            fail("sprite " + spriteId + " animation frames are invalid");
          }
          sprite.animationFrames.forEach(function (frame, index) {
            addAssetReference(assetReferences, frame, "sprite " + spriteId + " animation frame " + index);
          });
        }
        validateScripts(sprite.scripts, spriteId);
      } else if (typeof sprite.str !== "string" || sprite.str.length > 10000) {
        fail("text " + spriteId + " content is invalid");
      }
    });
  });

  return assetReferences;
}

function decodedBase64Length(value) {
  var padding = 0;
  if (value.slice(-2) === "==") {
    padding = 2;
  } else if (value.slice(-1) === "=") {
    padding = 1;
  }
  return (value.length / 4) * 3 - padding;
}

function validateAssets(value, references) {
  if (value === undefined || value === null) {
    return {};
  }
  if (!isPlainObject(value)) {
    fail("projectPackage.assets must be an object");
  }
  var assetIds = Object.keys(value);
  if (assetIds.length > CURRICULUM_ARTIFACT_LIMITS.maxAssets) {
    fail("projectPackage.assets contains too many assets");
  }
  var totalBytes = 0;
  var assets = Object.create(null);
  assetIds.forEach(function (rawAssetId) {
    var assetId = validateAssetId(rawAssetId, "projectPackage asset identifier");
    if (!references[assetId]) {
      fail("projectPackage.assets contains an unreferenced asset: " + assetId);
    }
    var encoded = value[rawAssetId];
    if (
      typeof encoded !== "string" ||
      !encoded ||
      encoded.length % 4 !== 0 ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)
    ) {
      fail("projectPackage asset " + assetId + " is not valid base64");
    }
    var assetBytes = decodedBase64Length(encoded);
    if (assetBytes > CURRICULUM_ARTIFACT_LIMITS.maxAssetBytes) {
      fail("projectPackage asset " + assetId + " is too large");
    }
    totalBytes += assetBytes;
    if (totalBytes > CURRICULUM_ARTIFACT_LIMITS.maxTotalAssetBytes) {
      fail("projectPackage assets are too large");
    }
    assets[assetId] = encoded;
  });
  return assets;
}

/**
 * Validate and normalize a curriculum artifact before ProjectCloud writes any
 * project or asset data. Only editable local-copy metadata is retained.
 */
export function validateCurriculumArtifact(value, options) {
  var artifact = parseJsonObject(value, "artifact");
  if (artifact.kind !== CURRICULUM_ARTIFACT_KIND) {
    fail("kind is not supported");
  }
  if (artifact.formatVersion !== CURRICULUM_ARTIFACT_FORMAT_VERSION) {
    fail("formatVersion is not supported");
  }
  if (artifact.platform !== CURRICULUM_ARTIFACT_PLATFORM) {
    fail("platform must be " + CURRICULUM_ARTIFACT_PLATFORM);
  }
  if (!isPlainObject(artifact.projectPackage) || artifact.projectPackage.formatVersion !== 1) {
    fail("projectPackage formatVersion is not supported");
  }

  var sourceProject = parseJsonObject(artifact.projectPackage.project, "projectPackage.project");
  var projectJson = parseJsonObject(sourceProject.json, "projectPackage.project.json");
  var assetReferences = validateProjectJson(projectJson);
  var thumbnail = null;
  if (sourceProject.thumbnail !== undefined && sourceProject.thumbnail !== null) {
    thumbnail = parseJsonObject(sourceProject.thumbnail, "projectPackage.project.thumbnail");
    var thumbnailSerialized = JSON.stringify(thumbnail);
    if (utf8ByteLength(thumbnailSerialized) > 64 * 1024) {
      fail("projectPackage.project.thumbnail is too large");
    }
    addAssetReference(assetReferences, thumbnail.md5, "project thumbnail");
  }

  var name = validateShortString(
    sourceProject.name || "Imported Project",
    "projectPackage.project.name",
    CURRICULUM_ARTIFACT_LIMITS.maxProjectNameLength,
    true
  );
  var fallbackVersion = options && options.projectVersion;
  var version = validateShortString(
    sourceProject.version || fallbackVersion,
    "projectPackage.project.version",
    64,
    true
  );
  var assets = validateAssets(artifact.projectPackage.assets, assetReferences);

  return {
    formatVersion: 1,
    project: {
      name: name,
      version: version,
      deleted: "NO",
      isgift: "0",
      thumbnail: thumbnail ? cloneJson(thumbnail, "projectPackage.project.thumbnail") : null,
      json: cloneJson(projectJson, "projectPackage.project.json"),
    },
    assets: assets,
  };
}

function isLoopbackHostname(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function allowedOriginSet(baseUrl, configuredOrigins) {
  var result = Object.create(null);
  // Parse the base URL here so malformed host state fails closed. Production
  // origins are not trusted implicitly; they must be configured explicitly.
  new URL(baseUrl);
  (Array.isArray(configuredOrigins) ? configuredOrigins : []).forEach(function (origin) {
    try {
      var parsed = new URL(origin);
      if (parsed.origin === origin && (parsed.protocol === "https:" || (parsed.protocol === "http:" && isLoopbackHostname(parsed.hostname)))) {
        result[parsed.origin] = true;
      }
    } catch (err) {
      // Invalid configured origins are ignored rather than weakening the policy.
    }
  });
  return result;
}

function isAllowedArtifactUrl(url, origins) {
  return Boolean(
    origins[url.origin] ||
    ((url.protocol === "http:" || url.protocol === "https:") && isLoopbackHostname(url.hostname))
  );
}

export function parseCurriculumArtifactRequest(search, options) {
  var params = new URLSearchParams(search || "");
  var rawUrl = params.get(CURRICULUM_ARTIFACT_URL_PARAM);
  var rawSha256 = params.get(CURRICULUM_ARTIFACT_SHA256_PARAM);
  if (!rawUrl && !rawSha256) {
    return null;
  }
  if (!rawUrl || rawUrl.length > CURRICULUM_ARTIFACT_LIMITS.maxUrlLength) {
    fail(CURRICULUM_ARTIFACT_URL_PARAM + " is missing or too long");
  }
  if (rawSha256 && !/^[a-f0-9]{64}$/i.test(rawSha256)) {
    fail(CURRICULUM_ARTIFACT_SHA256_PARAM + " must be a SHA-256 hex digest");
  }

  var baseUrl = options && options.baseUrl;
  if (!baseUrl) {
    fail("a base URL is required");
  }
  var url;
  try {
    url = new URL(rawUrl);
  } catch (err) {
    fail(CURRICULUM_ARTIFACT_URL_PARAM + " must be an absolute URL");
  }
  if (
    (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopbackHostname(url.hostname))) ||
    url.username ||
    url.password ||
    url.hash
  ) {
    fail(CURRICULUM_ARTIFACT_URL_PARAM + " must be a safe HTTPS URL");
  }
  if (!rawSha256 && !isLoopbackHostname(url.hostname)) {
    fail(CURRICULUM_ARTIFACT_SHA256_PARAM + " is required outside local development");
  }
  var origins = allowedOriginSet(baseUrl, options && options.allowedOrigins);
  if (!isAllowedArtifactUrl(url, origins)) {
    fail(CURRICULUM_ARTIFACT_URL_PARAM + " origin is not allowed");
  }

  return {
    url: url.toString(),
    sha256: rawSha256 ? rawSha256.toLowerCase() : null,
    allowedOrigins: origins,
  };
}

export function sha256Hex(arrayBuffer) {
  var words = crypto.lib.WordArray.create(new Uint8Array(arrayBuffer));
  return crypto.SHA256(words).toString(crypto.enc.Hex);
}

function responseHeader(response, name) {
  return response.headers && typeof response.headers.get === "function" ? response.headers.get(name) : null;
}

async function fetchArtifact(request, fetchImplementation) {
  if (typeof fetchImplementation !== "function") {
    throw new Error("Curriculum artifact fetch is unavailable");
  }
  var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  var timeoutId;
  var timeoutPromise = new Promise(function (resolve, reject) {
    timeoutId = setTimeout(function () {
      if (controller) {
        controller.abort();
      }
      reject(new Error("Curriculum artifact request timed out"));
    }, CURRICULUM_ARTIFACT_LIMITS.fetchTimeoutMs);
  });
  var fetchPromise = Promise.resolve().then(function () {
    return fetchImplementation(request.url, {
      method: "GET",
      credentials: "omit",
      cache: "no-store",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: {
        Accept: JSON_CONTENT_TYPES.join(", "),
      },
      signal: controller ? controller.signal : undefined,
    });
  });
  var response;
  try {
    response = await Promise.race([fetchPromise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
  if (!response || !response.ok) {
    throw new Error("Curriculum artifact request failed");
  }
  if (response.url) {
    var finalUrl = new URL(response.url);
    if (!isAllowedArtifactUrl(finalUrl, request.allowedOrigins)) {
      throw new Error("Curriculum artifact redirect origin is not allowed");
    }
  }
  var contentType = (responseHeader(response, "content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (JSON_CONTENT_TYPES.indexOf(contentType) < 0) {
    throw new Error("Curriculum artifact response is not JSON");
  }
  var declaredLength = (responseHeader(response, "content-length") || "").trim();
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > CURRICULUM_ARTIFACT_LIMITS.maxDownloadBytes)) {
    throw new Error("Curriculum artifact response is too large");
  }
  var buffer = await response.arrayBuffer();
  if (buffer.byteLength > CURRICULUM_ARTIFACT_LIMITS.maxDownloadBytes) {
    throw new Error("Curriculum artifact response is too large");
  }
  if (request.sha256 && sha256Hex(buffer) !== request.sha256) {
    throw new Error("Curriculum artifact checksum does not match");
  }
  var text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Curriculum artifact response is not valid JSON");
  }
}

/**
 * Resolve, validate and copy a curriculum artifact into local Blocks Jr
 * storage. The source project id and publication metadata are never reused.
 */
export async function importCurriculumArtifactFromSearch(search, options) {
  var request = parseCurriculumArtifactRequest(search, options);
  if (!request) {
    return null;
  }
  var value = await fetchArtifact(request, options && options.fetchImplementation);
  var packageData = validateCurriculumArtifact(value, options);
  return ProjectCloud.importPackage(packageData);
}

export default {
  importFromSearch: importCurriculumArtifactFromSearch,
  parseRequest: parseCurriculumArtifactRequest,
  validate: validateCurriculumArtifact,
};
