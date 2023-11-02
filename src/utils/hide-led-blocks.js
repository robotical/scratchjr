const RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE = "LEDeye";
const RIC_WHOAMI_TYPE_CODE_ADDON_LEDARM = "LEDarm";
const RIC_WHOAMI_TYPE_CODE_ADDON_LEDFOOT = "LEDfoot";

export default function hideLedBlocks(addons) {
  if (areLedConnected(addons)) {
    showLedBlocks();
  } else if (!areLedConnected(addons) && isLooksSelected()) {
    // hiding led blocks if no led blocks are connected and the looks area is selected
    try {
      document.querySelector("#palette :nth-child(9)").style.display = "none";
      document.querySelector("#palette :nth-child(10)").style.display = "none";
      document.querySelector("#palette :nth-child(11)").style.display = "none";
    } catch (e) { }
  }
}

export function showLedBlocks() {
  try {
    document.querySelector("#palette :nth-child(9)").style.display = "block";
    document.querySelector("#palette :nth-child(10)").style.display = "block";
    document.querySelector("#palette :nth-child(11)").style.display = "block";
  } catch (e) { }
}

function areLedConnected(addonsStringified) {
  let addons;
  try {
    addons = JSON.parse(addonsStringified).addons;
  } catch (e) {
    addons = [];
  }

  for (let addon of addons) {
    if (
      addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE ||
      addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDARM ||
      addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDFOOT
    ) return true;
  }
  return false;
}

function isLooksSelected() {
  try {
    return document.querySelector("#looks :nth-child(2)").style.visibility === "visible"; // second child is the looksOn img. If that's visible the category is selected
  } catch (e) {
    return false;
  }
}
