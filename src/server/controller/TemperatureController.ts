import { inject, injectable, named } from 'inversify';
import { TemperatureSensor, TemperatureSensorType } from '../hardware/TemperatureSensor';

export const RoofTemperatureSensorTag = Symbol('RoofTemperatureSensor');
export const OtherTemperatureSensorTag = Symbol('OtherTemperatureSensor');

@injectable()
export class TemperatureController {
    constructor(
        @inject(TemperatureSensorType) @named(RoofTemperatureSensorTag) private roofTempSensor: TemperatureSensor,
        @inject(TemperatureSensorType) @named(OtherTemperatureSensorTag) private otherTempSensor: TemperatureSensor
    ) { }
}