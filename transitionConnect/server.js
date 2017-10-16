'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}

require('elyoos-server-lib').init('tc');

global.requireDb = function () {
    return require('elyoos-server-lib').neo4j;
};

global.requireModel = function (name) {
    return require(`${__dirname}/src/model/${name}`);
};

require('elyoos-server-lib').jsonValidation;
let Promise = require('bluebird');
Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});

let kraken = require('kraken-js');
let dbConfig = require('elyoos-server-lib').databaseConfig;
let app = require('express')();
let options = require('./src/lib/spec')(app);
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let port = process.env.PORT || 8084;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    app.set('trust proxy', 1);
    logger.info('Enabled trust proxy');
}

app.use(kraken(options));

app.listen(port, function (err) {
    if (err) {
        logger.fatal('Server failed to start', {message: err});
    } else {
        logger.info('[' + app.settings.env + '] Listening on http://localhost:' + port);
    }
});

app.on('start', function () {
    dbConfig.connected.then(function () {
        logger.info('Server started');
    });
});

app.on('exit', function () {
    requireDb().closeDriver();
});

module.exports = app;


