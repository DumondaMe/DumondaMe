'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}
require('elyoos-server-lib').init('elyoos');

global.requireDb = function () {
    return require('elyoos-server-lib').neo4j;
};

global.requireModel = function (name) {
    return require(`${__dirname}/api/models/${name}`);
};

require('elyoos-server-lib').jsonValidation;
const Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);

Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});

const isProd = process.env.NODE_ENV === 'production';
const {Nuxt, Builder} = require('nuxt');
const nuxtConfig = require('./nuxt.config.js');
const nuxt = new Nuxt(nuxtConfig);
const kraken = require('kraken-js');
const emailService = require('./api/models/eMailService/eMail');
const dbConfig = require('elyoos-server-lib').databaseConfig;
const app = require('express')();
const options = require('elyoos-server-lib').spec(app, nuxt);
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    app.set('trust proxy', 1);
    logger.info('Enabled trust proxy');
}

if (!isProd && process.env.NODE_ENV !== 'testing') {
    new Builder(nuxt).build()
        .then(listen)
        .catch((error) => {
            console.error(error);
            process.exit(1);
        })
} else {
    listen();
}

app.use(kraken(options));

function listen() {
    app.listen(port, function (err) {
        if (err) {
            logger.fatal('Server failed to start', {message: err});
        } else {
            logger.info('[' + app.settings.env + '] Listening on http://localhost:' + port);
        }
    });
}

app.on('start', function () {
    dbConfig.connected.then(function () {
        emailService.start();
        logger.info('Server started');
    });
});

app.on('exit', function () {
    requireDb().closeDriver();
});

module.exports = app;


