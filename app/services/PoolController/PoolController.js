const EventEmitter = require('events').EventEmitter;
const util = require('util');
const TemperatureSensor = require('./hardware/TemperatureSensor');
const WaterLevelSensor = require('./hardware/WaterLevelSensor');
const Pump = require('./hardware/Pump');
const log = require('./util/Log');

function PoolController() {
    EventEmitter.call(this);

    const self = this;

    const roofTempSensor = new TemperatureSensor('Roof temperature sensor');
    roofTempSensor.on('change', onTemperatureChanged);

    const waterLevelSensor = new WaterLevelSensor('Water level sensor');
    waterLevelSensor.on('change', onWaterLevelChanged);

    const pump = new Pump('Water pump');
    pump.on('change', updateStatus);

    setInterval(tick, 500);

    this.getStatus = () => {
        return {
            actors: [
                {
                    name: pump.getName(),
                    value: pump.getState(),
                },
            ],
            sensors: [
                {
                    name: roofTempSensor.getName(),
                    value: roofTempSensor.getTemperature().toFixed(1) + '°',
                },
                {
                    name: roofTempSensor.getName(),
                    value: roofTempSensor.getTemperature().toFixed(1) + '°',
                },
                {
                    name: waterLevelSensor.getName(),
                    value: waterLevelSensor.getWaterLevel().toFixed(1) + '%',
                },
            ],
        };
    };

    function onTemperatureChanged(args) {
        updateStatus();
    }

    function onWaterLevelChanged(args) {
        updateStatus();
    }

    function updateStatus() {
        self.emit('change', self.getStatus());
    }

    function tick() { }
}
util.inherits(PoolController, EventEmitter);

module.exports = new PoolController();