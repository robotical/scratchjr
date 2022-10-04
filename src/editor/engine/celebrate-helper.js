import ScratchJr from "../ScratchJr";

const RIC_WHOAMI_TYPE_CODE_ADDON_LEDFOOT = "LEDfoot";
const RIC_WHOAMI_TYPE_CODE_ADDON_LEDARM = "LEDarm";
const RIC_WHOAMI_TYPE_CODE_ADDON_LEDEYE = "LEDeye";

export default function celebrateHelper(OS, Prims, strip, tinterval, intervalToSeconds) {
  const timesOfDancing = 2;
  const moveSpeed = 3800;
  const danceTrajectoryMessage = `traj/dance?moveTime=${moveSpeed}`;
  const soundMessage = "filerun/spiffs/sax-in-the-city.raw";

  const martyConnected = ScratchJr.getMartyConnected();

  Prims.setTime(strip);

  if (martyConnected) {
    discoChangeBlockPattern("on", OS);
    OS.martyCmd({ cmd: soundMessage });
    OS.martyCmd({ cmd: danceTrajectoryMessage });
    OS.martyCmd({ cmd: danceTrajectoryMessage });
    strip.waitTimer = parseInt(
      tinterval * intervalToSeconds * ((moveSpeed * timesOfDancing + 800) / 1000)
    );
    Prims.showTime(strip);
    strip.thisblock = strip.thisblock.next;
    const timeout = setTimeout(() => {
      discoChangeBlockPattern("off", OS);
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

export const discoChangeBlockPattern = (onOff, OS) => {
  const addons = OS.getMartyAddons();

  //so if it's set in a forever loop give 0.2s break between each update
  const resolveTime = 200;
  let patternProgram = "11"; // 11, 01;
  if (onOff === "off") {
    patternProgram = "01";
  }
  // select all LED addons found
  const addressList = getAllDiscoBoards(addons);

  let numberOfLEDAddons = addressList.length;

  for (var i = 0; i < numberOfLEDAddons; i++) {
    let ledDeviceName = addressList.pop();
    const commandMsg = `elem/${ledDeviceName}/json?cmd=raw&hexWr=${patternProgram}`;
    OS.martyCmd({ cmd: commandMsg });
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
