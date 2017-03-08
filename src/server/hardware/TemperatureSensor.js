/* @flow */

import events from 'events';
import assert from 'assert';

export default class TemperatureSensor extends events.EventEmitter {
    _name: string;
    _temperature: number;

    constructor(name: string) {
        super();
        assert(name && typeof name === 'string');

        this._name = name;
        this._temperature = 25;
    }

    get name(): string { return this._name; }
    get temperature(): number { return this._temperature; }

    _tick() {
        this._temperature += Math.random() * 2 - 1;
        if (this._temperature > 30) {
            this._temperature = 30;
        } else if (this._temperature < 20) {
            this._temperature = 20;
        }
        this.emit('changed', { name: this._name, temperature: this._temperature });
    }
}
