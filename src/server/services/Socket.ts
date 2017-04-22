import { Event } from '../util/Event';

export enum Command {
    POST,
    GET,
    ACK,
    NAK,
    NOTIFICATION,
}

export interface Version {
    major: number;
    minor: number;
}

export interface Message {
    command: string;
    version: Version;
    data: Object;
}

export interface Socket {
    received: Event<Socket, Message>;
    send(data: Message);
}
export const SocketType = Symbol('Socket');

export interface SocketFactory {
    create(name: string): Socket;
}
export const SocketFactoryType = Symbol('SocketFactory');