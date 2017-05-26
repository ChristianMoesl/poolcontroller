import { injectable } from 'inversify';
import { SettingsRoom } from './SettingsRoom';

@injectable()
export class Protocol {
    constructor(private settings: SettingsRoom) { }
}