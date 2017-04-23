import { injectable, inject, named } from 'inversify';
import { WaterInlet } from '../device/WaterInlet';
import { WaterLevelSensor, WaterLevelSensorType } from '../device/WaterLevelSensor';

enum State {
    idle,
    filling,
    pump,
}

@injectable()
export class WaterLevelController {
    public static lowerInletThreshold = 10;
    public static upperInletThreshold = 30;
    public static lowerPumpThreshold = 70;
    public static upperPumpThreshold = 90;

    private state: State = State.idle;

    constructor(
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

    private onLevelChanged(level: number) {
        switch (this.state) {
            case State.idle:
            if (level <= WaterLevelController.lowerInletThreshold) {
                this.state = State.filling;
                this.inlet.turnOn();
            } else if (level >= WaterLevelController.upperPumpThreshold) {
                this.state = State.pump;
            }
            break;
            case State.filling:
            if (level >= WaterLevelController.upperInletThreshold) {
                this.state = State.idle;
                this.inlet.turnOff();
            }
            break;
            case State.pump:
            if (level < WaterLevelController.lowerPumpThreshold) {
                this.state = State.idle;
            }
            break;
        }
    }
}