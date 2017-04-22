import { injectable, inject } from 'inversify';
import * as Services from '../Services';
import { Logger } from '../services/Logger';
import { ProtocolError } from '../../common/protocol/ProtocolError';
import { Socket, SocketFactory, Command, Version, Message } from '../services/Socket';

@injectable()
export class Room {
    private socket: Socket;

    protected constructor(
        @inject(Services.Logger) private logger: Logger,
        @inject(Services.SocketFactory) private socketFactory: SocketFactory
    ) { }

    protected initialize(roomName: string) {
        this.socket = this.socketFactory.create(roomName);
        this.socket.received.subscribe((s, e) => this.onMessageReceive(e));
    }

    public post(version: Version, data: Object) { }

    public get(version: Version, data: Object) { }

    public sendNotification(version: Version, data: Object) {
        const msg = { command: Command[Command.NOTIFICATION], version: version, data: data };
        this.logOutgoing(msg);
        this.socket.send(msg);
    }

    public sendAck(data: Object = {}) {
        const msg = { command: Command[Command.ACK], version: { major: 1, minor: 0 }, data: data };
        this.logOutgoing(msg);
        this.socket.send(msg);
    }

    public sendNak(error: ProtocolError) {
        const msg = { command: Command[Command.NAK], version: { major: 1, minor: 0 }, data: { error: error }};
        this.logOutgoing(msg);
        this.socket.send(msg);
    }

    private onMessageReceive(e: Message) {
        switch (e.command) {
            case Command[Command.POST]: 
                this.logIncoming({ command: Command[Command.POST], version: e.version, data: e.data });
                this.post(e.version, e.data);
                break;
            case Command[Command.GET]: 
                this.logIncoming({ command: Command[Command.GET], version: e.version, data: e.data });
                this.get(e.version, e.data);
                break;
            default:
                this.logger.warn(`Invalid command ${e.command} received`);
        }
    }

    private logOutgoing(msg: Message) {
        this.logger.info(`>>> ${Command[msg.command]}`);
    }

    private logIncoming(msg: Message) {
        this.logger.info(`<<< ${Command[msg.command]}`);
        this.logData(msg);
    }

    private logData(msg: Message) {
        this.logger.info(`version: ${msg.version.major}.${msg.version.minor}`);
        this.logger.info(`data:    ${msg.data}`);
    }
}
