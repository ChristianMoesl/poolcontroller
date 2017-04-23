import { Peripheral } from './Peripheral';

export interface WaterInlet extends Peripheral<{}> {
    turnOn();
    turnOff();
    getState(): boolean;
}
export const WaterInletType = Symbol('WaterInlet');