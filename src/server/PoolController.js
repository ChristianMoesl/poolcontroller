/* @flow */

import Events from 'events';
import TemperatureSensor from './hardware/TemperatureSensor';
import WaterLevelSensor from './hardware/WaterLevelSensor';
import Pump from './hardware/Pump';
import settings from './services/Settings';

const State = Object.freeze({
    uninitialised: {},
    idle: {},
});

const outputAddress = 32;
const intputAddresses = [56, 57];
const analogAddress = 104;

class PoolController extends Events.EventEmitter {
    _state: any;
    _roofTempSensor: TemperatureSensor;
    _waterLevelSensor: WaterLevelSensor;
    _pump: Pump;

    constructor() {
        super();

        this._state = State.uninitialised;
        this._roofTempSensor = new TemperatureSensor('Roof temperature sensor');
        this._waterLevelSensor = new WaterLevelSensor('Water level sensor');
        this._pump = new Pump('Water pump');

        settings.on('initialised', () => {
            this._roofTempSensor.on('change', this._onTemperatureChanged.bind(this));
            this._waterLevelSensor.on('change', this._onWaterLevelChanged.bind(this));
            this._pump.on('change', this._updateStatus.bind(this));
            this._state = State.idle;
            this._updateStatus();
        });
    }

    isInitialised() {
        return this._state !== State.uninitialised;
    }

    getStatus() {
        const status = {
            actors: [
                {
                    name: this._pump.name,
                    value: this._pump.powerState,
                },
            ],
            sensors: [
                {
                    name: this._roofTempSensor.name,
                    value: `${this._roofTempSensor.temperature.toFixed(1)}°`,
                },
                {
                    name: this._roofTempSensor.name,
                    value: `${this._roofTempSensor.temperature.toFixed(1)}°`,
                },
                {
                    name: this._waterLevelSensor.getName(),
                    value: `${this._waterLevelSensor.getWaterLevel().toFixed(1)}%`,
                },
            ],
            settings: [],
            state: this._state,
        };

        Object.keys(settings).forEach((key) => {
            if (key.startsWith('get')) {
                status.settings.push({ name: key.slice(3), value: settings[key]() });
            }
        });

        return status;
    }

    _onTemperatureChanged() {
        this._updateStatus();
    }

    _onWaterLevelChanged() {
        this._updateStatus();
    }

    _updateStatus() {
        this.emit('change', this.getStatus());
    }
}

const poolController = new PoolController();

export default poolController;
