export default class I2cSimulator {
    constructor(address, device) {
        this._address = address;
        this._device = device.device;
    }

    readByte(callback) {
        setTimeout(() => { callback(null, parseInt(Math.random() * 256, 10)); }, 30);
    }

    writeByte(byte, callback) {
        setTimeout(() => { callback(null); }, 30);
    }
}
