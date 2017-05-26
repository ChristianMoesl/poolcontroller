import { injectable, inject, named } from 'inversify';
import { StringType } from '../Types';
import { Peripheral } from './Peripheral';
import { DigitalPin, DigitalPinType, DigitalPinState } from '../hardware/DigitalPin';

export const WaterInletPinTag = Symbol('WaterInletPin');

@injectable()
export class WaterInlet extends Peripheral<boolean> {
    constructor(
        @inject(StringType) name: string,
        @inject(DigitalPinType) @named(WaterInletPinTag) private pin: DigitalPin
    ) { 
        super(name);
    }

    turnOn() {
        this.pin.setActive();
    }

    turnOff() {
        this.pin.setIdle();
    }
}