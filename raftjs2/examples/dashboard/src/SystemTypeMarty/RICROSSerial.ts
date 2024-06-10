/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RICJS
// Communications Library
//
// Rob Dobson & Chris Greening 2020-2022
// (C) 2020-2022
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import RaftLog from "../../../../src/RaftLog";
import RaftUtils from "../../../../src/RaftUtils";
import RICAddOnManager from "./RICAddOnManager";
import RICCommsStats from "./RICCommsStats";
import { RICStateInfo } from "./RICStateInfo";

export class ROSSerialSmartServos {
  smartServos: {
    id: number;
    pos: number;
    current: number;
    status: number;
  }[] = [];
}

export class ROSSerialIMU {
  accel: {
    x: number;
    y: number;
    z: number;
  } = { x: 0, y: 0, z: 0 };
}

export class ROSSerialPowerStatus {
  powerStatus: {
    battRemainCapacityPercent: number;
    battTempDegC: number;
    battRemainCapacityMAH: number;
    battFullCapacityMAH: number;
    battCurrentMA: number;
    power5VOnTimeSecs: number;
    power5VIsOn: boolean;
    powerUSBIsConnected: boolean;
    battInfoValid: boolean;
    powerUSBIsValid: boolean;
    powerFlags: number;
  } = {
    battRemainCapacityPercent: 0,
    battTempDegC: 0,
    battRemainCapacityMAH: 0,
    battFullCapacityMAH: 0,
    battCurrentMA: 0,
    power5VOnTimeSecs: 0,
    power5VIsOn: false,
    powerUSBIsConnected: false,
    battInfoValid: false,
    powerUSBIsValid: false,
    powerFlags: 0,
  };
}

export class ROSSerialAddOnStatus {
  id = 0;
  deviceTypeID = 0;
  whoAmI = "";
  name = "";
  status = 0;
  vals: { [key: string]: number | boolean | string} = {};
}

export class ROSSerialAddOnStatusList {
  addons: Array<ROSSerialAddOnStatus> = new Array<ROSSerialAddOnStatus>();
}

export class ROSSerialRGBT {
  r = 0;
  g = 0;
  b = 0;
  t = 0;
  constructor(r: number, g: number, b: number, t: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.t = t;
  }
  toString() {
    return `R:${this.r} G:${this.g} B:${this.b} T:${this.t}`;
  }
}

export class ROSSerialRobotStatus {
  robotStatus: {
    flags: number;
    isMoving: boolean;
    isPaused: boolean;
    isFwUpdating: boolean;
    workQCount: number;
    heapFree: number;
    heapMin: number;
    pixRGBT: ROSSerialRGBT[];
    loopMsAvg: number;
    loopMsMax: number;
    wifiRSSI: number;
    bleRSSI: number;
  } = {
    flags: 0,
    isMoving: false,
    isPaused: false,
    isFwUpdating: false,
    workQCount: 0,
    heapFree: 0,
    heapMin: 0,
    pixRGBT: [],
    loopMsAvg: 0,
    loopMsMax: 0,
    wifiRSSI: 0,
    bleRSSI: 0,
  };
}

export class ROSCameraData {
  cameraData: {
    unixTimeMs: number;
    sinceStartMs: number;
    imageData: Uint8Array;
    imageWidth: number,
    imageHeight: number,
    imageFormat: number,
    imageQuality: number,
    frameTimeMs: number,
    imageCount: number
  } = {
    unixTimeMs: 0,
    sinceStartMs: 0,
    imageData: new Uint8Array(0),
    imageWidth: 0,
    imageHeight: 0,
    imageFormat: 0,
    imageQuality: 0,
    frameTimeMs: 0,
    imageCount: 0
  };
}

export type ROSSerialMsg =
  | ROSSerialSmartServos
  | ROSSerialIMU
  | ROSSerialPowerStatus
  | ROSSerialAddOnStatusList
  | ROSSerialRobotStatus;

// ROSSerial ROSTopics
export const ROSTOPIC_V2_SMART_SERVOS = 120;
export const ROSTOPIC_V2_ACCEL = 121;
export const ROSTOPIC_V2_POWER_STATUS = 122;
export const ROSTOPIC_V2_ADDONS = 123;
export const ROSTOPIC_V2_ROBOT_STATUS = 124;
export const ROSTOPIC_V2_CAMERA = 200;
  
export class RICROSSerial {

  static decode(
    rosSerialMsg: Uint8Array,
    startPos: number,
    commsStats: RICCommsStats,
    addOnManager: RICAddOnManager,
    ricStateInfo: RICStateInfo,
    frameTimeMs: number
  ): Array<number> {    

    // ROSSerial message format
    const RS_MSG_MIN_LENGTH = 8;
    const RS_MSG_LEN_LOW_POS = 2;
    const RS_MSG_LEN_HIGH_POS = 3;
    const RS_MSG_TOPIC_ID_LOW_POS = 5;
    const RS_MSG_TOPIC_ID_HIGH_POS = 6;
    const RS_MSG_PAYLOAD_POS = 7;

    // Max payload length
    const MAX_VALID_PAYLOAD_LEN = 200000;

    // Update stats
    commsStats.updateROSSerialRxRate(rosSerialMsg.length, frameTimeMs);

    // Payload may contain multiple ROSSerial messages
    let msgPos = startPos;
    const topicIDs = new Array<number>();
    for (;;) {
      const remainingMsgLen = rosSerialMsg.length - msgPos;

      // RaftLog.debug('ROSSerial Decode ' + remainingMsgLen);

      if (remainingMsgLen < RS_MSG_MIN_LENGTH) break;

      // Extract header
      const payloadLength =
        rosSerialMsg[msgPos + RS_MSG_LEN_LOW_POS] +
        rosSerialMsg[msgPos + RS_MSG_LEN_HIGH_POS] * 256;
      const topicID =
        rosSerialMsg[msgPos + RS_MSG_TOPIC_ID_LOW_POS] +
        rosSerialMsg[msgPos + RS_MSG_TOPIC_ID_HIGH_POS] * 256;

      // RaftLog.debug('ROSSerial ' + payloadLength + ' topic ' + topicID);

      // Check max length
      if (payloadLength < 0 || payloadLength > MAX_VALID_PAYLOAD_LEN) break;

      // Check min length
      if (rosSerialMsg.length < payloadLength + RS_MSG_MIN_LENGTH) break;

      // Extract payload
      const payload = rosSerialMsg.slice(
        msgPos + RS_MSG_PAYLOAD_POS,
        msgPos + RS_MSG_PAYLOAD_POS + payloadLength
      );
      // RaftLog.debug('ROSSerial ' + RaftUtils.bufferToHex(payload));

      // we need to register the static addons here in case
      // marty only has static addons (and so the rostopic_v2_addons case
      // never runs)
      let allAdons: ROSSerialAddOnStatusList = {addons: []};
      const staticAddons = addOnManager.getProcessedStaticAddons();
      for (const staticAddon of staticAddons) {
        allAdons.addons.push(staticAddon);
      }
      if (commsStats._msgAddOnPub === 0) {
        // we set the static addons only if we don't have any other addons
        // the _msgAddOnPub is incremented in the rostopic_v2_addons case
        // (when we get addons from marty)
        // otherwise, the static addons will be set along with the regular addons (below)
        ricStateInfo.addOnInfo = allAdons;
        ricStateInfo.addOnInfoValidMs = Date.now();
      }

      // Record topic ID
      topicIDs.push(topicID);

      // Update state info
      switch (topicID) {
          case ROSTOPIC_V2_SMART_SERVOS:
            // Smart Servos
            ricStateInfo.smartServos = this.extractSmartServos(payload);
            ricStateInfo.smartServosValidMs = Date.now();
            commsStats.recordSmartServos();
            break;
          case ROSTOPIC_V2_ACCEL:
            // Accelerometer
            ricStateInfo.imuData = this.extractAccel(payload);
            ricStateInfo.imuDataValidMs = Date.now();
            commsStats.recordIMU();
            break;
          case ROSTOPIC_V2_POWER_STATUS:
            // Power Status
            ricStateInfo.power = this.extractPowerStatus(payload);
            ricStateInfo.powerValidMs = Date.now();
            commsStats.recordPowerStatus();
            break;
          case ROSTOPIC_V2_ADDONS:
            // Addons
            ricStateInfo.addOnInfo = this.extractAddOnStatus(payload, addOnManager);
            ricStateInfo.addOnInfoValidMs = Date.now();
            for (const staticAddon of staticAddons) {
              allAdons.addons.push(staticAddon);
            }
            commsStats.recordAddOnPub();
            break;
          case ROSTOPIC_V2_ROBOT_STATUS:
            // Robot Status
            ricStateInfo.robotStatus = this.extractRobotStatus(payload);
            ricStateInfo.robotStatusValidMs = Date.now();
            commsStats.recordRobotStatus();
            break;
          case ROSTOPIC_V2_CAMERA:
            // Camera
            // RaftLog.debug('Camera ' + payloadLength);
            ricStateInfo.cameraData = this.extractCameraData(payload, frameTimeMs);
            ricStateInfo.cameraDataValidMs = Date.now();
            commsStats.recordOtherTopic();
            break;
          default:
            // Unknown topic
            commsStats.recordOtherTopic();
            break;
      }

      // Move msgPos on
      msgPos += RS_MSG_PAYLOAD_POS + payloadLength + 1;

      // RaftLog.debug('MsgPos ' + msgPos);
    }

    return topicIDs;
  }

  static extractSmartServos(buf: Uint8Array): ROSSerialSmartServos {
    // Each group of attributes for a servo is a fixed size
    const ROS_SMART_SERVOS_ATTR_GROUP_BYTES = 6;
    const numGroups = Math.floor(
      buf.length / ROS_SMART_SERVOS_ATTR_GROUP_BYTES
    );
    const msg: ROSSerialSmartServos = { smartServos: [] };
    let bufPos = 0;
    for (let i = 0; i < numGroups; i++) {
      const servoId = buf[bufPos];
      const servoPos = RaftUtils.getBEInt16FromBuf(buf, bufPos + 1);
      const servoCurrent = RaftUtils.getBEUint16FromBuf(buf, bufPos + 3);
      const servoStatus = buf[bufPos + 5];
      bufPos += ROS_SMART_SERVOS_ATTR_GROUP_BYTES;
      msg.smartServos.push({
        id: servoId,
        pos: servoPos,
        current: servoCurrent,
        status: servoStatus,
      });
    }
    return msg;
  }

  static extractAccel(buf: Uint8Array): ROSSerialIMU {
    // Three accelerometer floats
    const x = RaftUtils.getBEFloatFromBuf(buf);
    const y = RaftUtils.getBEFloatFromBuf(buf.slice(4));
    const z = RaftUtils.getBEFloatFromBuf(buf.slice(8));
    return { accel: { x: x / 1024, y: y / 1024, z: z / 1024 } };
  }

  static extractPowerStatus(buf: Uint8Array): ROSSerialPowerStatus {
    // Power indicator values
    // RaftLog.debug(`PowerStatus ${RaftUtils.bufferToHex(buf)}`);
    const remCapPC = RaftUtils.getBEUint8FromBuf(buf, 0);
    const tempDegC = RaftUtils.getBEUint8FromBuf(buf, 1);
    const remCapMAH = RaftUtils.getBEUint16FromBuf(buf, 2);
    const fullCapMAH = RaftUtils.getBEUint16FromBuf(buf, 4);
    const currentMA = RaftUtils.getBEInt16FromBuf(buf, 6);
    const power5VOnTimeSecs = RaftUtils.getBEUint16FromBuf(buf, 8);
    const powerFlags = RaftUtils.getBEUint16FromBuf(buf, 10);
    const isOnUSBPower = (powerFlags & 0x0001) != 0;
    const is5VOn = (powerFlags & 0x0002) != 0;
    const isBattInfoValid = (powerFlags & 0x0004) == 0;
    const isUSBPowerInfoValid = (powerFlags & 0x0008) == 0;
    return {
      powerStatus: {
        battRemainCapacityPercent: remCapPC,
        battTempDegC: tempDegC,
        battRemainCapacityMAH: remCapMAH,
        battFullCapacityMAH: fullCapMAH,
        battCurrentMA: currentMA,
        power5VOnTimeSecs: power5VOnTimeSecs,
        power5VIsOn: is5VOn,
        powerUSBIsConnected: isOnUSBPower && isUSBPowerInfoValid,
        battInfoValid: isBattInfoValid,
        powerUSBIsValid: isUSBPowerInfoValid,
        powerFlags: powerFlags,
      },
    };
  }

  static extractAddOnStatus(
    buf: Uint8Array,
    addOnManager: RICAddOnManager
  ): ROSSerialAddOnStatusList {
    // RaftLog.debug(`AddOnRawData ${RaftUtils.bufferToHex(buf)}`);
    // Each group of attributes for a add-on is a fixed size
    const ROS_ADDON_ATTR_GROUP_BYTES = 12;
    const numGroups = Math.floor(buf.length / ROS_ADDON_ATTR_GROUP_BYTES);
    const msg: ROSSerialAddOnStatusList = { addons: [] };
    let bufPos = 0;
    for (let i = 0; i < numGroups; i++) {
      const addOnId = buf[bufPos];
      const status = buf[bufPos + 1];
      const addOnData = buf.slice(bufPos + 2, bufPos + 12);
      bufPos += ROS_ADDON_ATTR_GROUP_BYTES;
      const addOnRec = addOnManager.processPublishedData(
        addOnId,
        status,
        addOnData
      );
      if (addOnRec !== null) {
        msg.addons.push(addOnRec);
      }
    }
    return msg;
  }

  static extractRGBT(buf: Uint8Array, offset: number): ROSSerialRGBT {
    return new ROSSerialRGBT(
      buf[offset],
      buf[offset + 1],
      buf[offset + 2],
      buf[offset + 3]
    );
  }

  static extractRobotStatus(buf: Uint8Array): ROSSerialRobotStatus {
    const flags = RaftUtils.getBEUint8FromBuf(buf, 0);
    const workQCount = RaftUtils.getBEUint8FromBuf(buf, 1);
    let heapFree = 0;
    let heapMin = 0;
    let pixRGBT1 = new ROSSerialRGBT(0, 0, 0, 0);
    let pixRGBT2 = new ROSSerialRGBT(0, 0, 0, 0);
    let pixRGBT3 = new ROSSerialRGBT(0, 0, 0, 0);
    let loopMsAvg = 0;
    let loopMsMax = 0;
    // RaftLog.debug(`RobotStatus ${buf.length} ${RaftUtils.bufferToHex(buf)} ${flags} ${workQCount} ${heapFree} ${heapMin} ${pixRGBT1.toString()} ${pixRGBT2.toString()} ${pixRGBT3.toString()} ${loopMsAvg} ${loopMsMax}`);
    let wifiRSSI = 0;
    let bleRSSI = 0;

    if (buf.length >= 24) {
      heapFree = RaftUtils.getBEUint32FromBuf(buf, 2);
      heapMin = RaftUtils.getBEUint32FromBuf(buf, 6);
      pixRGBT1 = RICROSSerial.extractRGBT(buf, 10);
      pixRGBT2 = RICROSSerial.extractRGBT(buf, 14);
      pixRGBT3 = RICROSSerial.extractRGBT(buf, 18);
      loopMsAvg = RaftUtils.getBEUint8FromBuf(buf, 22);
      loopMsMax = RaftUtils.getBEUint8FromBuf(buf, 23);
      // RaftLog.debug(`RobotStatus ${buf.length} ${RaftUtils.bufferToHex(buf)} ${flags} ${workQCount} ${heapFree} ${heapMin} ${pixRGBT1.toString()} ${pixRGBT2.toString()} ${pixRGBT3.toString()} ${loopMsAvg} ${loopMsMax}`);
      if (buf.length >= 26) {
        wifiRSSI = RaftUtils.getBEInt8FromBuf(buf, 24);
        bleRSSI = RaftUtils.getBEInt8FromBuf(buf, 25);
      }
    }
    return {
      robotStatus: {
        flags: flags,
        isMoving: (flags & 0x01) != 0,
        isPaused: (flags & 0x02) != 0,
        isFwUpdating: (flags & 0x04) != 0,
        workQCount: workQCount,
        heapFree: heapFree,
        heapMin: heapMin,
        pixRGBT: [pixRGBT1, pixRGBT2, pixRGBT3],
        loopMsAvg: loopMsAvg,
        loopMsMax: loopMsMax,
        wifiRSSI: wifiRSSI,
        bleRSSI: bleRSSI,
      },
    };
  }

  static extractCameraData(buf: Uint8Array, frameTimeMs: number): ROSCameraData {
    RaftLog.verbose(`CameraData ${buf.length} ${RaftUtils.bufferToHex(buf.slice(0,30))}`);
    const unixTime = RaftUtils.getBEUint64FromBuf(buf, 0);
    const sinceStartMs = RaftUtils.getBEUint32FromBuf(buf, 8);
    const imageWidth = RaftUtils.getBEUint16FromBuf(buf, 12);
    const imageHeight = RaftUtils.getBEUint16FromBuf(buf, 14);
    const imageFormat = RaftUtils.getBEUint8FromBuf(buf, 16);
    const imageQuality = RaftUtils.getBEUint8FromBuf(buf, 17);
    const imageCount = RaftUtils.getBEUint32FromBuf(buf, 18);
    const imageData = buf.slice(22);
    return { cameraData: 
      { 
        unixTimeMs: unixTime, 
        sinceStartMs: sinceStartMs, 
        imageWidth: imageWidth,
        imageHeight: imageHeight,
        imageFormat: imageFormat,
        imageQuality: imageQuality,
        imageData: imageData,
        frameTimeMs: frameTimeMs,
        imageCount: imageCount
      } 
    };
  }  
}
