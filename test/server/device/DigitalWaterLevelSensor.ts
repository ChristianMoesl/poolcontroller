import { container } from '../Config';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub } from 'sinon';
import { DigitalWaterLevelSensor, LowerLevelSensorPinTag, LowerMidLevelSensorPinTag, 
    UpperLevelSensorPinTag, UpperMidLevelSensorPinTag } from '../../../src/server/device/DigitalWaterLevelSensor';
import { WaterLevelSensor, WaterLevelSensorType } from '../../../src/server/device/WaterLevelSensor';
import { DigitalPin, DigitalPinType, DigitalPinState } from '../../../src/server/hardware/DigitalPin';
import { PumpController } from '../../../src/server/controller/PumpController';
import { PoolSettings, PoolSettingsType } from '../../../src/server/services/PoolSettings';
import { PeripheralError, PeripheralErrorLevel } from '../../../src/server/device/Peripheral';

describe('server/device/DigitalWaterLevelSensor', () => {
    let upper: DigitalPin = null;
    let upperMid: DigitalPin = null;
    let lowerMid: DigitalPin = null;
    let lower: DigitalPin = null;
    let levelSensor: DigitalWaterLevelSensor = null;

    beforeEach(() => {
        container.snapshot();
        
        upper = container.getNamed<DigitalPin>(DigitalPinType, UpperLevelSensorPinTag);
        upperMid = container.getNamed<DigitalPin>(DigitalPinType, UpperMidLevelSensorPinTag);
        lowerMid = container.getNamed<DigitalPin>(DigitalPinType, LowerMidLevelSensorPinTag);
        lower = container.getNamed<DigitalPin>(DigitalPinType, LowerLevelSensorPinTag);
        
        levelSensor = container.get<WaterLevelSensor>(WaterLevelSensorType) as DigitalWaterLevelSensor;
    });

    afterEach(() => {
        container.restore();
    });

    it('has to emit an error when hardware is incosistent', () => {
        // Set legal state
        upper.setActive();
        upperMid.setActive();
        lowerMid.setActive();
        lower.setActive();

        let error: PeripheralError = null;
        levelSensor.errorOccured().subscribe((s, e) => { error = e; });

        expect(error).to.be.null;
        
        lowerMid.setIdle();

        expect(error).not.to.be.null;
        expect(error).to.be.instanceOf(PeripheralError);
        expect(error.getPeripheralName()).to.eq(levelSensor.name());
        expect(error.getLevel()).to.eq(PeripheralErrorLevel.fatal, 'Has to emit a fatal error');

        error = null;

        lowerMid.setActive();

        expect(error).to.be.null;
    });

    it('has to measure the water level', () => {
        upper.setActive();
        upperMid.setActive();
        lowerMid.setActive();
        lower.setActive();
        expect(levelSensor.getWaterLevel()).to.equal(90, 'Has to display 90%');
        
        upper.setIdle();
        expect(levelSensor.getWaterLevel()).to.equal(70, 'Has to display 70%');

        upperMid.setIdle();
        expect(levelSensor.getWaterLevel()).to.equal(30, 'Has to display 30%');

        lowerMid.setIdle();
        expect(levelSensor.getWaterLevel()).to.equal(10, 'Has to display 10%');

        lower.setIdle();
        expect(levelSensor.getWaterLevel()).to.equal(0, 'Has to display 0%');
    });
});
