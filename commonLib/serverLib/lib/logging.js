'use strict';

let winston = require('winston');
let winstonCloudWatch = require('winston-cloudwatch');

let customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'blue',
        error: 'red',
        info: 'green',
        warn: 'yellow',
        debug: 'grey'
    }
};

let logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        })
    ],
    levels: customLevels.levels,
    colors: customLevels.colors
});
let winstonCloudWatchConfig;
if (process.env.ELYOOS_MODE === 'production-admin') {
    winstonCloudWatchConfig = {
        logGroupName: 'elyoosWebserver',
        logStreamName: 'webserverAdmin',
        level: 'info',
        awsRegion: 'eu-central-1'
    };
} else if (process.env.ELYOOS_MODE === 'production') {
    winstonCloudWatchConfig = {
        logGroupName: 'elyoosWebserver',
        logStreamName: 'webserver',
        level: 'info',
        awsRegion: 'eu-central-1'
    };
}

if (process.env.ELYOOS_MODE === 'production' || process.env.ELYOOS_MODE === 'production-admin') {
    logger.add(winstonCloudWatch, winstonCloudWatchConfig);
}

let log = function (module, level, message, metadata, request) {

    let logMessage = `[${module}] ${message}`;

    if (!metadata) {
        metadata = {};
    }

    if (request && request.headers && request.headers['user-agent']) {
        metadata.browser = request.headers['user-agent'];
    }

    if (request && request.user && request.user.id) {
        metadata.userId = request.user.id;
    }
    if (metadata && metadata.error) {
        metadata.errorMessage = metadata.error.message;
    }
    logger.log(level, logMessage, metadata);

};

module.exports = {
    getLogger: function (module) {
        module = module.replace(process.env.BASE_DIR, '');
        return {
            fatal: function (message, request, metadata) {
                log(module, 'fatal', message, metadata, request);
            },
            error: function (message, request, metadata) {
                log(module, 'error', message, metadata, request);
            },
            info: function (message, request, metadata) {
                log(module, 'info', message, metadata, request);
            },
            warn: function (message, request, metadata) {
                log(module, 'warn', message, metadata, request);
            },
            debug: function (message, request, metadata) {
                log(module, 'debug', message, metadata, request);
            }
        };
    }
};
