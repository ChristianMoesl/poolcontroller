import { injectable, inject } from 'inversify';
import * as assert from 'assert';
import { PowerState } from '../hardware/PowerState';
import { Peripheral } from '../hardware/Peripheral';
import { Pump, PumpState } from '../hardware/Pump';
import { StringType } from '../Types';

export { PowerState };

@injectable()
export class RpiPump extends Peripheral<PumpState> implements Pump {
    private time = 0;
    private intervall: any;
    private state = PowerState.off;

    constructor(@inject(StringType) name: string) {
        super(name);
    }

    public turnOn() {
        assert(this.state === PowerState.off);

        this.changeState(PowerState.on);
        this.intervall = setInterval(() => this.tick(), 1000);
    }

    public turnOff() {
        assert(this.state === PowerState.on);

        this.changeState(PowerState.off);
        clearInterval(this.intervall);
    }

    get powerState(): PowerState { return this.state; }
    get operatingTime(): number { return this.time; }

    private changeState(state: PowerState) {
        this.state = state;
        this.onChanged();
    }

    private onChanged() {
        this.changedEvent(new PumpState(this.state, this.time));
    }

    private tick() {
        this.time += 1;
        this.onChanged();
    }
}
