import { SystemEvent } from '../services/SystemEvent';
import { OperationMode } from './OperationMode';

export class OperationModeChanged extends SystemEvent {
    constructor(public mode: OperationMode) {
        super();
     }
}