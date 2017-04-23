import { injectable, inject, named } from 'inversify';
import { WaterInlet } from '../device/WaterInlet';
import { WaterLevelSensor, WaterLevelSensorType } from '../device/WaterLevelSensor';

@injectable()
export class WaterLevelController {
    private isFillingUp = false;
    private static lowerThreshold = 25;
    private static upperThreshold = 50;

    constructor(
        private inlet: WaterInlet,
        @inject(WaterLevelSensorType) private levelSensor: WaterLevelSensor
    ) { 
        this.levelSensor.changed().subscribe((s, e) => this.onLevelChanged(e));
    }

    private onLevelChanged(level: number) {
        if (this.isFillingUp) {
            if (level >= WaterLevelController.upperThreshold) {
                this.isFillingUp = false;
                this.inlet.turnOff();
            }
        } else {
            if (level <= WaterLevelController.lowerThreshold) {
                this.isFillingUp = true;
                this.inlet.turnOn();
            }
        }
    }
}