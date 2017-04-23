import { inject, injectable, named } from 'inversify';
import { TemperatureSensor } from '../device/TemperatureSensor';

export const RoofTemperatureSensorTag = Symbol('RoofTemperatureSensor');
export const OtherTemperatureSensorTag = Symbol('OtherTemperatureSensor');

@injectable()
export class TemperatureController {
    constructor(
        @named(RoofTemperatureSensorTag) private roofTempSensor: TemperatureSensor,
        @named(OtherTemperatureSensorTag) private otherTempSensor: TemperatureSensor
    ) { }
}