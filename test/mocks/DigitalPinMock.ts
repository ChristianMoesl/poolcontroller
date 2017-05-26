import { injectable } from 'inversify';
import { DigitalPin, DigitalPinState } from '../../src/hardware/DigitalPin';
import { Event, EventDispatcher } from '../../src/util/Event';

@injectable()
export class DigitalPinMock implements DigitalPin {
    changedEvent = new EventDispatcher<DigitalPin, DigitalPinState>();
    state = DigitalPinState.idle;

    changed(): Event<DigitalPin, DigitalPinState> { return this.changedEvent; }
    getState(): DigitalPinState  { return this.state }
    isActive(): boolean { return this.state === DigitalPinState.active; }
    isIdle(): boolean { return this.state === DigitalPinState.idle; }
    setActive() { 
        this.state = DigitalPinState.active;
        this.changedEvent.dispatch(this, this.state);
    }

    setIdle() { 
        this.state = DigitalPinState.idle;
        this.changedEvent.dispatch(this, this.state);
    }
}