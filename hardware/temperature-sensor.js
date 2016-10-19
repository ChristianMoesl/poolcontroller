module.exports = function() {

    this.temperatureChanged = [];

    this.getTemperature = function() {
        return temperature;
    };

    var temperature = 0;
    const updateIntervallMs = 500;
    const that = this;

    function tick() {
        temperature++;
        that.temperatureChanged.forEach(function(item) {
            item(temperature);
        });
    };

    setInterval(tick, updateIntervallMs);
};