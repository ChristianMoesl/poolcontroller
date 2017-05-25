import { Event, EventDispatcher } from '../util/Event';
import { DigitalPin, DigitalPinState } from '../hardware/DigitalPin';


export class Pcf8574Pin/* implements DigitalPin*/ {
    private changedEvent = new EventDispatcher<DigitalPin, DigitalPinState>();
    private state = DigitalPinState.idle;

    changed(): Event<DigitalPin, DigitalPinState>{
        return this.changedEvent;
    }
    getState(): DigitalPinState{
        return this.state;
    }
    setActive() {
        this.state = DigitalPinState.active;
    }
    setIdle() {
        this.state = DigitalPinState.idle;
    }
}