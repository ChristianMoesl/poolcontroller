import { inject, injectable } from 'inversify';
import { Pump, PumpType, PowerState } from '../hardware/Pump';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';
import { Logger } from '../services/Logger';

@injectable()
export class PumpController {
    private previousDay: number = this.getDay();
    private isMidnightPassed: boolean = false;

    public constructor(
        @inject(PumpType) private pump: Pump, 
        @inject(PoolSettingsType) private settings: PoolSettings
    ) {
        setInterval(() => this.tick(), 1000);
    }

    private tick(): void {
        const day = this.getDay();

        if (this.previousDay !== day) 
            this.isMidnightPassed = true;

        this.previousDay = day;

        if (this.pump.powerState === PowerState.off) {
            if (this.settings.getPumpTime() >= this.getSecondsUntilMidnight()) {
                this.pump.turnOn();
            }
        } else {
            if (this.isMidnightPassed) {
                this.isMidnightPassed = false;
                this.pump.turnOff();
            }
        }
    }

    private getDay(): number {
        return new Date(Date.now()).getDay();
    }

    private getSecondsUntilMidnight(): number {
        const until = new Date(Date.now());
        until.setHours(23, 59, 59, 999);
        const tmp = until.getTime();
        const now = Date.now();

        return now < tmp ? (tmp - now) / 1000 : 0;
    }

}
