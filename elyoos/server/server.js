'use strict';

if (!process.env.BASE_DIR) {
    process.env.BASE_DIR = __dirname;
}
require('elyoos-server-lib').init('elyoos');

global.requireDb = function () {
    return require('elyoos-server-lib').neo4j;
};

global.requireModel = function (name) {
    return require(`${__dirname}/models/${name}`);
};

require('elyoos-server-lib').jsonValidation;
require('elyoos-server-lib').version.setVersion(require('./package.json').version);
let Promise = require('bluebird');
Promise.promisifyAll(require('gm').prototype);

Promise.Promise.config({warnings: false, longStackTraces: true, cancellation: true});

let kraken = require('kraken-js');
let emailService = require('./models/eMailService/eMail');
let dbConfig = require('elyoos-server-lib').databaseConfig;
let app = require('express')();
let cors = require('cors');
let options = require('elyoos-server-lib').spec(app);
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    app.set('trust proxy', 1);
    logger.info('Enabled trust proxy');
}

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));
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

app.on('exit', function () {
    requireDb().closeDriver();
});

module.exports = app;


