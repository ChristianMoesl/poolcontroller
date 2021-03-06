import { injectable } from 'inversify';
import { Protocol } from '../protocol/Protocol';
import { TemperatureController } from './TemperatureController';
import { WaterLevelController } from './WaterLevelController';
import { Pump } from '../device/Pump';
import { PoolSettings } from '../services/PoolSettings';

enum State {
    Uninitialised,
    Idle,
};

const outputAddress = 32;
const intputAddresses = [56, 57];
const analogAddress = 104;

@injectable()
export class PoolController {
    private state = State.Uninitialised;
    _state: any;

    constructor(
        private protocol: Protocol/*,
        private temperatureController: TemperatureController,
        private waterLevelController: WaterLevelController*/
    ) {
   //     super();

    /*    this._roofTempSensor = new TemperatureSensor('Roof temperature sensor');
        this._waterLevelSensor = new WaterLevelSensor('Water level sensor');
        this._pump = new Pump('Water pump');

        settings.on('initialised', () => {
            this._roofTempSensor.on('change', this._onTemperatureChanged.bind(this));
            this._waterLevelSensor.on('change', this._onWaterLevelChanged.bind(this));
         //   this._pump.on('change', this._updateStatus.bind(this));
            this.state = State.Idle;
            this._updateStatus();
        });*/
    }

    isInitialised() {
        return this.state !== State.Uninitialised;
    }

    getStatus() {
        const status = { };
    /*        actors: [
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
               //     name: this._waterLevelSensor.getName(),
                    value: `${this._waterLevelSensor.getWaterLevel().toFixed(1)}%`,
                },
            ],
            settings: [],
            state: this.state,
        };*/

      /*  Object.keys(settings).forEach((key) => {
            if (key.startsWith('get')) {
                status.settings.push({ name: key.slice(3), value: settings[key]() });
            }
        });*/

        return status;
    }

    _onTemperatureChanged() {
        this._updateStatus();
    }

    _onWaterLevelChanged() {
        this._updateStatus();
    }

    _updateStatus() {
 //       this.emit('change', this.getStatus());
    }
}

