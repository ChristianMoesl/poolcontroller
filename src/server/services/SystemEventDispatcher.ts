import { SystemEvent } from './SystemEvent';
import { Event } from '../util/Event';

export type SystemEventDispatcherListener = (e: SystemEvent) => void;

export class SystemEventDispatcher {
    private map = new Map<string, Array<SystemEventDispatcherListener>>();

    subscribe(eventClass: string, f: SystemEventDispatcherListener) {
        const entry = this.map.get(eventClass);

        if (entry !== undefined)
            entry.push(f);
        else
            this.map.set(eventClass, [f]);
    }

    dispatch(event: SystemEvent) {
        const entry = this.map.get(event.constructor.name);

        if (entry !== undefined)
            for (const x of entry)
                x(event);
    }
}
