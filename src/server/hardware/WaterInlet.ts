function WaterInlet() {
    let isOn = true;

    this.turnOn = () => { isOn = true; };
    this.turnOff = () => { isOn = false; };
    this.getState = () => isOn;
}

module.exports = WaterInlet;
