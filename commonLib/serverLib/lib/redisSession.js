'use strict';

const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let logger = require('./logging').getLogger(__filename);

module.exports = function (settings, redisConfig) {
    let env = process.env.NODE_ENV || 'development';
    if ('testing' !== env) {
        logger.info('Set Redis for session store');
        let client = redis.createClient(redisConfig);
        settings.store = new RedisStore({client});
    } else {
        logger.info('Not set Redis for session store. Use Memory');
    }
    return session(settings);
};
