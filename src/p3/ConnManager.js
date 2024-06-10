import { RaftChannelWebBLE, RaftConnector, RaftLog } from "@robdobsn/raftjs";
import SystemTypeCog from "./SystemTypeCog.js";
// import SystemTypeMarty from "./SystemTypeMarty/SystemTypeMarty";

const raftCallback = async (systemUtils) => {
  const systemInfo = await systemUtils.getSystemInfo();
  if (systemInfo.SystemName === "Marty") {
    RaftLog.info("ConnManager - Marty detected");
    // return new SystemTypeMarty();
  } else if (systemInfo.SystemName === "RoboticalCog") {
    RaftLog.info("ConnManager - Cog detected");
    return new SystemTypeCog();
  }
  RaftLog.error(`ConnManager - unknown system ${systemInfo.SystemName} ${JSON.stringify(systemInfo)}`);
  return null;
};

export default class ConnManager {

  // Singleton
  static _instance;

  // Connector
  _connector = new RaftConnector(raftCallback);

  // Callback on connection event
  _onConnectionEvent = null;

  // Get instance
  static getInstance() {
    if (!ConnManager._instance) {
      ConnManager._instance = new ConnManager();
    }
    return ConnManager._instance;
  }

  // Set connection event listener
  setConnectionEventListener(listener) {
    this._onConnectionEvent = listener;
  }

  // Check if connected
  isConnected() {
    return this._connector.isConnected();
  }

  getConnector() {
    return this._connector;
  }

  async getBleDevice() {
    if (navigator.bluetooth === undefined) {
      return alert("Web Bluetooth is not supported in this browser, or bluetooth is disabled/permission denied. Please try again in a different browser.");
    }
    try {
      const dev = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [RaftChannelWebBLE.ServiceUUID] }
        ],
        optionalServices: []
      });
      return dev;
    } catch (e) {
      RaftLog.error(`getBleDevice - failed to get device ${e}`);
    }
  }

  // Connect
  async connect(method, locator) {

    // Hook up the connector
    this._connector.setEventListener((evtType, eventEnum, eventName, eventData) => {
      RaftLog.verbose(`ConnManager - event ${eventName}`);
      if (this._onConnectionEvent) {
        this._onConnectionEvent(evtType, eventEnum, eventName, eventData);
      }
    });

    if (method === "WebBLE") {
      const dev = await this.getBleDevice();
      return this._connector.connect(method, dev);
    }
    return this._connector.connect(method, locator);
  }

  // Disconnect
  disconnect() {
    return this._connector.disconnect();
  }
}
