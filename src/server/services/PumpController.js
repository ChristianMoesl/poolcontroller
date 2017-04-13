export default class PumpController {
    _pump: any;

    constructor(pump, settings) {
        this._pump = pump;

        setInterval(() => {
            settings.getPumpTime();
        }, 1000);
    }
}
