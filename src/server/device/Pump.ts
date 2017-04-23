import { injectable, inject, named } from 'inversify';
import * as assert from 'assert';
import { PowerState } from './PowerState';
import { Peripheral } from './Peripheral';
import { DigitalPin, DigitalPinType } from '../hardware/DigitalPin';
import { StringType } from '../Types';

export { PowerState };

export class PumpState {
    constructor(
        public state: PowerState,
        public time: number
    ) { }
}

export const PumpOnPinTag = Symbol('PumpOnPin');

@injectable()
export class Pump extends Peripheral<PumpState> {
    private time = 0;
    private started: number;
    private state = PowerState.off;

    constructor(
        @inject(StringType) name: string,
        @inject(DigitalPinType) @named(PumpOnPinTag) private pumpOnPin: DigitalPin
    ) {
        super(name);
    }

    public turnOn() {
        assert(this.state === PowerState.off);

        this.pumpOnPin.setActive();
        this.started = Date.now();
        this.changeState(PowerState.on);
    }

    public turnOff() {
        assert(this.state === PowerState.on);

        this.pumpOnPin.setIdle();
        this.time += Date.now() - this.started;
        this.changeState(PowerState.off);
    }

    public getPowerState(): PowerState { return this.state; }
    public getOperatingTime(): number { return this.time; }

    private changeState(state: PowerState) {
        this.state = state;
        this.onChanged();
    }

    private onChanged() {
        this.changedEvent(new PumpState(this.state, this.time));
    }
}
