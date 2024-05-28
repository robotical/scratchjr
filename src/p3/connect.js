import P3vm from './P3vm';

async function connectToP3(onConnectCb) {
    const p3Vm = P3vm.getInstance();
    p3Vm.isConnecting = true;
    if (navigator.bluetooth === undefined) {
        return alert("Web Bluetooth is not supported in this browser, or bluetooth is disabled/permission denied. Please try again in a different browser.");
    }
    try {
        const device = await navigator.bluetooth.requestDevice({
            // acceptAllDevices: true,
            filters: [{ services: [0x1234] }],
            optionalServices: [],
        });
        // await getRSSI(device.id); // this is redundant, since we're now 
        // taking rssi directly from RIC 
        console.log(`p3-connect - Selected device: ${device.name} id ${device.id}`);
        if (await p3Vm.connect("WebBLE", device)) {
            console.log("p3-connect - Connected to BLE");
            onConnectCb && onConnectCb();
        } else {
            console.log("p3-connect - Failed to connect to BLE");
        }
    } catch (error) {
        console.error(`p3-connect - Failed to connect to BLE: ${error}`);
        await p3Vm.connect();
    }
    p3Vm.isConnecting = false;
}

export default connectToP3;