'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}
global.requireLogger = require(__dirname + '/../../elyoos/server/lib/logging');
global.requireDb = function () {
    return require(__dirname + '/../../elyoos/server/neo4j');
};
global.requireLib = function (name) {
    return require(`${__dirname}/../../elyoos/server/lib/${name}`);
};
global.requireModel = function (name) {
    return require(`${__dirname}/models/${name}`);
};

require('../../elyoos/server/lib/jsonValidation');
var Promise = require('bluebird');

Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});

var kraken = require('kraken-js');
var dbConfig = require('../../elyoos/server/lib/database');
var app = require('express')();
var options = require('../../elyoos/server/lib/spec')(app);
var logger = requireLogger.getLogger(__filename);
var port = process.env.PORT || 8082;

if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
    logger.info('Enabled trust proxy');
}

app.use(kraken(options));

app.listen(port, function (err) {
    if (err) {
        logger.fatal('Admin Server failed to start', {message: err});
    } else {
        logger.info('[' + app.settings.env + '] Listening on http://localhost:' + port);
    }
});

app.on('start', function () {
    dbConfig.connected.then(function () {
        logger.info('Admin Server started');
    });
});

module.exports = app;


