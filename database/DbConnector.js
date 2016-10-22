var mysql = require('mysql');
var Promise = require('bluebird');

module.exports = DbConnector;

var connectionString = {
    host     : 'localhost',
    user     : 'wordpress',
    password : 'wordpress',
    database : 'poolcontroller'
};

function ConnectionException(message) {
    this.message = message;
    this.name = "ConnectionException";
}

function DbConnector() {
    this._connection = mysql.createConnection(connectionString);
    this._that = this;

    this._connection.connect(function(err) {
        if (err) {
            throw new ConnectionException("Cannot connect to: \n"
                + "HOST : " + connectionString.host + "\n"
                + "USER : " + connectionString.user + "\n"
                + "DATABASE : " + connectionString.database);
        }
    });
}

DbConnector.prototype.commit = function(options, callback) {
    this._connection.commit(options, callback);
};

DbConnector.prototype.rollback = function(options, callback) {
    this._connection.rollback(options, callback);
};

DbConnector.prototype.queryAsync = function(sql, values) {
    var connection = this._connection;
    return new Promise(function(resolve, reject) {
        connection.query(sql, values, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

DbConnector.prototype.query = function(sql, values, callback) {
    this._connection.query(sql, values, callback);
};

DbConnector.prototype.close = function() {
    this._connection.end();
};