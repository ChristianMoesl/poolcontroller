import { EventEmitter } from 'events';

export class WaterLevelSensor extends EventEmitter {
    private waterLevel = 50;
    
    constructor(private name: string) {
        super();

        setInterval(() => this.tick(), 500);
    }

    getName() {
        return this.name;
    }

    getWaterLevel() {
        return this.waterLevel;
    }
    

    setWaterLevel(value) {
        this.waterLevel = value;
        super.emit('change', { waterLevel: this.waterLevel });
    }

    private tick() {
        const newWaterLevel = this.waterLevel + Math.random() * 2 - 1;

        if (this.waterLevel > 100) {
            this.waterLevel = 100;
        } else if (this.waterLevel < 0) {
            this.waterLevel = 0;
        }

        this.setWaterLevel(newWaterLevel);
    }
}
