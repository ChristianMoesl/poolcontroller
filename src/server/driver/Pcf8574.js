/* eslint-disable */
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
/* eslint-enable */

export default class Pcf8574 {
    constructor(i2cDevice, baseAddress) {
        this._device = new I2c(baseAddress, { device: i2cDevice });
        this._address = baseAddress;

        this._device.readByte((err) => {
            if (err) {
                throw new Error();
            }
        });
    }

    read(callback) {
        this._device.readByte((err, result) => {
            callback(err, err ? null : result[0]);
        });
    }

    write(state, callback) {
        if (typeof state !== 'number' || state > 0xFF || state < 0) {
            throw new Error('The parameter state has to be of type number with: 0 <= state <= 0xFF');
        }
        this._device.writeByte(state, (err) => {
            callback(err);
        });
    }
}

export class Pcf8574A {
    constructor(baseAddress) {
        this._address = baseAddress;
    }
}
