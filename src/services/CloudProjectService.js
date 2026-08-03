import randomHashGenerator from "../utils/randomHashGenerator";
const BASE_URL = "https://blocksjr-projects-default-rtdb.firebaseio.com";
const PROJECTS_ENDPOINT = `${BASE_URL}/projects`;

/** ---- helpers ---- */
// Check if a customId already exists in the database
async function customIdExists(customId) {
  const url = `${PROJECTS_ENDPOINT}.json?` + fbQuery({
    orderBy: "custom_id",
    equalTo: customId,
    limitToFirst: 1,
  });
  const result = await request(url, { method: "GET" });
  return !!result && Object.keys(result).length > 0;
}
// Try to generate a unique customId (retrying a few times if needed)
async function generateUniqueCustomId(length = 8, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = randomHashGenerator(length);
    if (!(await customIdExists(candidate))) return candidate;
  }
  throw new Error(`CloudProjectService: failed to generate a unique custom_id after ${maxAttempts} attempts`);
}

// Firebase forbidden chars for *keys* (values are fine)
const FB_FORBIDDEN = /[.#$/\[\]/]/g;

function encodeFirebaseKey(key) {
  // reversible percent-encoding for forbidden chars
  return key.replace(FB_FORBIDDEN, ch => `%${ch.charCodeAt(0).toString(16).toUpperCase()}`);
}

function decodeFirebaseKey(key) {
  return key.replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function encodeAssetsMap(assets) {
  if (!assets || typeof assets !== "object") return assets;
  const out = {};
  for (const [k, v] of Object.entries(assets)) out[encodeFirebaseKey(k)] = v;
  return out;
}

function decodeAssetsMap(assets) {
  if (!assets || typeof assets !== "object") return assets;
  const out = {};
  for (const [k, v] of Object.entries(assets)) out[decodeFirebaseKey(k)] = v;
  return out;
}

// Firebase REST query param builder (JSON-encode values)
function fbQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => qs.append(k, JSON.stringify(v)));
  return qs.toString();
}

async function request(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    // Try to read Firebase error message for easier debugging
    let err = `CloudProjectService: request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body && body.error) err += ` - ${body.error}`;
    } catch { }
    throw new Error(err);
  }
  return response.json();
}

async function fetchEntryByCustomId(customId) {
  const url = `${PROJECTS_ENDPOINT}.json?` + fbQuery({
    orderBy: "custom_id",
    equalTo: customId,
    limitToFirst: 1,
  });
  const result = await request(url, { method: "GET" });
  if (!result) {
    return null;
  }
  const entries = Object.entries(result);
  if (entries.length < 1) {
    return null;
  }
  const [cloudId, data] = entries[0];
  return { cloudId, data };
}

async function updateLastAccessed(cloudId) {
  if (!cloudId) return;
  const trimmed = cloudId.trim();
  if (!trimmed) return;

  try {
    const response = await fetch(`${PROJECTS_ENDPOINT}/${trimmed}/lastAccessed.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Date.now()), // must be valid JSON
    });
    if (!response.ok) {
      console.warn(`CloudProjectService: failed to update lastAccessed (${response.status})`);
    }
  } catch (err) {
    // Loading the project is the primary operation. A best-effort usage timestamp
    // must not make an otherwise valid cloud project impossible to open.
    console.warn("CloudProjectService: failed to update lastAccessed", err);
  }
}

/** ---- public API ---- */

export async function saveProjectPackage(packageData) {
  const savedAt = Date.now();
  const projectName = (packageData && packageData.project && packageData.project.name) || "Untitled Project";
  let projectObject = packageData?.project;

  if (typeof projectObject === "string") {
    try {
      projectObject = JSON.parse(projectObject);
    } catch (err) {
      console.warn("CloudProjectService: project data is string but not valid JSON", err);
    }
  }
  if (projectObject && !projectObject.name) {
    projectObject.name = projectName;
    try {
      packageData.project = projectObject;
    } catch (err) {
      console.warn("CloudProjectService: unable to assign project name", err);
    }
  }

  // 1) Encode assets keys (avoid '.' etc. in keys)
  const safeAssets = packageData?.assets ? encodeAssetsMap(packageData.assets) : undefined;

  // 2) Stringify the *project object* to avoid any key shenanigans inside it
  //    (e.g., "page 1", keys with quotes, etc.). Values are fine; keys are the issue.
  const projectString =
    packageData?.project && typeof packageData.project !== "string"
      ? JSON.stringify(packageData.project)
      : packageData?.project; // already string? keep as is


  const customId = await generateUniqueCustomId(8, 5);

  const payload = {
    savedAt,
    projectName,
    packageData: {
      ...packageData,
      ...(safeAssets ? { assets: safeAssets } : {}),
      ...(projectString ? { project: projectString } : {}),
      custom_id: customId,
    },
  };

  const result = await request(`${PROJECTS_ENDPOINT}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      lastAccessed: savedAt,
      custom_id: customId,
    }),
  });

  if (!result || !result.name) {
    throw new Error("CloudProjectService: missing id from Firebase response");
  }
  const cloudId = result.name;

  return { savedAt, projectName, cloudId, customId };
}

export async function loadProjectPackageByCustomId(customId) {
  if (!customId) return null;
  const trimmed = customId.trim();
  if (!trimmed) return null;

  const entry = await fetchEntryByCustomId(trimmed);
  if (!entry) return null;

  const { cloudId, data } = entry;

  await updateLastAccessed(cloudId);

  const pkg = data.packageData || {};

  // Decode project back to object (if stringified)
  let projectParsed = pkg.project;
  if (typeof projectParsed === "string") {
    try {
      projectParsed = JSON.parse(projectParsed);
    } catch {
      // leave as string if it somehow isn't valid JSON
    }
  }

  const decodedAssets = pkg.assets ? decodeAssetsMap(pkg.assets) : undefined;

  return {
    cloudId,
    savedAt: data.savedAt,
    projectName: data.projectName,
    customId: data.custom_id || trimmed,
    packageData: {
      ...pkg,
      project: projectParsed,
      ...(decodedAssets ? { assets: decodedAssets } : {}),
    },
  };
}

export async function listProjectPackages() {
  const result = await request(`${PROJECTS_ENDPOINT}.json`, { method: "GET" });
  if (!result) return [];
  return Object.keys(result).map((key) => ({
    cloudId: key,
    savedAt: result[key]?.savedAt,
    projectName: result[key]?.projectName,
    customId: result[key]?.custom_id,
  }));
}
