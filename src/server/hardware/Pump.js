/* @flow */

import events from 'events';
import assert from 'assert';

export default class Pump extends events.EventEmitter {
    _name: string;
    _time: number;
    _intervall: number;
    _state: string;

    constructor(name: string) {
        super();
        assert(name || typeof name === 'string');

        this._name = name;
        this._time = 0;
        this._state = 'off';
    }

    turnOn() {
        assert(this._state === 'off');

        this._setState('on');
        this._intervall = setInterval(() => this._tick(), 1000);
    }

    turnOff() {
        assert(this._state === 'on');

        this._setState('off');
        clearInterval(this._intervall);
    }

    get powerState(): string { return this._state; }
    get name(): string { return this._name; }
    get operatingTime(): number { return this._time; }

    _setState(state: string) {
        this._state = state;
        this._change();
    }

    _change() {
        this.emit('change', { name: this._name, value: this._state, time: this._time });
    }

    _tick() {
        this._time += 1;
        this._change();
    }
}
