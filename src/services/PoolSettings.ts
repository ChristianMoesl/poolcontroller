import { OperationMode } from '../system/OperationMode';

export type PoolSettingChangedHandler = () => void;

export interface PoolSettings {
    getPumpTime(): number;
    setPumpTime(v: number): RangeError | null;
    getPumpIntervall(): number;
    setPumpIntervall(v: number): RangeError | null;
    getTargetTemperature(): number;
    setTargetTemperature(v: number): RangeError | null;
    getTemperatureThreshold(): number;
    setTemperatureThreshold(v: number): RangeError | null;
    getOperationMode(): OperationMode;
    setOperationMode(v: OperationMode): RangeError | null;
    subscribe(setting: string, f: PoolSettingChangedHandler);
}
export const PoolSettingsType = Symbol('PoolSettings');