import { Pump, PowerState } from '../hardware/Pump';
import { Settings } from './Settings';
import { log } from '../util/Log'; 

export class PumpController {
    private settings: any;
    private previousDay: number = this.getDay();
    private isMidnightPassed: boolean = false;

    constructor(private pump: Pump, settings: Settings) {
        this.settings = settings;
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
