import { container } from '../Config';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub } from 'sinon';
import { Pump } from '../../../src/server/device/Pump';
import { PumpController } from '../../../src/server/controller/PumpController';
import { PoolSettings, PoolSettingsType } from '../../../src/server/services/PoolSettings';
import { TemperatureController } from '../../../src/server/controller/TemperatureController';
import { WaterLevelController } from '../../../src/server/controller/WaterLevelController';

describe('server/service/PumpController', () => {
    let pump: Pump = null;
    let settings: PoolSettings = null;
    let controller: PumpController = null;
    let level: WaterLevelController = null;
    let temperature: TemperatureController = null;

    let isAllowed: boolean;
    let isRequiredByTemp: boolean;
    let isRequiredByLevel: boolean;

    let clock: SinonFakeTimers = null;
    const startDay = new Date(2017, 4, 14, 0, 0, 0, 0);

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;

    beforeEach(() => {
        container.snapshot();
        clock = useFakeTimers(startDay.getTime());
        
        settings = container.get<PoolSettings>(PoolSettingsType);
        pump = container.get<Pump>(Pump);
        level = container.get<WaterLevelController>(WaterLevelController);
        temperature = container.get<TemperatureController>(TemperatureController);

        isAllowed = true;
        isRequiredByLevel = false;
        isRequiredByTemp = false;
        
        stub(settings, 'getPumpTime').returns(6 * 60);
        stub(level, 'isAllowedToPump').callsFake(() => isAllowed);
        stub(level, 'isRequiredToPump').callsFake(() => isRequiredByLevel);
        stub(temperature, 'isRequiredToPump').callsFake(() => isRequiredByTemp);

        controller = container.get<PumpController>(PumpController);
    });

    afterEach(() => {
        clock.restore();
        container.restore();
    });

    it('has to pump at least 6 hours a day', () => {
        clock.tick(day);
        expect(pump.getOperatingTime()).to.equal(6 * hour);
    });

    it('has to stop pump on midnight', () => {
        clock.tick(day + 12 * hour);
        expect(pump.getOperatingTime()).to.equal(6 * hour);
    });

    it('has to stop pump when not allowed', () => {
        clock.tick(22 * hour);
        isAllowed = false;
        clock.tick(2 * hour);
        expect(pump.getOperatingTime()).to.be.within(4 * hour - (2 * minute), 4 * hour + (2 * minute));
    });

    it('isn\'t allowed to pump when the level is to high', () => {
        isAllowed = false;
        isRequiredByLevel = true;
        isRequiredByTemp = true;

        clock.tick(10000);

        expect(pump.getOperatingTime()).to.equal(0);
    });

    it('should stop during heating/cooling when not allowed', () => {
        isRequiredByTemp = true;

        clock.tick(hour);

        isAllowed = false;

        clock.tick(hour);

        expect(pump.getOperatingTime()).to.be.within(hour - 2 * minute, hour + 2 * minute);
    });

    it('should stop during filtering when not allowed', () => {
        isRequiredByLevel = true;

        clock.tick(hour);

        isAllowed = false;

        clock.tick(hour);

        expect(pump.getOperatingTime()).to.be.within(hour - 2 * minute, hour + 2 * minute);
    });
});
