import { RaftSystemType } from "@robdobsn/raftjs";
import { RaftLog, RaftSystemUtils, RaftOKFail, RaftEventFn, RaftPublishEvent, RaftPublishEventNames } from "@robdobsn/raftjs";
import RICAddOnManager from "./RICAddOnManager";
import RICCommsStats from "./RICCommsStats";
import RICLEDPatternChecker from "./RICLEDPatternChecker";
import RICServoFaultDetector from "./RICServoFaultDetector";
import { RICStateInfo } from "./RICStateInfo";

export default class SystemTypeMarty implements RaftSystemType {
  nameForDialogs = "Robotical Marty";
  defaultWiFiHostname = "Marty";
  firmwareDestName = "ricfw";
  normalFileDestName = "fs";
  connectorOptions = {wsSuffix: "ws"};


  // LED Pattern checker
  private _ledPatternChecker: RICLEDPatternChecker = new RICLEDPatternChecker();
  getLEDPatternChecker(): RICLEDPatternChecker {
    return this._ledPatternChecker;
  }

  // Latest data from servos, IMU, etc
  private _ricStateInfo: RICStateInfo = new RICStateInfo();
  getRICStateInfo(): RICStateInfo {
    return this._ricStateInfo;
  }

  // Add-on Manager
  private _addOnManager = new RICAddOnManager();
  getAddOnManager(): RICAddOnManager {
    return this._addOnManager;
  }

  // Properties for Marty
  private _ricServoFaultDetector: RICServoFaultDetector | null = null;
  getRICServoFaultDetector(): RICServoFaultDetector {
    return this._ricServoFaultDetector!;
  }

  // RIC comms stats
  private _commsStats = new RICCommsStats();
  getCommsStats(): RICCommsStats {
    return this._commsStats;
  }

  // Event handler
  private _onEvent: RaftEventFn | null = null;

  // Raft system utils
  private _systemUtils: RaftSystemUtils | null = null;

  // Setup
  setup(systemUtils: RaftSystemUtils, onEvent: RaftEventFn | null): void {
    this._systemUtils = systemUtils;
    this._onEvent = onEvent;
    this._ricServoFaultDetector = new RICServoFaultDetector(this._systemUtils!.getMsgHandler(), this._ricStateInfo);
  }

  // Subscribe for updates
  async subscribeForUpdates(systemUtils: RaftSystemUtils, enable: boolean): Promise<void> {
    // Subscription rate
    const subscribeRateHz = 10;
    try {
      const subscribeDisable = '{"cmdName":"subscription","action":"update",' +
        '"pubRecs":[' +
        `{"name":"MultiStatus","rateHz":0,}` +
        '{"name":"PowerStatus","rateHz":0},' +
        `{"name":"AddOnStatus","rateHz":0}` +
        ']}';
      const subscribeEnable = '{"cmdName":"subscription","action":"update",' +
        '"pubRecs":[' +
        `{"name":"MultiStatus","rateHz":${subscribeRateHz.toString()}}` +
        `{"name":"PowerStatus","rateHz":1.0},` +
        `{"name":"AddOnStatus","rateHz":${subscribeRateHz.toString()}}` +
        ']}';

      const msgHandler = systemUtils.getMsgHandler();
      const ricResp = await msgHandler.sendRICRESTCmdFrame<RaftOKFail>(
        enable ? subscribeEnable : subscribeDisable
      );

      // Debug
      RaftLog.debug(`subscribe enable/disable returned ${JSON.stringify(ricResp)}`);
    } catch (error: unknown) {
      RaftLog.warn(`getRICCalibInfo Failed subscribe for updates ${error}`);
    }
  }

  // Invalidate state
  stateIsInvalid(): void {
    if (this._systemUtils) {
      this._systemUtils.invalidate();
    }
  }

  // Other message type
  rxOtherMsgType(payload: Uint8Array, frameTimeMs: number) {
    // RICLog.debug(`onRxROSSerialMsg payload ${RICUtils.bufferToHex(payload)}`);
    RaftLog.verbose(`onRxROSSerialMsg payloadLen ${payload.length}`);
    const topicIDs = this._ricStateInfo.updateFromROSSerialMsg(payload, this._commsStats, this._addOnManager, frameTimeMs);

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

