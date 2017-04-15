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

export { io };
