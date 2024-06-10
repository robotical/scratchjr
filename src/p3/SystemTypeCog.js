import { RaftLog, RaftOKFail, RaftPublishEvent, RaftPublishEventNames, RaftSubscribeForUpdatesCBType } from "@robdobsn/raftjs";
import RICLEDPatternChecker from "./CogLEDPatternChecker";
import { CogStateInfo } from "./CogStateInfo";

export default class SystemTypeCog {
  nameForDialogs = "Robotical Cog";
  defaultWiFiHostname = "Cog";
  firmwareDestName = "ricfw";
  normalFileDestName = "fs";
  connectorOptions = { wsSuffix: "wsjson" };

  // Latest data from servos, IMU, etc
  _stateInfo = new CogStateInfo();
  getStateInfo() {
    return this._stateInfo;
  }

  // Event handler
  _onEvent = null;

  // LED Pattern checker
  _ledPatternChecker = new RICLEDPatternChecker();
  getLEDPatternChecker() {
    return this._ledPatternChecker;
  }

  // Raft system utils
  _systemUtils = null;
  setup(systemUtils, onEvent) {
    this._systemUtils = systemUtils;
    this._onEvent = onEvent;
  };

  // Subscribe for updates
  subscribeForUpdates = async (systemUtils, enable) => {
    // Subscription rate
    const subscribeRateHz = 0.1;
    try {
      const subscribeDisable = '{"cmdName":"subscription","action":"update",' +
        '"pubRecs":[' +
        `{"name":"devjson","rateHz":0,}` +
        ']}';
      const subscribeEnable = '{"cmdName":"subscription","action":"update",' +
        '"pubRecs":[' +
        `{"name":"devjson","trigger":"timeorchange","rateHz":${subscribeRateHz.toString()}}` +
        ']}';

      const msgHandler = systemUtils.getMsgHandler();
      const ricResp = await msgHandler.sendRICRESTCmdFrame < RaftOKFail > (
        enable ? subscribeEnable : subscribeDisable
      );

      // Debug
      RaftLog.debug(`subscribe enable/disable returned ${JSON.stringify(ricResp)}`);
    } catch (error) {
      RaftLog.warn(`getRICCalibInfo Failed subscribe for updates ${error}`);
    }
  };

  // Invalidate state
  stateIsInvalid() {
    if (this._systemUtils) {
      this._systemUtils.invalidate();
    }
  }

  // Other message type
  rxOtherMsgType(payload, frameTimeMs) {

    // RICLog.debug(`rxOtherMsgType payload ${RICUtils.bufferToHex(payload)}`);
    RaftLog.verbose(`rxOtherMsgType payloadLen ${payload.length}`);
    const topicIDs = this._stateInfo.updateFromMsg(payload, frameTimeMs);

    // Call event handler if registered
    if (this._onEvent) {
      this._onEvent("pub", RaftPublishEvent.PUBLISH_EVENT_DATA, RaftPublishEventNames[RaftPublishEvent.PUBLISH_EVENT_DATA],
        {
          topicIDs: topicIDs,
          payload: payload,
          frameTimeMs: frameTimeMs
        });
    }

  }
}
