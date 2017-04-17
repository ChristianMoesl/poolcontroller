export class Error {
    _code: number;
    _msg: string;

    constructor(code: number, msg: string) {
        this._code = code;
        this._msg = msg;
    }
}

export const notImplemented = new Error(0, 'Not implemented');
export const unknownParameter = new Error(1, 'Unknown parameter');
export const missingParameter = new Error(2, 'Missing parameter');
