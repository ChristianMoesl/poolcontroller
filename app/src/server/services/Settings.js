const DBConnection = require('./DBConnection');
const assert = require('assert');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function Settings() {
    EventEmitter.call(this);

    const self = this;

    const defaultSettings = {
        pumpTime: 6 * 60 * 60,
    };

    const settings = {};

    new DBConnection((db) => {
        const col = db.collection('settings');

        col.find({}).toArray((err, items) => {
            assert.equal(null, err);

            items.forEach((elem) => {
                settings[elem._id] = elem.setting;
            });

            const toDelete = [];
            Object.keys(settings).forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(defaultSettings, key)) {
                    toDelete.push({ _id: key });
                    delete settings[key];
                }
            });

            if (toDelete.length > 0) {
                col.deleteMany({ $or: toDelete }, null, (error) => {
                    assert.equal(null, error);
                    addDefaultSettings(db, col);
                });
            } else {
                addDefaultSettings(db, col);
            }
        });
    });

    function addDefaultSettings(db, col) {
        const toAdd = [];
        Object.keys(defaultSettings).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(settings, key)) {
                toAdd.push({ _id: key, setting: defaultSettings[key] });
                settings[key] = defaultSettings[key];
            }
        });

        if (toAdd.length > 0) {
            col.insertMany(toAdd, null, (err) => {
                assert.equal(null, err);
                db.close();
                generateAccessFunctions();
            });
        } else {
            db.close();
            generateAccessFunctions();
        }
    }

    function capitalize(string) {
        return string.length > 1 ? string[0].toUpperCase() + string.substring(1) : string[0].toUpperCase();
    }

    function generateAccessFunctions() {
        Object.keys(settings).forEach((key) => {
            self[`get${capitalize(key)}`] = () => settings[key];
            self[`set${capitalize(key)}`] = (value) => {
                settings[key] = value;
                new DBConnection((db) => {
                    db.collection('settings').updateOne({ _id: key }, { _id: key, setting: value }, null, (err) => {
                        assert.equal(null, err);
                        db.close();
                    });
                });
            };
        });

        self.emit('initialised');
    }
}
util.inherits(Settings, EventEmitter);

module.exports = new Settings();
