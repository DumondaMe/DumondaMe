'use strict';

var auth = require('./../../../lib/auth');

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {
        res.status(200).end();
    });
};
