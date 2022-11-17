const RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE = "LEDeye";

export default function hideLedBlocks(addons) {
  if (areLedConnected(addons)) {
    showLedBlocks();
  } else {
    // hiding led blocks if no led blocks are connected
    try {
      document.querySelector("#palette :nth-child(9)").style.display = "none";
      document.querySelector("#palette :nth-child(10)").style.display = "none";
      document.querySelector("#palette :nth-child(11)").style.display = "none";
    } catch (e) {}
  }
}

export function showLedBlocks() {
  try {
    document.querySelector("#palette :nth-child(9)").style.display = "block";
    document.querySelector("#palette :nth-child(10)").style.display = "block";
    document.querySelector("#palette :nth-child(11)").style.display = "block";
  } catch (e) {}
}

function areLedConnected(addonsStringified) {
  let addons;
  try {
    addons = JSON.parse(addonsStringified).addons;
  } catch (e) {
    addons = [];
  }

  for (let addon of addons) {
    if (addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE) return true;
  }
  return false;
}
