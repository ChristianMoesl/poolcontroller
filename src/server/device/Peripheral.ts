import { injectable } from 'inversify';
import { Event, EventDispatcher } from '../util/Event';

export enum PeripheralErrorLevel {
    fatal,
    warn,
}

export class PeripheralError {
    constructor(
        private peripheralName: string,
        private errorMessage: string,
        private errorLevel: PeripheralErrorLevel
    ) { }

    getPeripheralName(): string { return this.peripheralName; }
    getMessage(): string { return this.errorMessage; }
    getLevel(): PeripheralErrorLevel { return this.errorLevel; }
}

@injectable()
export class Peripheral<TState> {
    private _changedEvent = new EventDispatcher<Peripheral<TState>, TState>();
    private _errorOccuredEvent = new EventDispatcher<Peripheral<TState>, PeripheralError>();
    private _name: string;
    private _error: PeripheralError;

    constructor(name: string) {
        this._name = name;
    }

    errorOccured(): Event<Peripheral<TState>, PeripheralError> { return this._errorOccuredEvent; }
    changed(): Event<Peripheral<TState>, TState> { return this._changedEvent; }
    name(): string { return this._name; }
    error(): PeripheralError { return this._error; }
    isInErrorState(): boolean { return this._error !== null; }

    protected invokeChanged(state: TState) {
        this._changedEvent.dispatch(this, state);
    }

    protected resetError() {
        this._error = null;
    }

    protected setError(error: PeripheralError) {
        this._error = error;
        this.invokeErrorOccured();
    }

    private invokeErrorOccured() {
        this._errorOccuredEvent.dispatch(this, this._error);
    }
}