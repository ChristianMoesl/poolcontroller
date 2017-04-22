import { inject, injectable } from 'inversify';
import { Room } from './Room';
import * as Error from '../../common/protocol/ProtocolError';
import { Version } from '../services/Socket';
import { Logger, LoggerType } from '../services/Logger';
import { SocketFactory, SocketFactoryType } from '../services/Socket';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';

@injectable()
export class SettingsRoom extends Room {
    constructor(
        @inject(LoggerType) logger: Logger,
        @inject(SocketFactoryType) socketFactory: SocketFactory,
        @inject(PoolSettingsType) private settings: PoolSettings
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
