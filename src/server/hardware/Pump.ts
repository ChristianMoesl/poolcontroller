import { PowerState } from './PowerState';
import { Peripheral } from './Peripheral';
import * as assert from 'assert';

export { PowerState };

export class PumpState {
    constructor(
        public state: PowerState,
        public time: number
    ) { }
}

export interface Pump extends Peripheral<PumpState> {
    turnOn();
    turnOff();
    getPowerState(): PowerState;
    getOperatingTime(): number;
}
export const PumpType = Symbol('Pump');