import { createContainer, Container } from '../Config';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub, sandbox } from 'sinon';
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
import { OperationMode } from '../../../src/server/system/OperationMode';

describe('server/controller/WaterLevelController', () => {
    let container: Container;
    let inlet: WaterInlet;
    let level: DigitalWaterLevelSensor;
    let controller: WaterLevelController;
    let settings: PoolSettings;
    let waterLevel: number;
    let isInletOn: boolean;
    let levelChanged: EventDispatcher<WaterLevelSensor, number>;
    let clock: SinonFakeTimers;

    beforeEach(() => {
        container = createContainer();
        clock = useFakeTimers();

        level = container.get<WaterLevelSensor>(WaterLevelSensorType) as DigitalWaterLevelSensor;
        inlet = container.get<WaterInlet>(WaterInlet);
        settings = container.get<PoolSettings>(PoolSettingsType);
        waterLevel = 50;
        levelChanged = new EventDispatcher<WaterLevelSensor, number>();
        isInletOn = false;

        stub(level, 'getWaterLevel').callsFake(() => waterLevel);
        stub(level, 'changed').callsFake(() => levelChanged);
        stub(inlet, 'turnOn').callsFake(() => { isInletOn = true; });
        stub(inlet, 'turnOff').callsFake(() => { isInletOn = false; });

        controller = container.get<WaterLevelController>(WaterLevelController);
    });

    afterEach(() => {
        clock.restore();
    });

    it(`has to get water when level <= ${WaterLevelController.lowerInletThreshold}%`, () => {
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.false;

        waterLevel = WaterLevelController.lowerInletThreshold;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.true;
    });

    it(`has to stop getting water when level >= ${WaterLevelController.upperInletThreshold}%`, () => {
        waterLevel = WaterLevelController.lowerInletThreshold;
        levelChanged.dispatch(level, waterLevel);

        waterLevel = WaterLevelController.upperInletThreshold - 0.1;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.true;

        waterLevel = WaterLevelController.upperInletThreshold;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.false;
    });

    it(`has to disable the pump when level < ${WaterLevelController.lowerInletThreshold}%`, () => {
        waterLevel = WaterLevelController.lowerInletThreshold;
        levelChanged.dispatch(level, waterLevel);
        expect(controller.isAllowedToPump()).to.be.true;

        waterLevel = WaterLevelController.lowerInletThreshold - 0.1;
        levelChanged.dispatch(level, waterLevel);
        expect(controller.isAllowedToPump()).to.be.false;
    });

    it(`has to force the pump to be turned on when level >= ${WaterLevelController.upperPumpThreshold}%`, () => {
        expect(controller.isRequiredToPump()).to.be.false;

        waterLevel = WaterLevelController.upperPumpThreshold - 0.1;
        levelChanged.dispatch(level, waterLevel);
        expect(controller.isRequiredToPump()).to.be.false;

        waterLevel = WaterLevelController.upperPumpThreshold;
        levelChanged.dispatch(level, waterLevel);
        expect(controller.isRequiredToPump()).to.be.true;
    });

    it('has to enable the pump exactly the set pump time', () => {
        waterLevel = WaterLevelController.upperPumpThreshold;
        levelChanged.dispatch(level, waterLevel);

        settings.setPumpIntervall(5);

        clock.tick(6 * 60 * 1000);

        expect(controller.isRequiredToPump()).to.be.false;
    });

    it (`after reaching top it has to disable the pump when reaching < ${WaterLevelController.lowerInletThreshold}%`, () => {
        waterLevel = WaterLevelController.upperPumpThreshold;
        levelChanged.dispatch(level, waterLevel);

        waterLevel = WaterLevelController.lowerInletThreshold - 0.1;
        levelChanged.dispatch(level, waterLevel);
        expect(controller.isRequiredToPump()).to.be.false;
    });

    it ('has to stop operating in manual mode', () => {
        waterLevel = WaterLevelController.lowerInletThreshold;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.true;

        settings.setOperationMode(OperationMode.manual);

        waterLevel = WaterLevelController.upperInletThreshold;
        levelChanged.dispatch(level, waterLevel);
        expect(isInletOn).to.be.true;
    });
});
