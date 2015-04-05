'use strict';

var exceptions = require('./exceptions');
var Promise = require('bluebird').Promise;

var getErrorHandling = function (description, req, res, logger, controllerCode) {
    return controllerCode().catch(exceptions.InvalidJsonRequest, function () {
        res.status(400).end();
    }).catch(exceptions.invalidOperation, function (e) {
        if (e) {
            res.status(400).json({errorCode: e.elyoosErrorCode});
        } else {
            res.status(400).end();
        }
    }).catch(function (err) {
        logger.error(description, {error: err}, req);
        res.status(500).end();
    });
};

module.exports = getErrorHandling;
