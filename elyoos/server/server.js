'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}

global.requireDb = function () {
    return require('elyoos-server-lib').neo4j;
};

global.requireModel = function (name) {
    return require(`${__dirname}/models/${name}`);
};

require('elyoos-server-lib').jsonValidation;
require('elyoos-server-lib').version.setVersion(require('./package.json').version);
var Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);

Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});

var kraken = require('kraken-js');
var emailService = require('./models/eMailService/eMail');
var dbConfig = require('elyoos-server-lib').databaseConfig;
var app = require('express')();
var options = require('elyoos-server-lib').spec(app);
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
var port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
    app.enable('trust proxy');
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
        emailService.start();
        logger.info('Server started');
    });
});

module.exports = app;


