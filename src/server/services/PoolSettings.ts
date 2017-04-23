export interface PoolSettings {
    getPumpTime(): number;
    setPumpTime(v: number);
    getTargetTemperature(): number;
    setTargetTemperature(v: number);
    getTemperatureThreshold(): number;
    setTemperatureThreshold(v: number);
}
export const PoolSettingsType = Symbol('PoolSettings');