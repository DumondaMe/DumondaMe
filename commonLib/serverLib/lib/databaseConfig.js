'use strict';
let connection = require('./neo4j');
let logger = require('./logging').getLogger(__filename);
let promise = require('bluebird');

let res;
let connected = new promise.Promise(function (resolve) {
    res = resolve;
});

let db = function () {
    return {
        connected: connected,
        /**
         * Open a connection to the database
         * @param conf
         */
        config: function (conf) {

            return connection.connect(conf.host).then(function () {
                logger.info('Successfully connected to database ' + conf.host);
                res({});
            }).catch(function () {
                logger.error('Failed to connect to database ' + conf.host);
                process.exit(1);
            });

        }
    };
};

module.exports = db();
