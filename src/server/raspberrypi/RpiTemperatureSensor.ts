import { inject, injectable } from 'inversify';
import { StringType } from '../Types';
import * as assert from 'assert';
import { Peripheral } from '../hardware/Peripheral';
import { TemperatureSensor } from '../hardware/TemperatureSensor';

@injectable()
export class RpiTemperatureSensor extends Peripheral<number> implements TemperatureSensor {
    private _temperature: number;

    public constructor(@inject(StringType) name: string) {
        super(name);
        this._temperature = 25;
    }

    get temperature(): number { return this._temperature; }

    tick() {
        this._temperature += Math.random() * 2 - 1;
        if (this._temperature > 30) {
            this._temperature = 30;
        } else if (this._temperature < 20) {
            this._temperature = 20;
        }

        this.changedEvent(this._temperature);
    }
}
