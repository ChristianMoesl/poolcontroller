import { injectable } from 'inversify';

import { TemperatureSensor } from './hardware/TemperatureSensor';
import { Pump } from './hardware/Pump';

import { RpiTemperatureSensor } from './raspberrypi/RpiTemperatureSensor';
import { RpiPump } from './raspberrypi/RpiPump';

import { BoardFactory } from'./hardware/BoardFactory';

@injectable()
export class RpiBoardFactory implements BoardFactory {
    private roofTempSensor = new RpiTemperatureSensor('ROOF');
    private waterPump = new RpiPump('WATER');

    public getTemperatureSensor(name: string): TemperatureSensor {
        if (name === this.roofTempSensor.name) 
            return this.roofTempSensor;
        else
            throw new Error('Unknown temperature sensor \"${name}\"');
    }

    public getPump(name: string): Pump {
        if (name === this.waterPump.name) 
            return this.waterPump;
        else
            throw new Error('Unknown pump \"${name}\"');
    }
}