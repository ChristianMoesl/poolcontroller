const client = require('mongodb').MongoClient;

if (process.env.DB_HOST === undefined) {
    throw Error('Please define the environment variable DB_HOST');
}

const connStr = `mongodb://${process.env.DB_HOST}/poolcontroller`;

function DBConnection(callback) {
    client.connect(connStr, null, (err, db) => {
        if (err !== null) {
            throw err;
        }

        callback(db);
    });
}

module.exports = DBConnection;
