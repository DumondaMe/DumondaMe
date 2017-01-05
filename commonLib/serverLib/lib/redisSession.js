'use strict';

let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let logger = require('./logging').getLogger(__filename);

module.exports = function (settings, redisConfig) {
    let env = process.env.NODE_ENV || 'development';
    if ('testing' !== env) {
        logger.info('Set Redis for session store');
        settings.store = new RedisStore(redisConfig);
    } else {
        logger.info('Not set Redis for session store. Use Memory');
    }
    return session(settings);
};
