/*
let I2c: object;
try {
    I2c = require('i2c-bus');
} catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
    }
    I2c = require('./I2cSimulator');
}

// const I2c = process.env.NODE_ENV === 'development' ?
//     require('./I2cSimulator') : require('i2c');


export default class Pcf8574 {
    private device: object;
    private address: number;

    constructor(i2cDevice: any, baseAddress: number) {
        this.device = new I2c(baseAddress, { device: i2cDevice });
        this.address = baseAddress;

        this.device.readByte((err) => {
            if (err) {
                throw new Error();
            }
        });
    }

    read(callback) {
        this.device.readByte((err, result) => {
            callback(err, err ? null : result[0]);
        });
    }

    write(state, callback) {
        if (typeof state !== 'number' || state > 0xFF || state < 0) {
            throw new Error('The parameter state has to be of type number with: 0 <= state <= 0xFF');
        }
        this.device.writeByte(state, (err) => {
            callback(err);
        });
    }
}

export class Pcf8574A {
    constructor(private baseAddress: number) {
    } 
}
*/