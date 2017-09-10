import { inject, injectable } from 'inversify';
import { Room } from './Room';
import { Logger, LoggerType } from '../services/Logger';
import { SocketFactory, SocketFactoryType } from '../services/Socket';
import { PoolSettings, PoolSettingsType } from '../services/PoolSettings';
import { OperationMode } from '../system/OperationMode';
import { unknownVersion, missingParameter, outOfRange, Version, Message, Command } from 'poolcontroller-protocol';

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
        if (version.major === 1 && version.minor === 0)
            this.sendAck({
                pumpTime: this.settings.getPumpTime(),
                pumpIntervall: this.settings.getPumpIntervall(),
                targetTemperature: this.settings.getTargetTemperature(),
                temperatureThreshold: this.settings.getTemperatureThreshold(),
                operationMode: OperationMode[this.settings.getOperationMode()],
            });
        else
            this.sendNak(unknownVersion);
    }
    
    post(version: Version, data: any) {
        let err = null;

        if (version.major === 1 && version.minor === 0) {
            if (data === null)
                this.sendNak(missingParameter);
            else if (data.hasOwnProperty('pumpTime') && typeof(data.pumpTime) === 'number')
                err = this.settings.setPumpTime(data.pumpTime);
            else if (data.hasOwnProperty('pumpIntervall') && typeof(data.pumpIntervall) === 'number')
                err = this.settings.setPumpIntervall(data.pumpIntervall);
            else if (data.hasOwnProperty('operationMode') && typeof(data.operationMode) === 'string') {
                if (data.operationMode === OperationMode[OperationMode.automatic])
                    err = this.settings.setOperationMode(OperationMode.automatic);
                else if (data.operationMode === OperationMode[OperationMode.manual])
                    err = this.settings.setOperationMode(OperationMode.manual);
                else
                    err = RangeError(`operationMode has to be 'automatic' or 'manual', but was ${data.operationMode}`);
            } else if (data.hasOwnProperty('targetTemperature') && typeof(data.targetTemperature) === 'number')
                err = this.settings.setTargetTemperature(data.targetTemperature);
            else if (data.hasOwnProperty('temperatureThreshold') && typeof(data.temperatureThreshold) === 'number')
                err = this.settings.setTemperatureThreshold(data.temperatureThreshold);
            else {
                this.sendNak(missingParameter);
                return;
            }
        } else {
            this.sendNak(unknownVersion);
            return;
        }

        if (err === null)
            this.sendAck();
        else
            this.sendNak(outOfRange, err.message);
    }
}
