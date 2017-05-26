import 'reflect-metadata';
import { Container, injectable, inject, named } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import { StringType } from './Types';

// controller
import { PoolController } from './controller/PoolController';
import { PumpController } from './controller/PumpController';
import { TemperatureController, RoofTemperatureSensorTag, 
        PoolTemperatureSensorTag } from './controller/TemperatureController';
import { WaterLevelController } from './controller/WaterLevelController';

// services
import { SocketFactory, SocketFactoryType } from './services/Socket';
import { IoSocketFactory } from './util/IoSocket';
import { Logger, LoggerType } from './services/Logger';
import { log } from './util/Log';

// device
import { TemperatureSensor } from './device/TemperatureSensor';
import { Pump } from './device/Pump';
import { ThreeWayValve } from './device/ThreeWayValve';

// protocol
import { Protocol } from './protocol/Protocol';
import { SettingsRoom } from './protocol/SettingsRoom';

// database
import { DBConnection, DBConnectionStringTag } from './database/DBConnection';
import { DBBasedSettings } from './database/DBBasedSettings';

// root
import { PoolSettings, PoolSettingsType } from './services/PoolSettings';


const container = new Container();
// container.applyMiddleware(makeLoggerMiddleware());

// controller
container.bind<PoolController>(PoolController).toSelf();
container.bind<PumpController>(PumpController).toSelf();
container.bind<TemperatureController>(TemperatureController).toSelf();
container.bind<WaterLevelController>(WaterLevelController).toSelf();
container.bind<string>(StringType).toConstantValue('Roof temperature Sensor').whenParentNamed(RoofTemperatureSensorTag);
container.bind<string>(StringType).toConstantValue('Pool temperature Sensor').whenParentNamed(PoolTemperatureSensorTag);

// services
container.bind<Logger>(LoggerType).toConstantValue(log);
container.bind<SocketFactory>(SocketFactoryType).to(IoSocketFactory);
container.bind<PoolSettings>(PoolSettingsType).to(DBBasedSettings).inSingletonScope();

// device
container.bind<Pump>(Pump).toSelf().inSingletonScope();
container.bind<TemperatureSensor>(TemperatureSensor).toSelf();
container.bind<ThreeWayValve>(ThreeWayValve).toSelf().inSingletonScope();
container.bind<string>(StringType).toConstantValue('Water pump').whenInjectedInto(Pump);
container.bind<string>(StringType).toConstantValue('Water valve').whenInjectedInto(ThreeWayValve);

// protocol
container.bind<Protocol>(Protocol).toSelf();
container.bind<SettingsRoom>(SettingsRoom).toSelf();

// database
container.bind<string>(StringType)
        .toConstantValue('mongodb://localhost:27017/poolcontroller')
        .whenTargetNamed(DBConnectionStringTag);
container.bind<DBConnection>(DBConnection).toSelf();

export { container };