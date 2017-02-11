const EventEmitter = require('events').EventEmitter;
const util = require('util');

function WaterLevelSensor(name) {

    EventEmitter.call(this);

    if (typeof name !== 'string')
        throw Error('Please specify a name!');

    let waterLevel = 50;
    const self = this;

    setInterval(tick, 500);

    this.getName = () => name;
    this.getWaterLevel = () => waterLevel;

    function setWaterLevel(value) {
        waterLevel = value;
        self.emit('change', {waterLevel: waterLevel});
    }

    function tick() {
        let newWaterLevel = waterLevel + Math.random() * 2 - 1;

        if (waterLevel > 100) {
            waterLevel = 100;
        } else if (waterLevel < 0) {
            waterLevel = 0;
        }

        setWaterLevel(newWaterLevel);
    }
}

util.inherits(WaterLevelSensor, EventEmitter);

module.exports = WaterLevelSensor;