import { injectable, inject, named } from 'inversify';
import { StringType } from '../Types';
import { DigitalPin, DigitalPinType, DigitalPinState } from '../hardware/DigitalPin';
import { Event, EventDispatcher } from '../util/Event';
import { Peripheral, PeripheralError, PeripheralErrorLevel } from './Peripheral';
import { WaterLevelSensor } from './WaterLevelSensor';

export const UpperLevelSensorPinTag = Symbol('UpperLevelSensorPin');
export const UpperMidLevelSensorPinTag = Symbol('UpperMidLevelSensorPin');
export const LowerMidLevelSensorPinTag = Symbol('LowerMidLevelSensorPin');
export const LowerLevelSensorPinTag = Symbol('LowerLevelSensorPin');

export class DigitalWaterLevelSensor extends Peripheral<number> implements WaterLevelSensor {
    private level = 100;

    constructor(
        @inject(StringType) name: string,
        @inject(DigitalPinType) @named(UpperLevelSensorPinTag) private upper: DigitalPin,
        @inject(DigitalPinType) @named(UpperMidLevelSensorPinTag) private upperMid: DigitalPin,
        @inject(DigitalPinType) @named(LowerMidLevelSensorPinTag) private lowerMid: DigitalPin,
        @inject(DigitalPinType) @named(LowerLevelSensorPinTag) private lower: DigitalPin) {
        super(name);

        this.checkHardware();

        this.upper.changed().subscribe(() => this.onChanged());
        this.upperMid.changed().subscribe(() => this.onChanged());
        this.lowerMid.changed().subscribe(() => this.onChanged());
        this.lower.changed().subscribe(() => this.onChanged());
    }

    getWaterLevel(): number {
        return this.level;
    }

    private onChanged() {
        this.checkHardware();
        this.level = this.calculateLevel();
        this.invokeChanged(this.level);
    }

    private checkHardware() {
        const ok = (this.upper.isActive() && this.upperMid.isActive() && this.lowerMid.isActive() && this.lower.isActive())
                || (this.upperMid.isActive() && this.lowerMid.isActive() && this.lower.isActive())
                || (this.lowerMid.isActive() && this.lower.isActive());

        if (ok) {
            this.resetError();
        } else {
            const upper = this.upper.getState();
            const upperMid = this.upperMid.getState();
            const lowerMid = this.lowerMid.getState();
            const lower = this.lower.getState();

            this.setError(new PeripheralError(this.name(), 
            `Inconsistency in water level sensor hardware detected:
             Upper     sensor: ${PeripheralErrorLevel[upper]}
             Upper-Mid sensor: ${PeripheralErrorLevel[upperMid]}
             Lower-Mid sensor: ${PeripheralErrorLevel[lowerMid]}
             Lower     sensor: ${PeripheralErrorLevel[lower]}
            `, PeripheralErrorLevel.fatal));
        }
    }

    private calculateLevel(): number {
        if (this.upper.isActive()) 
            return 90;
        else if (this.upperMid.isActive()) 
            return 70;
        else if (this.lowerMid.isActive()) 
            return 30;
        else if (this.lower.isActive())
            return 10;
        else 
            return 0;
    }
}