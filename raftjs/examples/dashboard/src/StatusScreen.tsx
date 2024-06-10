import ConnManager from "./ConnManager";
import React, { useState } from 'react';
import './styles.css';
import { RaftSystemInfo } from "@robdobsn/raftjs";

const connManager = ConnManager.getInstance();

export default function StatusScreen() {
  const [systemInfo, setSystemInfo] = useState<RaftSystemInfo>(new RaftSystemInfo());

  return (
    <div className="info-boxes">

      <div className="info-box">
        <h3>SysInfo</h3>
        <button className="action-button" onClick={() => {
          if (connManager.isConnected()) {
            connManager.getConnector().getRaftSystemUtils().getSystemInfo().then((sysInfo:RaftSystemInfo) => {
              console.log(`System Info: ${JSON.stringify(sysInfo)}`);
              setSystemInfo(sysInfo);
            });
          }
        }
        }>
          Get
        </button>
        {
          (systemInfo !== undefined) && (systemInfo.validMs) && (systemInfo.validMs > 0) ?
            <div className="info">
              <div className="info-line">
                <div className="info-label">System Name:</div>
                <div className="info-value">{systemInfo.SystemName}</div>
              </div>

              <div className="info-line">
                <div className="info-label">System Version:</div>
                <div className="info-value">{systemInfo.SystemVersion}</div>
              </div>

              <div className="info-line">
                <div className="info-label">HwRev:</div>
                <div className="info-value">{systemInfo.HwRev}</div>
              </div>

              <div className="info-line">
                <div className="info-label">MAC:</div>
                <div className="info-value">{systemInfo.MAC}</div>
              </div>

              <div className="info-line">
                <div className="info-label">SerialNo:</div>
                <div className="info-value">{systemInfo.SerialNo}</div>
              </div>

              <div className="info-line">
                <div className="info-label">Friendly:</div>
                <div className="info-value">{systemInfo.Friendly}</div>
              </div>
            </div>
            :
            <div className="info">
              <div className="info-line">
                <div className="info-label">System Info:</div>
                <div className="info-value">Not available</div>
              </div>
            </div>
        }
      </div>
    </div>
  );

}