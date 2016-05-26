'use strict';

var path = require('path');
var RateLimit = require('express-rate-limit');

var apiLimiter = new RateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 30,
    delayMs: 0 // disabled
});

module.exports = function (router) {

    router.get('/*', apiLimiter, function (req, res) {
        var username = '';
        if (req.session && req.session.passport && req.session.passport.user) {
            username = req.session.passport.user;
        }
        res.cookie('user', JSON.stringify({
            'username': username
        }));
        res.sendFile(path.join(process.env.BASE_DIR, '../client/app/', 'index.html'));
    });

};
