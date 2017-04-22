import { inject, injectable, named } from 'inversify';
import { Logger, LoggerType } from '../services/Logger';
import { StringType } from '../Types';
import Tags from '../Tags';
import { MongoClient as client } from 'mongodb';

export const DBConnectionStringTag = Symbol('DBConnectionString');

@injectable()
export class DBConnection {
    constructor(
        @inject(StringType) @named(DBConnectionStringTag) private connString: string,
        @inject(LoggerType) private logger: Logger
    ) { }

    executeQuey(callback: any) {
        client.connect(this.connString, null, (err, db) => {
            if (err !== null) {
                if (err.name === 'MongoError') {
                    this.logger.error(`Failed to connect to database [${this.connString}] on first connect`);
                    this.logger.error('Ensure if the mongodb server is running');
                    process.exit(1);
                }
                throw err;
            }

            callback(db);
        });
    }
}
