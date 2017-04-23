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
    private started: number;
    private state = PowerState.off;

    constructor(@inject(StringType) name: string) {
        super(name);
    }

    public turnOn() {
        assert(this.state === PowerState.off);
        
        this.started = Date.now();
        this.changeState(PowerState.on);
    }

    public turnOff() {
        assert(this.state === PowerState.on);

        this.time += Date.now() - this.started;
        this.changeState(PowerState.off);
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
}
