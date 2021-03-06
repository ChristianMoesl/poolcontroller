import 'reflect-metadata';
import { Container, injectable, inject, named } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import { StringType } from '../src/Types';

// controller
import { PoolController } from '../src/controller/PoolController';
import { PumpController } from '../src/controller/PumpController';
import { TemperatureController, RoofTemperatureSensorTag, 
    PoolTemperatureSensorTag } from '../src/controller/TemperatureController';
import { WaterLevelController } from '../src/controller/WaterLevelController';

// services
import { SocketFactory, SocketFactoryType } from '../src/services/Socket';
import { IoSocketFactory } from '../src/util/IoSocket';
import { Logger, LoggerType } from '../src/services/Logger';
import { log } from '../src/util/Log';
import { SystemEventDispatcher } from '../src/services/SystemEventDispatcher';

// device
import { TemperatureSensor } from '../src/device/TemperatureSensor';
import { Pump, PumpOnPinTag } from '../src/device/Pump';
import { DigitalWaterLevelSensor, LowerLevelSensorPinTag, LowerMidLevelSensorPinTag, 
    UpperLevelSensorPinTag,UpperMidLevelSensorPinTag} from '../src/device/DigitalWaterLevelSensor';
import { WaterLevelSensor, WaterLevelSensorType } from '../src/device/WaterLevelSensor';
import { WaterInlet, WaterInletPinTag } from '../src/device/WaterInlet';
import { ThreeWayValve, ValvePos1PinTag, ValvePos2PinTag } from '../src/device/ThreeWayValve';

// protocol
import { Protocol } from '../src/protocol/Protocol';
import { SettingsRoom } from '../src/protocol/SettingsRoom';

// database
import { DBConnection, DBConnectionStringTag } from '../src/database/DBConnection';
import { DBBasedSettings } from '../src/database/DBBasedSettings';

// root
import { PoolSettings, PoolSettingsType } from '../src/services/PoolSettings';
import { DigitalPin, DigitalPinType } from '../src/hardware/DigitalPin';
import { AnalogChannel, AnalogChannelType } from '../src/hardware/AnalogChannel';

// mocks
import { DigitalPinMock } from './mocks/DigitalPinMock';
import { AnalogChannelMock } from './mocks/AnalogChannelMock';

export { Container };

export function createContainer(): Container {
    const container = new Container();
    // container.applyMiddleware(makeLoggerMiddleware());

    /*
    *  ============= CONTROLLER =================
    */ 
    container.bind<PoolController>(PoolController).toSelf().inSingletonScope();
    container.bind<PumpController>(PumpController).toSelf().inSingletonScope();
    container.bind<TemperatureController>(TemperatureController).toSelf().inSingletonScope();
    container.bind<WaterLevelController>(WaterLevelController).toSelf().inSingletonScope();
    container.bind<string>(StringType).toConstantValue('Roof temperature Sensor').whenParentNamed(RoofTemperatureSensorTag);
    container.bind<string>(StringType).toConstantValue('Pool temperature Sensor').whenParentNamed(PoolTemperatureSensorTag);

    /*
    *  ============= SERVICES =================
    */ 
    container.bind<Logger>(LoggerType).toConstantValue(log);
    container.bind<SocketFactory>(SocketFactoryType).to(IoSocketFactory);
    container.bind<PoolSettings>(PoolSettingsType).to(DBBasedSettings).inSingletonScope();
    container.bind<SystemEventDispatcher>(SystemEventDispatcher).toSelf().inSingletonScope();

    /*
    *  ============= DEVICE =================
    */ 
    // Temperature sensor
    container.bind<TemperatureSensor>(TemperatureSensor).toSelf();
    container.bind<string>(StringType).toConstantValue('Water pump').whenInjectedInto(Pump);

    // Pump 
    container.bind<Pump>(Pump).toSelf().inSingletonScope();
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(PumpOnPinTag);

    // Water level sensor
    container.bind<WaterLevelSensor>(WaterLevelSensorType).to(DigitalWaterLevelSensor).inSingletonScope();
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(UpperLevelSensorPinTag);
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(LowerLevelSensorPinTag);
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(LowerMidLevelSensorPinTag);
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(UpperMidLevelSensorPinTag);
    container.bind<string>(StringType).toConstantValue('Water level sensor').whenInjectedInto(DigitalWaterLevelSensor);

    // Water inlet
    container.bind<WaterInlet>(WaterInlet).toSelf().inSingletonScope();
    container.bind<string>(StringType).toConstantValue('Water inlet').whenInjectedInto(WaterInlet);
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(WaterInletPinTag);

    // Three way valve
    container.bind<ThreeWayValve>(ThreeWayValve).toSelf().inSingletonScope();
    container.bind<string>(StringType).toConstantValue('Water valve').whenInjectedInto(ThreeWayValve);
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(ValvePos1PinTag);
    container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(ValvePos2PinTag);

    /*
    *  ============= PROTOCOL =================
    */ 
    container.bind<Protocol>(Protocol).toSelf();
    container.bind<SettingsRoom>(SettingsRoom).toSelf();

    /*
    *  ============= DATABASE =================
    */ 
    container.bind<string>(StringType)
        .toConstantValue('mongodb://localhost:27017/poolcontroller')
        .whenTargetNamed(DBConnectionStringTag);
    container.bind<DBConnection>(DBConnection).toSelf();

    /*
    *  ============= MOCKS =================
    */ 
    container.bind<DigitalPin>(DigitalPinType).to(DigitalPinMock).whenTargetIsDefault();
    container.bind<AnalogChannel>(AnalogChannelType).to(AnalogChannelMock);

    return container;
}