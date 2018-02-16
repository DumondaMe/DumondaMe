'use strict';

let Promise = require('bluebird');

module.exports = fn =>
    (req, res, next) => {
        if (!req.user) {
            req.user = {id: null};
        }
        return Promise.resolve(fn(req, res, next))
            .catch(next);
    };
