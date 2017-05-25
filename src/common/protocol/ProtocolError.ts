export class ProtocolError {
    _code: number;
    _msg: string;

    constructor(code: number, msg: string) {
        this._code = code;
        this._msg = msg;
    }
}

export const notImplemented = new ProtocolError(0, 'Not implemented');
export const unknownParameter = new ProtocolError(1, 'Unknown parameter');
export const missingParameter = new ProtocolError(2, 'Missing parameter');
export const unknownVersion = new ProtocolError(3, 'Unknown version');