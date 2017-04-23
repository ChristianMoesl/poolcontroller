import { injectable, inject, named } from 'inversify';
import { StringType } from '../Types';
import { Peripheral } from './Peripheral';
import { DigitalPin, DigitalPinType, DigitalPinState } from '../hardware/DigitalPin';

export enum ValvePosition {
    idle,
    first,
    second,
}

export const ValvePos1PinTag = Symbol('ValvePos1PinTag');
export const ValvePos2PinTag = Symbol('ValvePos2Pin');

@injectable()
export class ThreeWayValve extends Peripheral<ValvePosition> {
    private _position = ValvePosition.idle;

    constructor(
        @inject(StringType) name: string,
        @inject(DigitalPinType) @named(ValvePos1PinTag) private pos1: DigitalPin,
        @inject(DigitalPinType) @named(ValvePos2PinTag) private pos2: DigitalPin
    ) { 
        super(name);
    }

    changePosition(pos: ValvePosition) {
        if (this._position !== pos) {
            this._position = pos;

            switch (pos) {
                case ValvePosition.idle:
                this.pos1.setIdle();
                this.pos2.setIdle();
                break;
                case ValvePosition.first:
                this.pos1.setActive();
                this.pos2.setIdle();
                break;
                case ValvePosition.second:
                this.pos1.setIdle();
                this.pos2.setActive();
                break;
            }

            this.invokeChanged(this._position);
        }
    }

    position(): ValvePosition { return this._position; }
}