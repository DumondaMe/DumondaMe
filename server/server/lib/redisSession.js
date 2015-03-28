'use strict';

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function redis(settings, redisConfig) {
    var env = process.env.NODE_ENV || 'development';
    if ('testing' !== env) {
        settings.store = new RedisStore(redisConfig);
    }
    return session(settings);
};
