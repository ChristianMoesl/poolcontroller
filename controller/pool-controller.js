const tempSensor = require('../hardware/temperature-sensor');

function PoolController() {
    this.roofTempSensor = new tempSensor();

    this.tick = function() {
    };

    setInterval(this.tick, 50);
}

module.exports = new PoolController();

