/* @flow */

import io from '../util/sockets';
import log from '../util/Log';

export default class Room {
    _nsp: any;

    constructor(msgName: string) {
        this._nsp = io.of(msgName);
        this._nsp.on('post', data => this.post(data));
        this._nsp.on('get', data => this.get(data));
    }

    post(data: any) {
        log.info('<<< POST');
        log.info(data);
    }

    get(data: any) {
        log.info('<<< GET');
        log.info(data);
    }

    sendNotification(data: any) {
        log.info('>>> NOTIFICATION');
        log.info(data);
        this._nsp('notification', data);
    }

    sendAck(data: any = {}) {
        log.info('>>> ACK');
        log.info(data);
        this._nsp('ack', data);
    }

    sendNak(error: any) {
        log.info('>>> NAK');
        log.info(error);
        this._nsp('nak', error);
    }
}
