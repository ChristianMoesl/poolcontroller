import { Pump } from '../hardware/Pump';
import { Settings } from './Settings';

const State = Object.freeze({
    idle: {},
    active: {},
});

export default class PumpController {
    _pump: Pump;
    _state: any;
    _settings: any;

    constructor(pump: Pump, settings: Settings) {
        this._pump = pump;
        this._settings = settings;
        this._state = State.idle;

        setInterval(() => this._tick(), 1000);
    }

    _tick() {
        const untilMidnight = this._getSecondsUntilMidnight();

        if (this._state === State.idle) {
            if (this._settings.getPumpTime() >= untilMidnight) {
                this._state = State.active;
                this._pump.turnOn();
            }
        } else if (this._state === State.active) {

        } else {
            throw Error('Unknown state');
        }
    }

    _getSecondsUntilMidnight() {
        const until = new Date(Date.now());
        until.setHours(23, 59, 59, 999);
        const tmp = until.getTime();
        const now = Date.now();

        return now < tmp ? (tmp - now) / 1000 : 0;
    }

}
