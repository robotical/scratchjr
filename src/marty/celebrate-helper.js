import isVersionGreater from "../utils/versionChecker";
import MartyBlocks from "./MartyBlocks";

const RIC_WHOAMI_TYPE_CODE_ADDON_LEDFOOT = "LEDfoot";
const RIC_WHOAMI_TYPE_CODE_ADDON_LEDARM = "LEDarm";
const RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE = "LEDeye";

export default function celebrateHelper(martyBlocks, Prims, strip, tinterval, intervalToSeconds) {
  const timesOfDancing = 2;
  const moveSpeed = 3800;
  const danceTrajectoryMessage = `traj/dance?moveTime=${moveSpeed}`;
  const soundMessageOld = "filerun/spiffs/sax-in-the-city.raw";
  const soundMessageNew = "filerun/celebrate.mp3";

  Prims.setTime(strip);

  if (martyBlocks && martyBlocks.marty) {
    discoChangeBlockPattern("on", martyBlocks);
    if (isVersionGreater(MartyBlocks.FILE_RUN_CHANGES_VERSION, martyBlocks.marty.getRaftVersion())) {
      martyBlocks.marty.sendRestMessage(soundMessageOld);
    } else {
      martyBlocks.marty.sendRestMessage(soundMessageNew);
    }
    martyBlocks.marty.sendRestMessage(danceTrajectoryMessage);
    martyBlocks.marty.sendRestMessage(danceTrajectoryMessage);
    strip.waitTimer = parseInt(
      tinterval * intervalToSeconds * ((moveSpeed * timesOfDancing + 800) / 1000)
    );
    Prims.showTime(strip);
    strip.thisblock = strip.thisblock.next;
    const timeout = setTimeout(() => {
      discoChangeBlockPattern("off", martyBlocks);
      clearTimeout(timeout);
    }, (moveSpeed * timesOfDancing + 800) );
    return;
  } else {
    if (Prims.playMartyServo) {
      Prims.playMartyServo(strip);
      return;
    }
    strip.thisblock = strip.thisblock.next;
    return;
  }
}

export const discoChangeBlockPattern = (onOff, martyBlocks) => {
  const addons = martyBlocks?.marty?.raftStateInfo.addOnInfo.addons || [];

  //so if it's set in a forever loop give 0.2s break between each update
  const resolveTime = 200;

  // select all LED addons found
  const addressList = getAllDiscoBoards(addons);

  let numberOfLEDAddons = addressList.length;

  for (var i = 0; i < numberOfLEDAddons; i++) {
    let ledDeviceName = addressList.pop();
    let ledCmd = `led/${ledDeviceName}/pattern/show-off`;
    if (onOff === "off") {
      ledCmd = `led/${ledDeviceName}/off`;
    }

    martyBlocks.marty.sendRestMessage(ledCmd);
  }
  return new Promise((resolve) => setTimeout(resolve, resolveTime));
};

const getAllDiscoBoards = (addons) => {
  var addressList = [];

  for (let addon of addons) {
    if (
      addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE ||
      addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDARM ||
      addon.whoAmI === RIC_WHOAMI_TYPE_CODE_ADDON_LEDFOOT
    ) {
      addressList.push(addon.name);
    }
  }
  return addressList;
};
