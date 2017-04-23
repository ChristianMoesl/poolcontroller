import { container } from '../Config';
import { expect } from 'chai';
import { useFakeTimers, spy, SinonFakeTimers, stub } from 'sinon';
import { Event, EventDispatcher } from '../../../src/server/util/Event';
import { DigitalPin, DigitalPinType, DigitalPinState } from '../../../src/server/hardware/DigitalPin';
import { PumpController } from '../../../src/server/controller/PumpController';
import { PoolSettings, PoolSettingsType } from '../../../src/server/services/PoolSettings';
import { PeripheralError, PeripheralErrorLevel } from '../../../src/server/device/Peripheral';
import { TemperatureSensor } from '../../../src/server/device/TemperatureSensor';
import { TemperatureController, PoolTemperatureSensorTag, RoofTemperatureSensorTag } from '../../../src/server/controller/TemperatureController';
import { ThreeWayValve, ValvePosition } from '../../../src/server/device/ThreeWayValve';

describe('server/controller/TemperatureController', () => {
    let controller: TemperatureController = null;
    let roof: TemperatureSensor = null;
    let pool: TemperatureSensor = null;
    let valve: ThreeWayValve = null;
    let pos: ValvePosition = null;
    let settings: PoolSettings = null;
    let roofChanged = new EventDispatcher<TemperatureSensor, number>();
    let poolChanged = new EventDispatcher<TemperatureSensor, number>();
    let roofTemp = 0;
    let poolTemp = 0;

    beforeEach(() => {
        container.snapshot();

        roof = container.getNamed<TemperatureSensor>(TemperatureSensor, RoofTemperatureSensorTag);
        pool = container.getNamed<TemperatureSensor>(TemperatureSensor, PoolTemperatureSensorTag);
        valve = container.get<ThreeWayValve>(ThreeWayValve);
        settings = container.get<PoolSettings>(PoolSettingsType);
        pos = null;

        stub(roof, 'getTemperature').callsFake(() => roofTemp);
        stub(pool, 'getTemperature').callsFake(() => poolTemp);
        stub(roof, 'changed').callsFake(() => roofChanged);
        stub(pool, 'changed').callsFake(() => poolChanged);
        stub(valve, 'changePosition').callsFake(v => { pos = v });

        settings.setTargetTemperature(25);
        settings.setTemperatureThreshold(5);

        container.unbind(TemperatureSensor);
        container.bind<TemperatureSensor>(TemperatureSensor).toConstantValue(roof).whenTargetNamed(RoofTemperatureSensorTag);
        container.bind<TemperatureSensor>(TemperatureSensor).toConstantValue(pool).whenTargetNamed(PoolTemperatureSensorTag);
        container.rebind<ThreeWayValve>(ThreeWayValve).toConstantValue(valve);

        controller = container.get<TemperatureController>(TemperatureController);
    });

    afterEach(() => {
        container.restore();
    });

    it('has to heat up when threshold is reached and target is not reached', () => {
        roofTemp = 25;
        poolTemp = 20;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        expect(controller.isRequiredToPump()).to.be.true;
    });

    it('has to stop heating when target is reached', () => {
        roofTemp = 25;
        poolTemp = 20;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        controller.start();

        roofTemp = 25;
        poolTemp = 25;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        expect(controller.isRequiredToPump()).to.be.false;
    });

    it('has to wait with valve change until command is executed', () => {
        roofTemp = 25;
        poolTemp = 20;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        expect(pos).to.be.null;
    });

    it ('has to change valve when executing start', () => {
        roofTemp = 25;
        poolTemp = 20;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        controller.start();

        expect(controller.isRequiredToPump()).to.be.true;
        expect(pos).to.be.equal(ValvePosition.first);
    });

    it('has to stop when reset command is executed', () => {
        roofTemp = 25;
        poolTemp = 20;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        controller.start();
        controller.reset();

        expect(controller.isRequiredToPump()).to.be.false;
        expect(pos).to.be.equal(ValvePosition.idle);
    });

    it('has to do nothing when target is reached', () => {
        roofTemp = 25;
        poolTemp = 25;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        expect(controller.isRequiredToPump()).to.be.false;
    });

    it('has to cool down up when threshold is reached and target is not reached', () => {
        roofTemp = 25;
        poolTemp = 30;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        expect(controller.isRequiredToPump()).to.be.true;
    });

    it('has to stop cooling when target is reached', () => {
        roofTemp = 25;
        poolTemp = 30;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        controller.start();

        roofTemp = 25;
        poolTemp = 25;

        roofChanged.dispatch(roof, roofTemp);
        poolChanged.dispatch(pool, poolTemp);

        expect(controller.isRequiredToPump()).to.be.false;
    });
});
