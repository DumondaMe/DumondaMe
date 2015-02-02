'use strict';

var winston = require('winston');

var customLevels = {
    levels: {
        fatal: 4,
        error: 3,
        info: 2,
        warn: 1,
        debug: 0
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
    levels: customLevels.levels,
    colors: customLevels.colors
});

var log = function (module, level, message, metadata, request) {
    if (metadata) {
        if (request && request.user && request.user.id) {
            metadata.userId = request.user.id;
        }
        logger.log(level, '[' + module + '] ' + message, metadata);
    } else {
        logger.log(level, '[' + module + '] ' + message);
    }
};

if (!process.env.NODE_ENV || (process.env.NODE_ENV === 'development')) {
    logger.add(winston.transports.Console, {level: 'debug'});
    logger.transports.console.colorize = true;
} else if (process.env.NODE_ENV === 'testing') {
    logger.add(winston.transports.Console, {level: 'debug'});
    logger.transports.console.colorize = true;
}


module.exports = {
    getLogger: function (module) {
        module = module.replace(process.env.BASE_DIR, '');
        return {
            fatal: function (message, metadata, request) {
                log(module, 'fatal', message, metadata, request);
            },
            error: function (message, metadata, request) {
                log(module, 'error', message, metadata, request);
            },
            info: function (message, metadata, request) {
                log(module, 'info', message, metadata, request);
            },
            warn: function (message, metadata, request) {
                log(module, 'warn', message, metadata, request);
            },
            debug: function (message, metadata, request) {
                log(module, 'debug', message, metadata, request);
            }
        };
    }
};
