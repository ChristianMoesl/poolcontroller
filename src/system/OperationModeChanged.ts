import { SystemEvent } from '../services/SystemEvent';
import { OperationMode } from 'poolcontroller-protocol';

export class OperationModeChanged extends SystemEvent {
    constructor(public mode: OperationMode) {
        super();
     }
}