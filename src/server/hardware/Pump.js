import { EventEmitter } from 'events';

const util = require('util');

function Pump(name) {
    EventEmitter.call(this);

    const self = this;
    const off = 'off';
    const on = 'on';
    let state = off;
    let time = 0;

    setInterval(tick, 1000);

    this.turnOn = () => setState(on);
    this.turnOff = () => setState(off);
    this.getState = () => state;
    this.getName = () => name;
    this.getTime = () => time;

    function change() {
        self.emit('change', { name, value: state, time });
    }

    function setState(newState) {
        state = newState;
        change();
    }

    function tick() {
        if (state === on) {
            time += 1;
            change();
        }
    }
}
util.inherits(Pump, EventEmitter);

module.exports = Pump;
