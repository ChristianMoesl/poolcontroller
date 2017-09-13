import { inject, injectable } from 'inversify';
import { PoolSettings, PoolSettingChangedHandler } from '../services/PoolSettings';
import { DBConnection, Db } from './DBConnection';
import { OperationMode } from 'poolcontroller-protocol';

const settingsCollection = 'settings';

@injectable()
export class DBBasedSettings implements PoolSettings {
    private pumpTime = 6 * 60;
    private pumpIntervall: number = 30;
    private targetTemperature: number = 26;
    private temperatureThreshold: number = 2;
    private operationMode = OperationMode.automatic;

    private handlers = new Map<string, Array<PoolSettingChangedHandler>>();

    constructor(
         private conn: DBConnection
    ) { 
        let dbconn: Db;
        this.conn.connect()
        .then((db: Db) => {
            dbconn = db;
            return db.collection(settingsCollection).find({}).toArray();
        })
        .then(col => {
            for (let i = 0; i < col.length; i++) {
                if (col[i].name) {
                    if (this.hasOwnProperty(col[i].name))
                        this[col[i].name] = col[i].setting;
                    else
                        throw new RangeError('No settings entry for this item');
                } else 
                    throw new Error('Database document doesn\'t match');
            }
            
            dbconn.close();
        });
    }

    getPumpTime(): number { return this.pumpTime; }
    setPumpTime(v: number): RangeError | null {
        if (v >= 0 && v < 24 * 60) {
            this.update(v, 'pumpTime');

            return null;
        }
        return RangeError(`pumpTime has to be in the range of [0 - 24 * 60[ , but was ${v}`);
    }

    getPumpIntervall(): number { return this.pumpIntervall; }
    setPumpIntervall(v: number): RangeError | null {
        if (v >= 0 && v < 24 * 60) {
            this.update(v, 'pumpIntervall');

            return null;
        }
        return RangeError(`pumpIntervall has to be in the range of [0 - 24 * 60[ , but was ${v}`);
    }

    getTargetTemperature(): number { return this.targetTemperature; }
    setTargetTemperature(v: number): RangeError | null {
        if (v >= 10 && v <= 40) {
            this.update(v, 'targetTemperature');

            return null;
        }
        return RangeError(`targetTemperature has to be in the range of [10 - 40] , but was ${v}`);
    }

    getTemperatureThreshold(): number { return this.temperatureThreshold; }
    setTemperatureThreshold(v: number): RangeError | null {
        if (1 <= v && v <= 10) {
            this.update(v, 'temperatureThreshold');

            return null;
        }
        return RangeError(`temperatureThreshold has to be in the range of [1 - 10] , but was ${v}`);
    }

    getOperationMode(): OperationMode { return this.operationMode; }
    setOperationMode(v: OperationMode): RangeError | null {
        this.update(v, 'operationMode');

        return null;
    }

    subscribe(setting: string, f: PoolSettingChangedHandler) {
        const entry = this.handlers.get(setting);

        if (entry !== undefined)
            entry.push(f);
        else if (this.hasOwnProperty(setting))
            this.handlers.set(setting, [ f ]);
        else
            throw Error(`Unknown setting ${setting}!`);
    }

    private update(v: any, name: string) {
        if (this[name] === v)
            return;

        this[name] = v;

        this.notify(name);

        let dbconn: Db;
        this.conn.connect()
        .then(db => {
            dbconn = db;
            return db.collection(settingsCollection).findOne({ name: name });
        })
        .catch(err => { throw err })
        .then(res => { dbconn.close(); });
    }

    private notify(name: string) {
        const entries = this.handlers.get(name);

        if (entries !== undefined) 
            for (const entry of entries)
                entry();
    }
}