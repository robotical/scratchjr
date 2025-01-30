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
const { default: goToLink } = require("./goToLink");

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
    this.FILE_RUN_CHANGES_VERSION = "1.3.1";
    this.MARTY_SOUNDS_NOT_IN_FW = "1.3.0";
    this.isConnected = false;
    this.ip = null;
    this.martyName = null;
    this.demo_sensor = 0;
    this.battRemainCapacityPercent = 0;
    this.rssi = -100;
    this.servos = 0;
    this.accel = 0;
    this.addons = "";
    this.setRSSI = this.setRSSI.bind(this);
    this.setIsConnected = this.setIsConnected.bind(this);
    this.fwVersion = "";
    this.commandPromise = null;
    // random number from 20 to 10000
    const randomMdNumber = Math.floor(Math.random() * 10000) + 20;
    this.goToLink = goToLink; // only for debugging purposes so we can start new project from MST
    this.startNewProject = () => goToLink(`editor.html?pmd5=${randomMdNumber}&mode=edit`); // only for debugging purposes so we can start new project from MST
    this.startNewProjectFail = () => goToLink("editor.html"); // only for debugging purposes so we can start new project from MST
  }

  async send_REST(cmd) {
    try {
      window.ReactNativeWebView.postMessage(cmd); // this call triggers onMessage in the app
    } catch (e) {
      console.log("IN USELESS send_REST", e);
    }
  }

  /**
 * Sends a command to the react-native code and returns a promise that will be
 * fulfilled when the react-native code replies
 * @param {{command: string}} payload Payload to send to the react-native code
 * @returns {Promise} Promise
 */
  sendCommand(payload) {
    if (this.commandPromise) {
      // eslint-disable-next-line no-console
      console.warn("Command already in flight");
    }
    const promise = new Promise((resolve, reject) => {
      this.commandPromise = { resolve, reject };
    });
    window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    return promise;
  }

  /**
 * Called by the react-native code to respond to sendCommand
 * @param {{success: boolean, error: string}} args Response from the react native side
 */
  onCommandReply(args) {
    if (this.commandPromise) {
      if (args.success) {
        this.commandPromise.resolve(args);
      } else {
        this.commandPromise.reject(new Error(args.error));
      }
      this.commandPromise = null;
    } else {
      console.warn("Unhandled command reply");
    }
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
      if (!isConnected) this.updateConnectionInfo();
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
      console.log("Connect button is not here yet");
      // busy wait to not overload the app
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // await mv2.updateConnectionInfo();
    }
  }

  /**
   * Sends feedback to the server after a command has been executed from martyblocks
   * Usefull for debugging and testing through MST
   * @param {string} feedback Stringified JSON object with feedback
   * @param {boolean} isError Whether the feedback is an error or not (if it's an error it'll be stored to db)
   * @returns {void}
   */
  sendFeedbackToServer(feedback, isError = false) {
    if (window.ReactNativeWebView) {
      return this.send_REST(
        JSON.stringify({
          command: "feedback",
          feedback,
          isError,
        })
      );
    }
  }
}

// adding event listeners for uncaught errors
window.addEventListener("error", function (event) {
  const error = event.error;
  const errorObj = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  };
  const errorString = JSON.stringify(errorObj);
  console.log("Stringified error:", errorString);
  try {
    mv2.sendFeedbackToServer(errorString, true);
  } catch (e) {
    console.log("error sending feedback", e);
  }
});

window.addEventListener("unhandledrejection", function (event) {
  var error = event.reason;
  let msg;
  if (error && error instanceof Error) {
    const errorObj = {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
    var errorString = JSON.stringify(errorObj);
    msg = errorString;
    console.log(msg);
  } else {
    const errorObj = {
      message: "Error object is not available or not an instance of Error.",
    };
    msg = JSON.stringify(errorObj);
    console.log(msg);
  }
  try {
    mv2.sendFeedbackToServer(msg, true);
  } catch (e) {
    console.log("error sending feedback", e);
  }
});

module.exports = Marty2;