import { OperationMode } from '../system/OperationMode';

export type PoolSettingChangedHandler = () => void;

export interface PoolSettings {
    getPumpTime(): number;
    setPumpTime(v: number);
    getPumpIntervall(): number;
    setPumpIntervall(v: number);
    getTargetTemperature(): number;
    setTargetTemperature(v: number);
    getTemperatureThreshold(): number;
    setTemperatureThreshold(v: number);
    getOperationMode(): OperationMode;
    setOperationMode(v: OperationMode);
    subscribe(setting: string, f: PoolSettingChangedHandler);
}
export const PoolSettingsType = Symbol('PoolSettings');