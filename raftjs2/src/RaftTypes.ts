/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RaftTypes
// Part of RaftJS
//
// Rob Dobson & Chris Greening 2020-2024
// (C) 2020-2024 All rights reserved
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { RaftConnEvent } from './RaftConnEvents';
import { RaftUpdateEvent } from './RaftUpdateEvents';

export enum RaftPublishEvent {
  PUBLISH_EVENT_DATA,
}

export const RaftPublishEventNames = {
  [RaftPublishEvent.PUBLISH_EVENT_DATA]: 'PUBLISH_EVENT_DATA'
};

export enum RaftFileSendType {
  NORMAL_FILE,
  FIRMWARE_UPDATE,
}

export enum RaftStreamType {
  REAL_TIME_STREAM,
}

export type RaftEventFn = (
  eventType: string,
  eventEnum: RaftConnEvent | RaftUpdateEvent | RaftPublishEvent,
  eventName: string,
  data?: object | string | null,
) => void;

export interface RaftSubscription {
  remove(): void;
}

export class RaftFriendlyName {
  friendlyName = '';
  friendlyNameIsSet?= false;
  req?= '';
  rslt?= 'commsFail';
  validMs?= 0;
}

export class RaftSystemInfo {
  rslt = '';
  SystemName = 'Unknown';
  SystemVersion = '0.0.0';
  RicHwRevNo?: string | number = 0;
  HwRev?: string | number = "";
  MAC?= "";
  SerialNo?= "";
  validMs?= 0;
  Friendly? = "";
}

export class RaftCalibInfo {
  rslt = '';
  calDone = 0;
  validMs?= 0;
}

export class RaftOKFail {
  RAFT_OK = 'ok';
  set(rsltFlag: boolean) {
    if (rsltFlag) {
      this.rslt = this.RAFT_OK;
    } else {
      this.rslt = 'fail';
    }
  }
  rslt = 'commsFail';
  isOk() {
    return this.rslt === this.RAFT_OK;
  }
}

export class RaftReportMsg {
  msgType?: string;
  rslt = '';
  timeReceived?: number;
  hexRd?: string;
  elemName?: string;
  IDNo?: number;
  msgKey?: string;
  addr?: number;
  msgBody?: string;
}

export class RaftHWFWStat {
  s = '';
  m = '';
  v = '';
  n = '';
  p = 0;
  i = 0;
}

export class RaftHWFWUpdRslt {
  req = '';
  rslt = 'commsFail';
  st: RaftHWFWStat = new RaftHWFWStat();
}

export type RaftFWInfo = {
  elemType: string;
  version: string;
  destname: string;
  md5: string;
  releaseNotes: string;
  comments: string;
  updaters: Array<string>;
  downloadUrl: string;
  firmware?: string;
};

// TODO - decide what to do with ricRevision

export type RaftUpdateInfo = {
  rslt: string;
  firmwareVersion: string;
  ricRevision: string;
  files: Array<RaftFWInfo>;
  minimumUpdaterVersion: Dictionary<string>;
  note: string;
};

export type RaftFileStartResp = {
  rslt: string;
  batchMsgSize: number;
  batchAckSize: number;
};

export type RaftStreamStartResp = {
  rslt: string;
  streamID: number;
  maxBlockSize?: number;
};

export type RaftBridgeSetupResp = {
  rslt: string;
  bridgeID: number;
};

export type RaftFile = {
  name: string;
  size: number;
};

export class RaftFileList {
  req = '';
  rslt = 'ok';
  fsName = 'spiffs';
  fsBase = '/spiffs';
  diskSize = 0;
  diskUsed = 0;
  folder = '/spiffs/';
  files: Array<RaftFile> = [];
}

export class RaftSysModInfoBLEMan {
  req?= '';
  rslt = 'ok';
  isConn = false;
  isAdv = false;
  advName?= "";
  BLEMAC = "";
  rssi = -200;
  rxM = 0;
  rxB = 0;
  rxBPS = 0.0;
  txM = 0;
  txB = 0;
  txBPS = 0.0;
  txErr = 0;
  txErrPS = 0;
  tM?= 0;
  tB?= 0;
  tBPS?= 0.0;
  tSeqErrs?= 0;
  tDatErrs?= 0;
}

export type RaftProgressCBType = (received: number, total: number) => void;

export class RaftFileDownloadResult
{
  fileData: Uint8Array | null = null;
  downloadedOk = false;
  constructor(buffer: Uint8Array | undefined = undefined) {
    if (buffer !== undefined) {
      this.fileData = buffer;
      this.downloadedOk = true;
    } else {
      this.fileData = null;
      this.downloadedOk = false;
    }
  }

}

export type RaftFileDownloadFn = (downloadUrl: string, progressCB: RaftProgressCBType) => Promise<RaftFileDownloadResult>;

export type RaftFileDownloadResp = {
  req: string;
  rslt: string;
}

export type RaftFileDownloadStartResp = {
  req: string;
  rslt: string;
  batchMsgSize: number;
  batchAckSize: number;
  streamID: number;
  fileLen: number;
  crc16: string;
}

export interface Dictionary<T> {
  [key: string]: T;
}

export type RaftWifiScanResults = {
  req: string;
  rslt: string;
  wifi: WifiScanWifiItem[];
};

export type WifiScanWifiItem = {
  ssid: string;
  rssi: number;
  ch1: number;
  ch2: number;
  auth: string;
  bssid: string;
  pair: string;
  group: string;
};

export type PystatusMsgType = {
  req: string;
  running: string;
  rslt: string;
};

