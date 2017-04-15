import { expect } from 'chai';
import { useFakeTimers, spy } from 'sinon';
import { Pump } from '../../../src/server/hardware/Pump';
//import { PumpController } from '../../../src/server/services/PumpController';

class SettingsMock {
    private pumpTime: number;

    constructor() {
        this.pumpTime = 0;
    }
    getPumpTime() {
        return this.pumpTime;
    }
}

describe('server/service/PumpController', () => {/*
    const name = 'Hello World';
    let pump = null;
    let settings = null;
    let pumpController = null;
    let clock = null;
    const startDay = new Date(2017, 4, 14, 0, 0, 0, 0);

    before(() => {
        pump = new Pump(name);
        settings = new SettingsMock();
        pumpController = new PumpController(pump, settings);
        clock = useFakeTimers(startDay.getTime());
    });

    after(() => {
        clock.restore();
    });

    it('has to have a name', () => {
        settings.pumpTime = 6 * 60 * 60;

        clock.tick(24 * 60 * 60 * 1000);

        expect(pump.operatingTime).to.equal(6 * 60 * 60);
    });*/
});
