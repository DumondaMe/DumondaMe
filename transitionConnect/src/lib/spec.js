'use strict';

let db = require('dumonda-me-server-lib').databaseConfig;

let token;

module.exports = function (app) {

    app.on('middleware:before:json', function () {
        app.use(function (req, res, next) {
            if(req.headers['authorization'] && req.headers['authorization'] === token) {
                next();
            } else  {
                return res.status(401).send();
            }
        });
    });

    return {
        onconfig: function (config, next) {

            let dbConfig = config.get('databaseConfig'),
                tokenConfig = config.get('apiSecurity');

            db.config(dbConfig);
            token = tokenConfig.token;
            next(null, config);
        }
    };

};
