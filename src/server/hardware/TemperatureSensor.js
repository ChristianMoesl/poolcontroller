const EventEmitter = require('events').EventEmitter;
const util = require('util');

function TemperatureSensor(name) {
    // constructor
    EventEmitter.call(this);

    if (typeof name !== 'string') {
        throw Error('You have to specify a name for the temperature sensor!');
    }

    let temperature = 25;

    const self = this;
    setInterval(tick, 500);

    this.getName = () => name;
    this.getTemperature = () => temperature;

    function tick() {
        temperature += Math.random() * 2 - 1;
        if (temperature > 30) {
            temperature = 30;
        } else if (temperature < 20) {
            temperature = 20;
        }
        self.emit('changed', { name, temperature });
    }
}
util.inherits(TemperatureSensor, EventEmitter);

module.exports = TemperatureSensor;
