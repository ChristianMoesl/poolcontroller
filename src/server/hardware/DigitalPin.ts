import { Event } from '../util/Event';

export enum DigitalPinState {
    active,
    idle,
}

export interface DigitalPin {
    changed(): Event<DigitalPin, DigitalPinState>;
    isActive(): boolean;
    isIdle(): boolean;
    getState(): DigitalPinState;
    setActive();
    setIdle();
}
export const DigitalPinType = Symbol('DigitalPin');