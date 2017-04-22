import { addColors, Logger, transports } from 'winston';
import * as dateFormat from 'dateformat';

addColors({
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    fatal: 'red',
});

const log: any = new Logger({
    transports: [
        
        new (transports.Console)({
            timestamp: () => dateFormat(Date.now(), 'mm.dd.yyyy HH:MM:ss'),
            colorize: true,
            prettyPrint: true,
        }),
    ],
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
});

export { log};
