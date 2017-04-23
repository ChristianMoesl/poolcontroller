import { inject, injectable } from 'inversify';
import { PoolSettings } from '../services/PoolSettings';
import { DBConnection } from './DBConnection';

@injectable()
export class DBBasedSettings implements PoolSettings {
    private pumpTime: number = 6 * 60;
    private targetTemperature: number = 26;
    private temperatureThreshold: number = 2;

    constructor(
         private db: DBConnection
    ) { }

    getPumpTime(): number { return this.pumpTime; }
    setPumpTime(v: number): void {
        this.pumpTime = v;
    }

    getTargetTemperature(): number { return this.targetTemperature; }
    setTargetTemperature(v: number) {
        this.targetTemperature = v;
    }

    getTemperatureThreshold(): number { return this.temperatureThreshold; }
    setTemperatureThreshold(v: number) {
        this.temperatureThreshold = v;
    }
}