var DbConnector = require('./DbConnector');

module.exports = DbInitializer;

function DbInitializer() {
    this._connection = new DbConnector();
}

DbInitializer.prototype._initializeByVersionAsync = function(promise, version) {
    switch (version) {
        case 0:
            promise.then(function() {
                return this._initializeSchemeV0Async(promise);
            });
        case 1:
            promise.then(function() {
                return this._initializeSchemeV1Async(promise)
            });
            break;
        default:
            throw new Error('Invalid argument: unknown db scheme version ' + version);
    }

    return promise;
};

DbInitializer.prototype._initializeSchemeV0Async = function(promise) {
    var conn = this._connection;
    return promise.then(function() {
            return conn.queryAsync('CREATE TABLE db_info(id int, scheme_version int, PRIMARY KEY(id))')
        }).then(function() {
            return conn.queryAsync('INSERT INTO db_info VALUES(0, 0)');
        });
};

DbInitializer.prototype._initializeSchemeV1Async = function(promise) {
    var conn = this._connection;
    return promise.then(function() {
            return conn.queryAsync(
                'CREATE TABLE pool_settings(' +
                'settings_id int PRIMARY KEY,' +
                'settings_name text NOT NULL UNIQUE,' +
                'settings_unit text NOT NULL,' +
                'settings_value text NOT NULL,' +
                ')')
        }).then(function(result) {
            return conn.queryAsync(
                'UPDATE db_info ' +
                'SET scheme_version=1'
            );
        });
};

DbInitializer.prototype.initialize = function(callback) {
    var that = this;
    that._connection.queryAsync('SELECT * from db_infos')
        .then(function(result) {
            return that._initializeByVersionAsync(res['scheme_version']);
        }).catch(function() {
            return that._initializeByVersionAsync(0);
        }).finally(function() {
            that._connection.close();
            callback();
        });
};