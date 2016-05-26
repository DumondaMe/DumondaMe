'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}
global.requireLogger = require(__dirname + '/lib/logging');

require('./lib/jsonValidation');
var Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);

Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});

var kraken = require('kraken-js');
var emailService = require('./models/eMailService/eMail');
var dbConfig = require('./lib/database');
var app = require('express')();
var options = require('./lib/spec')(app);
var logger = requireLogger.getLogger(__filename);
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


