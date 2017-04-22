import { Peripheral } from './Peripheral';

export interface TemperatureSensor extends Peripheral<number> {
    name: string;
    temperature: number;
}
export const TemperatureSensorType = Symbol('TemperatureSensor');