const {
    default: connectButtonHtml,
  } = require("./connection-ui/connect-btn/ConnectBtn");
  const {
    default: battery_render,
  } = require("./connection-ui/disconnect-btn/battery_svg_render");
  const {
    default: disconnectBtnHtml,
  } = require("./connection-ui/disconnect-btn/DisconnectBtn");
  const {
    default: signal_render,
  } = require("./connection-ui/disconnect-btn/signal_svg_render");
  
  /**
   * @fileoverview
   * Functions for interacting with Marty v2 via a REST interface
   */
  class EventDispatcher {
    constructor() {
      this._listeners = [];
    }
  
    hasEventListener(type, listener) {
      return this._listeners.some(
        (item) => item.type === type && item.listener === listener
      );
    }
  
    addEventListener(type, listener) {
      if (!this.hasEventListener(type, listener)) {
        this._listeners.push({ type, listener, options: { once: false } });
      }
      return this;
    }
  
    removeEventListener(type, listener) {
      const index = this._listeners.findIndex(
        (item) => item.type === type && item.listener === listener
      );
      if (index >= 0) this._listeners.splice(index, 1);
      return this;
    }
  
    removeEventListeners() {
      this._listeners = [];
      return this;
    }
  
    dispatchEvent(evt) {
      this._listeners
        .filter((item) => item.type === evt.type)
        .forEach((item) => {
          const {
            type,
            listener,
            options: { once },
          } = item;
          listener.call(this, evt);
          if (once === true) this.removeEventListener(type, listener);
        });
      return this;
    }
  }
  
  class Marty2 extends EventDispatcher {
    constructor() {
      super();
      this.isConnected = false;
      this.ip = null;
      this.martyName = null;
      this.demo_sensor = 0;
      this.battRemainCapacityPercent = 0;
      this.rssi = -100;
      this.servos = 0;
      this.accel = 0;
      //        this.commandPromise = null;
      //        this.onCommandReply = this.onCommandReply.bind(this);
      //        this.sendCommand = this.sendCommand.bind(this);
      this.setRSSI = this.setRSSI.bind(this);
      this.setIsConnected = this.setIsConnected.bind(this);
    }
  
    async send_REST(cmd) {
      console.log("IN USELESS send_REST");
      // just a sort of a placeholder (abstract) method.
      // This method will get replaced by the webapp equivalent method.
    }
  
    setName(martyName) {
      this.martyName = martyName;
    }
  
    setRSSI(rssi) {
      if (rssi !== this.rssi) {
        this.rssi = rssi;
        this.dispatchEvent({ type: "onRSSIChange", rssi: this.rssi });
      }
    }
  
    setBattRemainCapacityPercent(battRemainCapacityPercent) {
      if (battRemainCapacityPercent !== this.battRemainCapacityPercent) {
        this.battRemainCapacityPercent = battRemainCapacityPercent;
        this.dispatchEvent({
          type: "onBattRemainCapacityPercentChange",
          battRemainCapacityPercent: this.battRemainCapacityPercent,
        });
      }
    }
  
    setIsConnected(isConnected) {
      if (isConnected !== this.isConnected) {
        this.isConnected = isConnected;
        this.dispatchEvent({
          type: "onIsConnectedChange",
          isConnected: this.isConnected,
        });
      }
    }
  
    async updateConnectionInfo() {
      let newHTML = "";
      try {
        if (this.isConnected) {
          // newHTML = this.martyName +  "<div style='display:flex;height:50%'>" + this.battery_render() + this.signal_render() + "</div>";
          newHTML = disconnectBtnHtml(
            this.martyName,
            this.battRemainCapacityPercent
          );
          document
            .getElementById("martyConnection")
            .classList.add("martyConnected");
        } else {
          newHTML = connectButtonHtml;
          document
            .getElementById("martyConnection")
            .classList.remove("martyConnected");
        }
        document.getElementById("martyConnection").innerHTML = newHTML;
        if (this.isConnected) {
          battery_render(this.battRemainCapacityPercent);
          signal_render(this.rssi);
        }
      } catch (e) {
        console.log("Connection button is not here yet");
        // busy wait to not overload the app
        await new Promise(resolve => setTimeout(resolve, 500));
        this.updateConnectionInfo();
      }
    }
  }
  
  module.exports = Marty2;
  