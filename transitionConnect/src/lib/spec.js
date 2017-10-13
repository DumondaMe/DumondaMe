'use strict';

let db = require('elyoos-server-lib').databaseConfig;

module.exports = function () {

    return {
        onconfig: function (config, next) {

            let dbConfig = config.get('databaseConfig');

            db.config(dbConfig);
            next(null, config);
        }
    };

};
