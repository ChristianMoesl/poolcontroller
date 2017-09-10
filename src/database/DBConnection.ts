import { inject, injectable, named } from 'inversify';
import { Logger, LoggerType } from '../services/Logger';
import { StringType } from '../Types';
import { MongoClient, Db } from 'mongodb';
export { MongoClient, Db } from 'mongodb';

export const DBConnectionStringTag = Symbol('DBConnectionString');

interface Callback {
    (db: Db): void;
}

@injectable()
export class DBConnection {
    constructor(
        @inject(StringType) @named(DBConnectionStringTag) private connString: string,
        @inject(LoggerType) private logger: Logger
    ) { }

    connect(): Promise<Db> {
        return MongoClient.connect(this.connString).catch(err => {
            if (err !== null) {
                if (err.name === 'MongoError') {
                    this.logger.error(`Failed to connect to database [${this.connString}] on first connect`);
                    this.logger.error('Ensure if the mongodb server is running');
                    process.exit(1);
                }
                throw err;
            }
        }).then(db => {
            if (db)
                return db as Db;
            else {
                this.logger.error(`Failed to connect to database [${this.connString}] on first connect`);
                this.logger.error('Ensure if the mongodb server is running');
                process.exit(1);
            }
        });
    }
}
