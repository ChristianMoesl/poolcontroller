import { injectable } from 'inversify';
import { DigitalPin, DigitalPinState } from '../../../src/server/hardware/DigitalPin';
import { Event, EventDispatcher } from '../../../src/server/util/Event';

@injectable()
export class DigitalPinMock implements DigitalPin {
    changedEvent = new EventDispatcher<DigitalPin, DigitalPinState>();
    state = DigitalPinState.idle;

    changed(): Event<DigitalPin, DigitalPinState> { return this.changedEvent; }
    getState(): DigitalPinState  { return this.state }
    setActive() { this.state = DigitalPinState.active }
    setIdle() { this.state = DigitalPinState.idle }
}