import { inject, injectable } from 'inversify';
import * as Services from '../Services';
import { Logger } from '../services/Logger';
import { SocketFactory } from '../services/Socket';
import { Room } from './Room';
import * as Error from '../../common/protocol/ProtocolError';
import { settings } from '../services/Settings';
import { Version } from '../services/Socket';

@injectable()
export class SettingsRoom extends Room {
    constructor(
        @inject(Services.Logger) logger: Logger,
        @inject(Services.SocketFactory) socketFactory: SocketFactory
    ) {
        super(logger, socketFactory);
        this.initialize('settings');
    }

    public get(version: Version, data: Object) {

     /*   if (data === null) {
            this.sendNak(unknownParameter);
        } else {
            const serialized = {};
            Object.keys(settings).forEach((key) => {
                if (key.startsWith('get')) {
                    serialized[key] = settings[key]();
                }
            });

            this.sendAck(serialized);
        }*/
    }
    public post(version: Version, data: Object) {

     /*   if (data === null) {
            this.sendNak(missingParameter);
        } else {
            this.sendNak(notImplemented);
        }*/
    }
}
