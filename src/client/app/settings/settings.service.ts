//import { socket } from '../Socket';
import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
    private socket: any;

    constructor() {
        this.socket = io.connect('/settings');
        this.socket.on('messageFromServer', d => {
            console.log('Receive');
            console.log(d);
            console.log(d);
        });
    }

    send() {
        this.socket.emit('messageFromClient', { command: 'GET', message: 'settings', version: { major: 1, minor: 0 }, data: {}});
    }
}