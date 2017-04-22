import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers } from 'sinon';
import { Pump } from '../../../src/server/hardware/Pump';
import { PumpController } from '../../../src/server/services/PumpController';

class SettingsMock {
    private pumpTime: number;

    constructor() {
        this.pumpTime = 0;
    }
    getPumpTime() {
        return this.pumpTime;
    }
}

describe('server/service/PumpController', () => {
    const name = 'Hello World';
    let pump = null;
    let settings = null;
    let pumpController = null;
    let clock: SinonFakeTimers = null;
    const startDay = new Date(2017, 4, 14, 0, 0, 0, 0);

    before(() => {
        clock = useFakeTimers(startDay.getTime());
        pump = new Pump(name);
        settings = new SettingsMock();
        pumpController = new PumpController(pump, settings);
    });

    after(() => {
        clock.restore();
    });

    it('has to pump at least 6 hours a day', () => {
        settings.pumpTime = 6 * 60 * 60;

        clock.tick(24 * 60 * 60 * 1000);

        expect(pump.operatingTime).to.equal(6 * 60 * 60);
    });

    it('has to stop pump on midnight', () => {
        settings.pumpTime = 6 * 60 * 60;

        clock.tick(36 * 60 * 60 * 1000);

        expect(pump.operatingTime).to.equal(6 * 60 * 60);
    });
});
