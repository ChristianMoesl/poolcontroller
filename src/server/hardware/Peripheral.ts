import { injectable } from 'inversify';
import { Event, EventDispatcher } from '../util/Event';

@injectable()
export class Peripheral<TState> {
    private _changedEvent = new EventDispatcher();
    private _name: string;

    constructor(name: string) {
        this._name = name;
    }

    get changed(): Event<Peripheral<TState>, TState> {
        return this._changedEvent;
    }

    get name(): string {
        return this._name;
    }

    protected changedEvent(state: TState) {
        this._changedEvent.dispatch(this, state);
    }
}