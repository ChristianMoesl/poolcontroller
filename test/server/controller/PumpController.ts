const tt = null;

import { container } from '../../../src/server/Config';
import * as Services from '../../../src/server/Services';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub } from 'sinon';
import { RpiPump } from '../../../src/server/hardware/rpi/RpiPump';
import { PumpController } from '../../../src/server/controller/PumpController';
import { PoolSettings } from '../../../src/server/services/PoolSettings';
import { BoardFactory } from '../../../src/server/hardware/BoardFactory';

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
        settings = container.get<PoolSettings>(Services.PoolSettings);
        stub(settings, 'getPumpTime').returns(6 * 60 * 60);
        pumpController = container.get<PumpController>(PumpController);
        pump = container.get<BoardFactory>(Services.BoardFactory).getPump('WATER');
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
