import { inject, injectable, named } from 'inversify';
import { TemperatureSensor } from '../device/TemperatureSensor';
import { ThreeWayValve, ValvePosition } from '../device/ThreeWayValve';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';

export const RoofTemperatureSensorTag = Symbol('RoofTemperatureSensor');
export const PoolTemperatureSensorTag = Symbol('OtherTemperatureSensor');

enum State {
    idle,
    requestingHeatUp,
    heatingUp,
    requestingCoolDown,
    coolingDown,
}

const heatPosition = ValvePosition.first;
const coolPosition = ValvePosition.second;

enum Command {
    start,
    reset,
}

@injectable()
export class TemperatureController {
    private state = State.idle;

    constructor(
        @named(RoofTemperatureSensorTag) private roofTempSensor: TemperatureSensor,
        @named(PoolTemperatureSensorTag) private poolTempSensor: TemperatureSensor,
        private valve: ThreeWayValve,
        @inject(PoolSettingsType) private settings: PoolSettings
    ) { 
        this.roofTempSensor.changed().subscribe((s, e) => this.process());
        this.poolTempSensor.changed().subscribe((s, e) => this.process());
    }

    isRequiredToPump(): boolean { return this.state !== State.idle; }

    start() {
        this.process(Command.start);
    }

    reset() {
        this.process(Command.reset);
    }

    private process(cmd?: Command) {
        switch (this.state) {
            case State.idle:
            if (this.poolTempSensor.getTemperature() <= this.roofTempSensor.getTemperature()) {
                if (this.roofTempSensor.getTemperature() + this.settings.getTemperatureThreshold() >= this.poolTempSensor.getTemperature()
                && this.poolTempSensor.getTemperature() < this.settings.getTargetTemperature()) {
                    this.state = State.requestingHeatUp;
                } 
            } else {
                if (this.roofTempSensor.getTemperature() + this.settings.getTemperatureThreshold() <= this.poolTempSensor.getTemperature()
                && this.poolTempSensor.getTemperature() > this.settings.getTargetTemperature()) {
                    this.state = State.requestingCoolDown;
                }
            }
            break;
            case State.requestingHeatUp:
            if (cmd !== undefined) {
                if (cmd === Command.start) {
                    this.state = State.heatingUp;
                    this.valve.changePosition(heatPosition);
                } else {
                    this.state = State.idle;
                }
            }
            break;
            case State.heatingUp:
            if ((cmd !== undefined && cmd === Command.reset)
            || (this.poolTempSensor.getTemperature() >= this.settings.getTargetTemperature())) {
                this.valve.changePosition(ValvePosition.idle);
                this.state = State.idle;
            }
            break;
            case State.requestingCoolDown:
            if (cmd !== undefined) {
                if (cmd === Command.start) {
                    this.state = State.coolingDown;
                    this.valve.changePosition(coolPosition);
                } else {
                    this.state = State.idle;
                }
            }
            break;
            case State.coolingDown:
            if ((cmd !== undefined && cmd === Command.reset)
            || (this.poolTempSensor.getTemperature() <= this.settings.getTargetTemperature())) {
                this.valve.changePosition(ValvePosition.idle);
                this.state = State.idle;
            }
            break;
        }
    }
}