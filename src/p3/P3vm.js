import ConnectP3 from "../editor/ui/ConnectP3";
import { Observable } from "../utils/Observable";

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
        this.data = {};
    }

    setConnected(connected) {
        this.isP3Connected = connected;
        if (connected) {
            this.publish(P3vmEvents.P3_CONNECTED);
        } else {
            this.publish(P3vmEvents.P3_DISCONNECTED);
        }
    }

    async connect() {
        // get name as a parameter
        ConnectP3.init("name");

        // send command to start the verification process (set the lights)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const lights = [randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor()];
        // set the lights in the modal and wait for confirmation or cancel
        const modalResults = await ConnectP3.setLights(lights);

        // if cancel, stop the connection process and return
        if (!modalResults) {
            console.log("P3vm.connect", "not connected");
            return;
        }

        // if confirm, connect to the device
        console.log("P3vm.connect", "connected");
        this.setConnected(true);
    }

    disconnect() {
        this.setConnected(false);
    }
}

window.P3vm = P3vm;

const randomColor = () => {
    const colors = ['blue', 'green', 'red', 'yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
}

export class P3vmEvents {
    static P3_CONNECTED = "p3-connected";
    static P3_DISCONNECTED = "p3-disconnected";
}