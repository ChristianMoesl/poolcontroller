import { Event } from '../util/Event';

export interface WaterLevelSensor {
    getWaterLevel(): number;
}
export const WaterLevelSensorType = Symbol('WaterLevelSensor');