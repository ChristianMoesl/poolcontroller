import { container } from '../Config';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub } from 'sinon';
import { Event, EventDispatcher } from '../../../src/server/util/Event';
import { DigitalWaterLevelSensor, LowerLevelSensorPinTag, LowerMidLevelSensorPinTag, 
    UpperLevelSensorPinTag, UpperMidLevelSensorPinTag } from '../../../src/server/device/DigitalWaterLevelSensor';
import { WaterLevelSensor, WaterLevelSensorType } from '../../../src/server/device/WaterLevelSensor';
import { DigitalPin, DigitalPinType, DigitalPinState } from '../../../src/server/hardware/DigitalPin';
import { PumpController } from '../../../src/server/controller/PumpController';
import { PoolSettings, PoolSettingsType } from '../../../src/server/services/PoolSettings';
import { PeripheralError, PeripheralErrorLevel } from '../../../src/server/device/Peripheral';
import { WaterLevelController } from '../../../src/server/controller/WaterLevelController';
import { WaterInlet } from '../../../src/server/device/WaterInlet';

describe('server/controller/WaterLevelController', () => {
    let inlet: WaterInlet = null;
    let level: DigitalWaterLevelSensor = null;
    let controller: WaterLevelController = null;
    let waterLevel = 50;
    let isInletOn = false;
    let levelChanged = new EventDispatcher<WaterLevelSensor, number>();

    beforeEach(() => {
        container.snapshot();
        
        level = container.get<WaterLevelSensor>(WaterLevelSensorType) as DigitalWaterLevelSensor;
        inlet = container.get<WaterInlet>(WaterInlet);

        stub(level, 'getWaterLevel').callsFake(() => waterLevel);
        stub(level, 'changed').callsFake(() => levelChanged);
        stub(inlet, 'turnOn').callsFake(() => { isInletOn = true; });
        stub(inlet, 'turnOff').callsFake(() => { isInletOn = false; });

        controller = container.get<WaterLevelController>(WaterLevelController);
    });

    afterEach(() => {
        container.restore();
    });

    it('has to get water when <= 25%', () => {
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.false;

        waterLevel = 25;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.true;
    });

    it('has to stop getting water when >= 50%', () => {
        waterLevel = 25;
        levelChanged.dispatch(level, waterLevel);

        waterLevel = 49.9;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn, 'Should stay on when < 50%').to.be.true;

        waterLevel = 50;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn, 'Should stop on exactly 50%').to.be.false;
    });
});
