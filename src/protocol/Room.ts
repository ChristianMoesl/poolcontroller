import { injectable, inject } from 'inversify';
import { Logger, LoggerType } from '../services/Logger';
import { ProtocolError, Message, Command, Version } from 'poolcontroller-protocol';
import { Socket, SocketFactory, SocketFactoryType, } from '../services/Socket';

@injectable()
export class Room {
    private socket: Socket;
    private roomName: string;

    protected constructor(
        @inject(LoggerType) private logger: Logger,
        @inject(SocketFactoryType) private socketFactory: SocketFactory
    ) { }

    protected initialize(roomName: string) {
        this.roomName = roomName;
        this.socket = this.socketFactory.create(`/${roomName}`);
        this.socket.received.subscribe((s, e) => {
            try {
                this.onMessageReceive(Message.deserialize(e));
            } catch (e) {
                this.logger.warn(e);
            }
        });
    }

    public post(version: Version, data: Object) { }

    public get(version: Version, data: Object) { }

    public sendNotification(version: Version, data: Object) {
        const msg = new Message(Command.NOTIFICATION, this.roomName, version, data);
        this.logOutgoing(msg);
        this.socket.send(msg.serialize());
    }

    public sendAck(data: Object = {}) {
        const msg = new Message(Command.ACK, this.roomName, new Version(1, 0), data);
        this.logOutgoing(msg);
        this.socket.send(msg.serialize());
    }

    public sendNak(error: ProtocolError, description?: string) {
        let msg;

        if (description)
            msg = new Message(Command.NAK, this.roomName, new Version(1, 0), { error: error, description: description });
        else
            msg = new Message(Command.NAK, this.roomName, new Version(1, 0), { error: error });

        this.logOutgoing(msg);
        this.socket.send(msg.serialize());
    }

    private onMessageReceive(e: Message) {
        switch (e.getCommand()) {
            case Command.POST: 
                this.logIncoming(e);
                this.post(e.getVersion(), e.getData());
                break;
            case Command.GET: 
                this.logIncoming(e);
                this.get(e.getVersion(), e.getData());
                break;
            default:
                this.logger.warn(`Invalid command ${e.getCommand()} received`);
        }
    }

    private logOutgoing(msg: Message) {
        this.logger.info(`>>> ${Command[msg.getCommand()]} [${this.roomName}]`);
        this.logData(msg);
    }

    private logIncoming(msg: Message) {
        this.logger.info(`<<< ${Command[msg.getCommand()]} [${this.roomName}]`);
        this.logData(msg);
    }

    private logData(msg: Message) {
        this.logger.info(`version: ${msg.getVersion().major}.${msg.getVersion().minor}`);
        this.logger.info(`data:    ${JSON.stringify(msg.getData())}`);
    }
}
