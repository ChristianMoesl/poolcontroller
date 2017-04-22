import { TemperatureSensor } from './TemperatureSensor';
import { Pump } from './Pump';

export interface BoardFactory {
    getTemperatureSensor(name: string): TemperatureSensor;
    getPump(name: string): Pump;
}
export const BoardFactoryType = Symbol('BoardFactory');