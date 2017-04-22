import { DBConnection } from './DBConnection';
import * as assert from 'assert';
import { EventEmitter } from 'events';

export class Settings extends EventEmitter {
    private defaultSettings: any = {
        pumpTime: 6 * 60 * 60,
    };

    private settings: any = { };

    constructor() {
        super();

        new DBConnection(db => {
            const col = db.collection('settings');

            const self = this;
            col.find({}).toArray((err, items) => {
                assert.equal(null, err);

                items.forEach(elem => {
                    self.settings[elem._id] = elem.setting;
                });

                const toDelete = [];
                Object.keys(self.settings).forEach((key) => {
                    if (!Object.prototype.hasOwnProperty.call(self.defaultSettings, key)) {
                        toDelete.push({ _id: key });
                        delete self.settings[key];
                    }
                });

                if (toDelete.length > 0) {
                    col.deleteMany({ $or: toDelete }, null, (error) => {
                        assert.equal(null, error);
                        self.addDefaultSettings(db, col);
                    });
                } else {
                    self.addDefaultSettings(db, col);
                }
            });
        });
    }

    private addDefaultSettings(db, col) {
        const toAdd = [];
        Object.keys(this.defaultSettings).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(this.settings, key)) {
                toAdd.push({ _id: key, setting: this.defaultSettings[key] });
                this.settings[key] = this.defaultSettings[key];
            }
        });

        if (toAdd.length > 0) {
            col.insertMany(toAdd, null, (err) => {
                assert.equal(null, err);
                db.close();
                this.generateAccessFunctions();
            });
        } else {
            db.close();
            this.generateAccessFunctions();
        }
    }

    private capitalize(string) {
        return string.length > 1 ? string[0].toUpperCase() + string.substring(1) : string[0].toUpperCase();
    }

    private generateAccessFunctions() {
        const self = this;
        Object.keys(this.settings).forEach((key) => {
            self[`get${this.capitalize(key)}`] = () => this.settings[key];
            self[`set${this.capitalize(key)}`] = (value) => {
                self.settings[key] = value;
                new DBConnection((db) => {
                    db.collection('settings').updateOne({ _id: key }, { _id: key, setting: value }, null, (err) => {
                        assert.equal(null, err);
                        db.close();
                    });
                });
            };
        });

        super.emit('initialised');
    }
}

export const settings = new Settings();
