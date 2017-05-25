import { inject, injectable } from 'inversify';
import { Logger, LoggerType } from '../services/Logger';
import { Socket, SocketFactory, Message } from '../services/Socket';
import { EventDispatcher, Event } from '../util/Event';

import { log } from './Log';
import * as ion from 'socket.io';

const io = ion();

const connections = [];

io.on('connection', (socket) => {
    connections.push(socket);
    log.info(`User connected: ${connections.length} socket(s) connected`);

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        log.info(`User disconnected: ${connections.length} socket(s) connected`);
    });
});

export class IoSocket implements Socket {
    private receivedEvent = new EventDispatcher<Socket, Message>();
    private ns: any;
    
    constructor(private roomName: string, private logger: Logger) {
        const self = this;

        this.ns = io.of(roomName);
        this.ns.on('connection', (socket) => { 
            socket.on('messageFromClient', (id, msg) => { 
                self.onMessage(id); 
            }); 
        })
     }

    get received(): Event<Socket, Message> {
        return this.receivedEvent;
    }

    send(message: Message) {
        this.ns.emit('messageFromServer', message);
    }

    private onMessage(data: any) {
        if (data && typeof data === 'object'
        && data.hasOwnProperty('command')
        && data.hasOwnProperty('version')
        && data.hasOwnProperty('data')
        && data.version.hasOwnProperty('major')
        && data.version.hasOwnProperty('minor')) {
            this.receivedEvent.dispatch(this, data);
        } else {
            this.logger.warn(`Invalid object received in room ${this.roomName}`);
            this.logger.warn(data);
        }
    }
}

@injectable()
export class IoSocketFactory implements SocketFactory {
    constructor(@inject(LoggerType) private logger: Logger) { }
    create(name: string): Socket {
        return new IoSocket(name, this.logger);
    }
}

export { io };