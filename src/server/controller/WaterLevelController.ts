import * as assert from 'assert';
import { injectable, inject, named } from 'inversify';
import { WaterInlet } from '../device/WaterInlet';
import { WaterLevelSensor, WaterLevelSensorType } from '../device/WaterLevelSensor';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';

enum State {
    idle,
    filling,
    pump,
}

@injectable()
export class WaterLevelController {
    public static lowerInletThreshold = 10;
    public static upperInletThreshold = 30;
    public static upperPumpThreshold = 90;

    private state: State = State.idle;
    private ticker: any = null;
    private pumpTime: number = 0;

    constructor(
        @inject(PoolSettingsType) private settings: PoolSettings,
        private inlet: WaterInlet,
        @inject(WaterLevelSensorType) private levelSensor: WaterLevelSensor
    ) { 
        this.levelSensor.changed().subscribe((s, e) => this.onLevelChanged(e));
    }

    isAllowedToPump(): boolean {
        return this.levelSensor.getWaterLevel() >= WaterLevelController.lowerInletThreshold;
    }

    isRequiredToPump(): boolean {
        return this.state === State.pump;
    }

    private tick() {
        assert(this.state === State.pump);

        this.pumpTime++;

        if (this.pumpTime >= this.settings.getPumpIntervall()) {
            clearInterval(this.ticker);
            this.ticker = null;
            this.state = State.idle;
        }        
    }

    private onLevelChanged(level: number) {
        switch (this.state) {
            case State.idle:
            if (level <= WaterLevelController.lowerInletThreshold) {
                this.state = State.filling;
                this.inlet.turnOn();
            } else if (level >= WaterLevelController.upperPumpThreshold) {
                this.state = State.pump;
                this.pumpTime = 0;
                this.ticker = setInterval(() => this.tick(), 60 * 1000);
            }
            break;
            case State.filling:
            if (level >= WaterLevelController.upperInletThreshold) {
                this.state = State.idle;
                this.inlet.turnOff();
            }
            break;
            case State.pump:
            if (level <= WaterLevelController.lowerInletThreshold) {
                clearInterval(this.ticker);
                this.ticker = null;
                this.state = State.filling;
                this.inlet.turnOn();
            }
            break;
        }
    }
}