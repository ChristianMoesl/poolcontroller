import { Peripheral } from './Peripheral';

export interface TemperatureSensor extends Peripheral<number> {
    getTemperature(): number;
}
export const TemperatureSensorType = Symbol('TemperatureSensor');