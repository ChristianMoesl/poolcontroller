import Room from './Room';
import { notImplemented, unknownParameter, missingParameter } from './Errors';
import settings from '../services/Settings';

export default class SettingsRoom extends Room {
    constructor() {
        super('settings');
    }

    get(data: any) {
        super.get(data);

        if (data === null) {
            this.sendNak(unknownParameter);
        } else {
            const serialized = {};
            Object.keys(settings).forEach((key) => {
                if (key.startsWith('get')) {
                    serialized[key] = settings[key]();
                }
            });

            this.sendAck(serialized);
        }
    }

    post(data: any) {
        super.post(data);

        if (data === null) {
            this.sendNak(missingParameter);
        } else {
            this.sendNak(notImplemented);
        }
    }
}
