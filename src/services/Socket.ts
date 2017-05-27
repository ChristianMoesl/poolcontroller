import { Event } from '../util/Event';

export interface Socket {
    received: Event<Socket, object>;
    send(data: object);
}
export const SocketType = Symbol('Socket');

export interface SocketFactory {
    create(name: string): Socket;
}
export const SocketFactoryType = Symbol('SocketFactory');