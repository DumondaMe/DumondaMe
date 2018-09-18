'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}
require('dumonda-me-server-lib').init('elyoos');
global.requireDb = function () {
    return require('dumonda-me-server-lib').neo4j;
};
global.requireModel = function (name) {
    return require(`${__dirname}/api/models/${name}`);
};

require('dumonda-me-server-lib').jsonValidation;
const Promise = require('bluebird');

Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});
const isServerDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';

const {Nuxt, Builder} = require('nuxt');
let nuxt = null;
if (!isTesting) {
    const nuxtConfig = require('./nuxt.config.js');
    nuxt = new Nuxt(nuxtConfig);
}

const kraken = require('kraken-js');
const dbConfig = require('dumonda-me-server-lib').databaseConfig;
const app = require('express')();
const options = require('dumonda-me-server-lib').spec(app, nuxt);
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const port = process.env.PORT || 3001;

if (isProduction || isServerDevelopment) {
    app.enable('trust proxy');
    logger.info('Enabled trust proxy');
}

app.use(kraken(options));

app.on('start', function () {
    dbConfig.connected.then(function () {
        logger.info('Admin Server started');
    });
});

app.on('exit', function () {
    requireDb().closeDriver();
});

if (isProduction || isServerDevelopment || isTesting) {
    listen();
} else {
    new Builder(nuxt).build()
        .then(listen)
        .catch((error) => {
            logger.error(error);
            process.exit(1);
        });
}

function listen() {
    app.listen(port, function (err) {
        if (err) {
            logger.fatal('Server failed to start', {message: err});
        } else {
            logger.info('[' + app.settings.env + '] Listening on http://localhost:' + port);
        }
    });
}

module.exports = app;


