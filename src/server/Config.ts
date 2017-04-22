import 'reflect-metadata';
import { Container, injectable, inject, named } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import { StringType } from './Types';

// controller
import { PoolController } from './controller/PoolController';
import { PumpController } from './controller/PumpController';
import { TemperatureController, RoofTemperatureSensorTag, 
        OtherTemperatureSensorTag } from './controller/TemperatureController';

// services
import { SocketFactory, SocketFactoryType } from './services/Socket';
import { IoSocketFactory } from './util/IoSocket';
import { Logger, LoggerType } from './services/Logger';
import { log } from './util/Log';

// hardware
import { BoardFactory, BoardFactoryType } from './hardware/BoardFactory';
import { RpiBoardFactory } from './RpiBoardFactory';
import { TemperatureSensor, TemperatureSensorType } from './hardware/TemperatureSensor';
import { RpiTemperatureSensor } from './raspberrypi/RpiTemperatureSensor';
import { Pump, PumpType } from './hardware/Pump';
import { RpiPump } from './raspberrypi/RpiPump';

// protocol
import { Protocol } from './protocol/Protocol';
import { SettingsRoom } from './protocol/SettingsRoom';

// database
import { DBConnection, DBConnectionStringTag } from './database/DBConnection';
import { DBBasedSettings } from './database/DBBasedSettings';

// root
import { PoolSettings, PoolSettingsType } from './services/PoolSettings';


const container = new Container();
container.applyMiddleware(makeLoggerMiddleware());

container.bind<PoolController>(PoolController).toSelf();
container.bind<PumpController>(PumpController).toSelf();
container.bind<TemperatureController>(TemperatureController).toSelf();
container.bind<string>(StringType).toConstantValue('Roof temperature Sensor').whenParentNamed(RoofTemperatureSensorTag);
container.bind<string>(StringType).toConstantValue('Other temperature Sensor').whenParentNamed(OtherTemperatureSensorTag);

container.bind<Logger>(LoggerType).toConstantValue(log);
container.bind<SocketFactory>(SocketFactoryType).to(IoSocketFactory);
container.bind<BoardFactory>(BoardFactoryType).to(RpiBoardFactory);

container.bind<Pump>(PumpType).to(RpiPump);
container.bind<TemperatureSensor>(TemperatureSensorType).to(RpiTemperatureSensor);

container.bind<Protocol>(Protocol).toSelf();
container.bind<SettingsRoom>(SettingsRoom).toSelf();

container.bind<string>(StringType)
        .toConstantValue('mongodb://localhost:27017/poolcontroller')
        .whenTargetNamed(DBConnectionStringTag);
container.bind<DBConnection>(DBConnection).toSelf();

container.bind<PoolSettings>(PoolSettingsType).to(DBBasedSettings).inSingletonScope();

export { container };