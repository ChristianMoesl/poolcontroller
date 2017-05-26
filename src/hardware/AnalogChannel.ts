import { Event } from '../util/Event';

export interface AnalogChannel {
    initialize();
    conversionCompleted(): Event<AnalogChannel, number>;
    startConversion();
}
export const AnalogChannelType = Symbol('AnalogChannel');