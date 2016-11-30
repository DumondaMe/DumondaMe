'use strict';

var winston = require('winston');
var winstonCloudWatch = require('winston-cloudwatch');

var customLevels = {
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

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        })
    ],
    levels: customLevels.levels,
    colors: customLevels.colors
});

if (process.env.NODE_ENV === 'production') {
    logger.add(winstonCloudWatch, {
        logGroupName: 'elyoosWebserver',
        logStreamName: 'webserver',
        level: 'info',
        awsRegion: 'eu-central-1'
    });
}

var log = function (module, level, message, metadata, request) {

    if (!metadata) {
        metadata = {};
    }

    if (request && request.headers && request.headers['user-agent']) {
        metadata.browser = request.headers['user-agent'];
    }

    if (request && request.user && request.user.id) {
        metadata.userId = request.user.id;
    }
    logger.log(level, '[' + module + '] ' + message, metadata);

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
