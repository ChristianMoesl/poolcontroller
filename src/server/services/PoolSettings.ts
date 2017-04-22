export interface PoolSettings {
    getPumpTime(): number;
    setPumpTime(v: number);
}
export const PoolSettingsType = Symbol('PoolSettings');