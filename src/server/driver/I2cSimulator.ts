export default class I2cSimulator {

    constructor(private address: any, private device: any) {
    }

    readByte(callback) {
   //     setTimeout(() => { callback(null, parseInt(Math.random() * 256, 10)); }, 30);
    }

    writeByte(byte, callback) {
  //      setTimeout(() => { callback(null); }, 30);
    }
}
