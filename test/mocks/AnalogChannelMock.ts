import { injectable } from 'inversify';
import { Event, EventDispatcher } from '../../src/util/Event';
import { AnalogChannel } from '../../src/hardware/AnalogChannel';

@injectable()
export class AnalogChannelMock implements AnalogChannel {
    conversionCompletedEvent = new EventDispatcher<AnalogChannel, number>();

    initialize() { }
    conversionCompleted(): Event<AnalogChannel, number> { return this.conversionCompletedEvent; }
    startConversion: () => { }
}