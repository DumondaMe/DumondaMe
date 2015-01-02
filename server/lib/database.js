'use strict';
var connection = require('../neo4j');
var logger = require('./logging').getLogger(__filename);
var promise = require('bluebird');

var res;
var connected = new promise.Promise(function (resolve) {
    res = resolve;
});

var db = function () {
    return {
        connected: connected,
        /**
         * Open a connection to the database
         * @param conf
         */
        config: function (conf) {

            connection.connect(conf.host).then(function () {
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
