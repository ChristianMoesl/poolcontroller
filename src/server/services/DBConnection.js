const client = require('mongodb').MongoClient;

const connStr = 'mongodb://localhost:27017/poolcontroller';

function DBConnection(callback) {
    client.connect(connStr, null, (err, db) => {
        if (err !== null) {
            throw err;
        }

        callback(db);
    });
}

module.exports = DBConnection;
