import { inject, injectable } from 'inversify';
import { PoolSettings, PoolSettingChangedHandler } from '../services/PoolSettings';
import { DBConnection, Db } from './DBConnection';
import { OperationMode } from '../system/OperationMode';

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
    setPumpTime(v: number) { this.update(v, 'pumpTime'); }

    getPumpIntervall(): number { return this.pumpIntervall; }
    setPumpIntervall(v: number) { this.update(v, 'pumpIntervall')}

    getTargetTemperature(): number { return this.targetTemperature; }
    setTargetTemperature(v: number) { this.update(v, 'targetTemperature'); }

    getTemperatureThreshold(): number { return this.temperatureThreshold; }
    setTemperatureThreshold(v: number) { this.update(v, 'temperatureThreshold'); }

    getOperationMode(): OperationMode { return this.operationMode; }
    setOperationMode(v: OperationMode) { this.update(v, 'operationMode'); }

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