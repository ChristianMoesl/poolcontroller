import { inject, injectable } from 'inversify';
import { PoolSettings } from '../services/PoolSettings';
import { DBConnection } from './DBConnection';

@injectable()
export class DBBasedSettings implements PoolSettings {
    private pumpTime: number = 1;

    constructor(
         private db: DBConnection
    ) { }

    getPumpTime(): number {
        return this.pumpTime;
    }

    setPumpTime(v: number): void {
        this.pumpTime = v;
    }
}