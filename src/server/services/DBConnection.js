const client = require('mongodb').MongoClient;

const connStr = process.env.DB_HOST === undefined ? null : `mongodb://${process.env.DB_HOST}/poolcontroller`;

function DBConnection(callback) {
    if (connStr == null) {
        return;
    }

    client.connect(connStr, null, (err, db) => {
        if (err !== null) {
            throw err;
        }

        callback(db);
    });
}

module.exports = DBConnection;
