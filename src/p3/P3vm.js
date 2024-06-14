import { RaftConnEvent, RaftPublishEvent, RaftLog } from "@robdobsn/raftjs";
import UIConnectP3 from "../editor/ui/ConnectP3";
import { Observable } from "../utils/Observable";
import { ConnManager } from "@robotical/roboticaljs";
import PublishedDataAnalyser from "./PublishedDataAnalyser";
import P3vmEvents from "./P3EventEnum.js";

const ledLcdColours = [
    { led: "#202000", lcd: "#FFFF00" },
    { led: "#880000", lcd: "#FF0000" },
    { led: "#000040", lcd: "#0080FF" },
];
export default class P3vm extends Observable {
    static instance = null;

    isP3Connected = false;

    static getInstance() {
        if (P3vm.instance == null) {
            P3vm.instance = new P3vm();
        }
        return P3vm.instance;
    }
    constructor() {
        super();
        console.log("setting the log level")
        RaftLog.setLogLevel(0);
        RaftLog.error("this is an error");
        RaftLog.warn("this is a warning");
        RaftLog.info("this is an info");
        RaftLog.debug("this is a debug");
        RaftLog.verbose("this is a trace");
    }

    setConnected(connected) {
        this.isP3Connected = connected;
        if (connected) {
            this.publish(P3vmEvents.P3_CONNECTED);
        } else {
            this.publish(P3vmEvents.P3_DISCONNECTED);
        }
    }

    async onConnectedCallback() {
        const connManager = ConnManager.getInstance();

        // get name of the device
        console.log("setting the ui with the name")
        const sysInfo = await connManager.getConnector().getRaftSystemUtils().getSystemInfo();
        UIConnectP3.init(sysInfo.Friendly || "Cog");

        // send command to start the verification process (set the lights)
        const msgHandler = connManager.getConnector().getRaftSystemUtils().getMsgHandler();
        const onConnEvent = connManager.getConnector().onConnEvent.bind(connManager.getConnector());
        const isConnectedFn = connManager.isConnected.bind(connManager);

        const didVerificationStart = await connManager.getConnector()._systemType.getLEDPatternChecker().checkCorrectRICStart(
            ledLcdColours,
            msgHandler,
            onConnEvent,
            isConnectedFn
        );

        if (!didVerificationStart) {
            console.error("P3vm.connect", "verification failed");
            return;
        }

        // // set the lights in the modal and wait for confirmation or cancel
        // const modalResults = await UIConnectP3.setLights(lights);

        // // if cancel, stop the connection process and return
        // if (!modalResults) {
        //     console.log("P3vm.connect", "not connected");
        //     return;
        // }

        // // if confirm, connect to the device
        // console.log("P3vm.connect", "connected");
        // this.setConnected(true);
    }

    async onVerifyingCallback(lights) {
        const connManager = ConnManager.getInstance();
        const cogLEDs = connManager.getConnector()._systemType.getLEDPatternChecker();
        // set the lights in the modal and wait for confirmation or cancel
        const modalResults = await UIConnectP3.setLights(lights);

        // if cancel, stop the verification and connection processes and return
        if (!modalResults) {
            await cogLEDs.checkCorrectRICStop(false);
            return;
        }

        await cogLEDs.checkCorrectRICStop(true);
    }

    async onVerifiedCorrectCallback() {
        this.setConnected(true);
    }

    async onDisconnectedCallback() {
        this.setConnected(false);
        const connManager = ConnManager.getInstance();
        const connector = connManager.getConnector();
        connector.setEventListener(null);
    }

    async onRejectedCallback() {
        this.setConnected(false);
        const connManager = ConnManager.getInstance();
        connManager.disconnect();
    }

    async onPublishDataCallback(data) {

        // decide data analyser
        const pubDataAnalyser = PublishedDataAnalyser.getInstance();
        pubDataAnalyser.analyse(data, this);
    }

    async connect() {
        const connManager = ConnManager.getInstance();


        const listener = async (
            eventType,
            eventEnum,
            eventName,
            data
        ) => {
            if (eventType === "conn") {
                console.log("in connection event", eventType, eventEnum, eventName, data);
                if (eventEnum === RaftConnEvent.CONN_CONNECTED) {
                    await this.onConnectedCallback();
                }
                if (eventEnum === RaftConnEvent.CONN_DISCONNECTED) {
                    this.onDisconnectedCallback();
                }
                if (eventEnum === RaftConnEvent.CONN_VERIFYING_CORRECT) {
                    // verification process started. show the lights in the modal
                    this.onVerifyingCallback(data);
                }
                if (eventEnum === RaftConnEvent.CONN_VERIFIED_CORRECT) {
                    this.onVerifiedCorrectCallback();
                }
                if (eventEnum === RaftConnEvent.CONN_REJECTED) {
                    this.onRejectedCallback();
                }
            } else if (eventType === "pub") {
                if (eventEnum === RaftPublishEvent.PUBLISH_EVENT_DATA) {
                    const systemType = connManager.getConnector().getSystemType();
                    if (systemType) {
                        if (this.isP3Connected) {
                              const newState = systemType.getStateInfo();
                            // const accelData = systemType.getRICStateInfo().imuData.accel;
                            // const newState = {
                            //     "Light": {
                            //         "irVals": [1103, 341, randomNumber(0, 1400)],
                            //     },
                            //     "LSM6DS": {
                            //         "gx": randomNumber(-1, 1),
                            //         "gy": randomNumber(-1, 1),
                            //         "gz": randomNumber(-1, 1),
                            //         "ax": accelData.x,
                            //         "ay": accelData.y,
                            //         "az": accelData.z,
                            //         "tsMs": 19848
                            //     }, "_deviceLastTs": { "LSM6DS": { "lastMs": 19848, "offsetMs": 0 } }
                            // }
                            this.onPublishDataCallback(newState);
                        }
                    }
                }
            }
        };

        // Set the listener function 
        connManager.setConnectionEventListener(listener);

        const wasConnected = await connManager.connect("WebBLE");
        if (!wasConnected) {
            console.error("P3vm.connect", "not connected");
            return;
        }
    }

    async disconnect() {
        const connManager = ConnManager.getInstance();
        await connManager.disconnect();
        this.setConnected(false);
    }

    async sendRICRESTMsg(commandName, params = {}, bridgeID = undefined) {
        const connManager = ConnManager.getInstance();
        const results = await connManager.getConnector().sendRICRESTMsg(commandName, params, bridgeID);
        return results;
    }
}

window.P3vm = P3vm;




// utils
const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}