import Log from '../util/Log';

const client = require('mongodb').MongoClient;

const connStr = 'mongodb://localhost:27017/poolcontroller';

function DBConnection(callback) {
    client.connect(connStr, null, (err, db) => {
        if (err !== null) {
            if (err.name === 'MongoError') {
                Log.error(`Failed to connect to database [${connStr}] on first connect`);
                Log.error('Ensure if the mongodb server is running');
                process.exit(1);
            }
            throw err;
        }

        callback(db);
    });
}

module.exports = DBConnection;
