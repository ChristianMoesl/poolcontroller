import { Event } from '../util/Event';
import { Peripheral } from './Peripheral';

export interface WaterLevelSensor extends Peripheral<number> {
    getWaterLevel(): number;
}
export const WaterLevelSensorType = Symbol('WaterLevelSensor');