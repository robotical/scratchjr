const STORAGE_KEY = "scratchjr.cloud.customIds";

function hasLocalStorage() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch (err) {
    return false;
  }
}

function readStore() {
  if (!hasLocalStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry) => typeof entry === "object" && entry !== null && typeof entry.customId === "string");
    }
    return [];
  } catch (err) {
    console.warn("cloudLocalStore: failed to parse local storage", err);
    return [];
  }
}

function writeStore(entries) {
  if (!hasLocalStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.warn("cloudLocalStore: failed to write local storage", err);
  }
}

export function getStoredCloudIds() {
  return readStore();
}

export function addStoredCloudId(entry) {
  if (!entry || typeof entry.customId !== "string") {
    return;
  }
  const trimmedId = entry.customId.trim();
  if (!trimmedId) {
    return;
  }
  const store = readStore();
  const index = store.findIndex((item) => item.customId === trimmedId);
  const normalized = {
    customId: trimmedId,
    projectName: entry.projectName || "",
    savedAt: entry.savedAt || Date.now(),
    lastUsed: entry.lastUsed || Date.now(),
  };
  if (index > -1) {
    store[index] = {
      ...store[index],
      ...normalized,
    };
  } else {
    store.push(normalized);
  }
  writeStore(store);
}

export function removeStoredCloudId(customId) {
  if (!customId) {
    return;
  }
  const trimmed = customId.trim();
  if (!trimmed) {
    return;
  }
  const store = readStore().filter((entry) => entry.customId !== trimmed);
  writeStore(store);
}

export function touchStoredCloudId(customId) {
  if (!customId) {
    return;
  }
  const trimmed = customId.trim();
  if (!trimmed) {
    return;
  }
  const store = readStore();
  const index = store.findIndex((entry) => entry.customId === trimmed);
  if (index === -1) {
    return;
  }
  store[index] = {
    ...store[index],
    lastUsed: Date.now(),
  };
  writeStore(store);
}
