import { container } from '../../src/server/Config';
import { DigitalPin, DigitalPinType } from '../../src/server/hardware/DigitalPin';
import { AnalogChannel, AnalogChannelType } from '../../src/server/hardware/AnalogChannel';
import { DigitalPinMock } from './mocks/DigitalPinMock';
import { AnalogChannelMock } from './mocks/AnalogChannelMock';

container.bind<DigitalPin>(DigitalPinType).to(DigitalPinMock);
container.bind<AnalogChannel>(AnalogChannelType).to(AnalogChannelMock);

export { container }