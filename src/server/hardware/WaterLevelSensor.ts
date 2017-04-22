import { Peripheral } from './Peripheral';

export interface WaterLevelSensor extends Peripheral<{}> {
    getWaterLevel(): number;
}
export const WaterLevelSensorType = Symbol('WaterLevelSensor');