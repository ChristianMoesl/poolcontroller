import { Event } from '../util/Event';

export enum DigitalPinState {
    active,
    idle,
}

export interface DigitalPin {
    changed(): Event<DigitalPin, DigitalPinState>;
    getState(): DigitalPinState;
    setActive();
    setIdle();
}
export const DigitalPinType = Symbol('DigitalPin');