import { inject, injectable } from 'inversify';
import { PoolSettings } from '../services/PoolSettings';
import { DBConnection, Db } from './DBConnection';

const settingsCollection = 'settings';

@injectable()
export class DBBasedSettings implements PoolSettings {
    private pumpTime = 6 * 60;
    private pumpIntervall: number = 30;
    private targetTemperature: number = 26;
    private temperatureThreshold: number = 2;

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

    private update(v: any, name: string) {
        this[name] = v;
        let dbconn: Db;
        this.conn.connect()
        .then(db => {
            dbconn = db;
            return db.collection(settingsCollection).findOne({ name: name });
        })
        .catch(err => { throw err })
        .then(res => { dbconn.close(); });
    }
}