import { inject, injectable } from 'inversify';
import { Pump, PowerState } from '../device/Pump';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';
import { Logger } from '../services/Logger';
import { WaterLevelController } from './WaterLevelController';
import { TemperatureController } from './TemperatureController';

enum State {
    idle,
    temperature,
    filtering,
    waterLevel,
}

@injectable()
export class PumpController {
    private previousDay: number = this.getDay();
    private isMidnightPassed: boolean = false;
    private state = State.idle;

    public constructor(
        private pump: Pump, 
        @inject(PoolSettingsType) private settings: PoolSettings,
        private waterLevelController: WaterLevelController,
        private temperatureController: TemperatureController
    ) {
        setInterval(() => this.tick(), 1000 * 60);
    }

    private tick(): void {
        const day = this.getDay();

        if (this.previousDay !== day) 
            this.isMidnightPassed = true;

        this.previousDay = day;

        if (!this.waterLevelController.isAllowedToPump())
            this.temperatureController.reset();

        switch (this.state) {
            case State.idle:
            if (this.waterLevelController.isAllowedToPump()) {
                if (this.waterLevelController.isRequiredToPump()) {
                    this.pump.turnOn();
                    this.state = State.waterLevel;

                } else if (this.temperatureController.isRequiredToPump()) {
                    this.pump.turnOn();
                    this.state = State.temperature;

                } else if (this.settings.getPumpTime() >= this.getMinutesUntilMidnight()) {
                    this.pump.turnOn();
                    this.state = State.filtering;
                }
            }
            break;
            case State.waterLevel:
            if (!this.waterLevelController.isRequiredToPump()
            || !this.waterLevelController.isAllowedToPump()) {
                this.pump.turnOff();
                this.state = State.idle;
            }
            break;
            case State.temperature:
            if (!this.temperatureController.isRequiredToPump()
            || !this.waterLevelController.isAllowedToPump()) {
                this.pump.turnOff();
                this.state = State.idle;
            }
            break;
            case State.filtering:
            if (this.isMidnightPassed
            || !this.waterLevelController.isAllowedToPump()) {
                this.pump.turnOff();
                this.state = State.idle;
            }
            break;
        }

        this.isMidnightPassed = false;
    }

    private getDay(): number {
        return new Date(Date.now()).getDay();
    }

    private getMinutesUntilMidnight(): number {
        const until = new Date(Date.now());
        until.setHours(23, 59, 59, 999);
        const tmp = until.getTime();
        const now = Date.now();

        return now < tmp ? (tmp - now) / 1000 / 60 : 0;
    }

}
