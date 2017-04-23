import { injectable, inject, named } from 'inversify';
import { WaterInlet } from '../device/WaterInlet';
import { WaterLevelSensor } from '../device/WaterLevelSensor';

export class WaterLevelController {
    constructor(
        private inlet: WaterInlet,
        private levelSensor: WaterLevelSensor
    ) { }

    
}