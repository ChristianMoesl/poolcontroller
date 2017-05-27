import { inject, injectable } from 'inversify';
import { Room } from './Room';
import { Logger, LoggerType } from '../services/Logger';
import { SocketFactory, SocketFactoryType } from '../services/Socket';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';
import { unknownVersion, Version, Message, Command } from 'poolcontroller-protocol';

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

    get(version: Version, data: Object) {
        if (version.major === 1 && version.minor === 0) {
            this.sendAck({
                pumpTime: this.settings.getPumpTime(),
                pumpInterval: this.settings.getPumpIntervall(),
            });
        } else {
            this.sendNak(unknownVersion);
        }
    }
    
    post(version: Version, data: Object) {

     /*   if (data === null) {
            this.sendNak(missingParameter);
        } else {
            this.sendNak(notImplemented);
        }*/
    }
}
