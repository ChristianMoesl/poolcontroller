import { inject, injectable, named } from 'inversify';
import { TemperatureSensor } from '../device/TemperatureSensor';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';

export const RoofTemperatureSensorTag = Symbol('RoofTemperatureSensor');
export const OtherTemperatureSensorTag = Symbol('OtherTemperatureSensor');

@injectable()
export class TemperatureController {
    private roof: number;
    private other: number;

    constructor(
        @named(RoofTemperatureSensorTag) private roofTempSensor: TemperatureSensor,
        @named(OtherTemperatureSensorTag) private otherTempSensor: TemperatureSensor,
        @inject(PoolSettingsType) private settings: PoolSettings
    ) { 

    }

    private onTemperatureChanged() {

    }
}