import { log } from '../util/Log';

const client = require('mongodb').MongoClient;

const connStr = 'mongodb://localhost:27017/poolcontroller';

export class DBConnection {
    constructor(callback: any) {
        client.connect(connStr, null, (err, db) => {
            if (err !== null) {
                if (err.name === 'MongoError') {
                    log.error(`Failed to connect to database [${connStr}] on first connect`);
                    log.error('Ensure if the mongodb server is running');
                    process.exit(1);
                }
                throw err;
            }

            callback(db);
        });
    }
}
