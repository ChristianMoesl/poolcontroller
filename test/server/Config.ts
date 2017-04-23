import { container } from '../../src/server/Config';
import { StringType } from '../../src/server/Types';
import { DigitalPin, DigitalPinType } from '../../src/server/hardware/DigitalPin';
import { AnalogChannel, AnalogChannelType } from '../../src/server/hardware/AnalogChannel';
import { DigitalPinMock } from './mocks/DigitalPinMock';
import { AnalogChannelMock } from './mocks/AnalogChannelMock';
import { DigitalWaterLevelSensor, LowerLevelSensorPinTag, LowerMidLevelSensorPinTag, 
    UpperLevelSensorPinTag,UpperMidLevelSensorPinTag} from '../../src/server/device/DigitalWaterLevelSensor';
import { WaterLevelSensor, WaterLevelSensorType } from '../../src/server/device/WaterLevelSensor';
import { Pump, PumpOnPinTag } from '../../src/server/device/Pump';

// Water level sensor
container.bind<WaterLevelSensor>(WaterLevelSensorType).to(DigitalWaterLevelSensor).inSingletonScope();
container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(UpperLevelSensorPinTag);
container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(LowerLevelSensorPinTag);
container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(LowerMidLevelSensorPinTag);
container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(UpperMidLevelSensorPinTag);
container.bind<string>(StringType).toConstantValue('Water level sensor').whenInjectedInto(DigitalWaterLevelSensor);

// Pump 
container.bind<DigitalPin>(DigitalPinType).toConstantValue(new DigitalPinMock()).whenTargetNamed(PumpOnPinTag);

container.bind<DigitalPin>(DigitalPinType).to(DigitalPinMock).whenTargetIsDefault();
container.bind<AnalogChannel>(AnalogChannelType).to(AnalogChannelMock);

export { container }