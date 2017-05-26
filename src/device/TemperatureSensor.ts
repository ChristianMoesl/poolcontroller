import { inject, injectable } from 'inversify';
import { StringType } from '../Types';
import * as assert from 'assert';
import { Peripheral } from './Peripheral';

@injectable()
export class TemperatureSensor extends Peripheral<number> {
    private _temperature: number;

    public constructor(@inject(StringType) name: string) {
        super(name);
        this._temperature = 25;
    }

    getTemperature(): number { return this._temperature; }

    tick() {
        this._temperature += Math.random() * 2 - 1;
        if (this._temperature > 30) {
            this._temperature = 30;
        } else if (this._temperature < 20) {
            this._temperature = 20;
        }

        this.invokeChanged(this._temperature);
    }
}
