'use strict';

var exceptions = require('./exceptions');

var getErrorHandling = function (description, req, res, logger, controllerCode) {
    return controllerCode().catch(exceptions.InvalidJsonRequest, function () {
        res.status(400).end();
    }).catch({name: 'invalidOperation'}, function (e) {
        if (e && e.elyoosErrorCode) {
            res.status(400).json({errorCode: e.elyoosErrorCode});
        } else {
            res.status(400).end();
        }
    }).catch(function (err) {
        logger.error(description, req, {error: err});
        res.status(500).end();
    });
};

module.exports = getErrorHandling;
