const tt = null;

import { container } from '../../../src/server/Config';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub } from 'sinon';
import { RpiPump } from '../../../src/server/raspberrypi/RpiPump';
import { Pump, PumpType } from '../../../src/server/hardware/Pump';
import { PumpController } from '../../../src/server/controller/PumpController';
import { PoolSettings, PoolSettingsType } from '../../../src/server/services/PoolSettings';

describe('server/service/PumpController', () => {
    const name = 'Hello World';
    let pump = null;
    let settings: PoolSettings = null;
    let pumpController = null;
    let clock: SinonFakeTimers = null;
    const startDay = new Date(2017, 4, 14, 0, 0, 0, 0);

    before(() => {
        container.snapshot();
        clock = useFakeTimers(startDay.getTime());
        settings = container.get<PoolSettings>(PoolSettingsType);
        stub(settings, 'getPumpTime').returns(6 * 60 * 60);
        pumpController = container.get<PumpController>(PumpController);
        pump = container.get<Pump>(PumpType);
    });

    after(() => {
        clock.restore();
        container.restore();
    });

    it('has to pump at least 6 hours a day', () => {
        clock.tick(24 * 60 * 60 * 1000);
        expect(pump.operatingTime).to.equal(6 * 60 * 60);
    });

    it('has to stop pump on midnight', () => {
        clock.tick(36 * 60 * 60 * 1000);
        expect(pump.operatingTime).to.equal(6 * 60 * 60);
    });
});
