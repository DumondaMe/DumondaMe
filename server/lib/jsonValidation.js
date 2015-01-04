'use strict';

var tv4 = require('tv4');
var Promise = require('bluebird').Promise;
var exceptions = require('./error/exceptions');
var formats = require('tv4-formats');

tv4.addFormat(formats);

tv4.addFormat('notEmptyString', function (data) {
    if (typeof data === 'string' && /([^\s])/.test(data)) {
        return null;
    }
    return 'String is empty';
});

var validate = function (req, data, requestSchema, logger) {
    var errors = tv4.validateMultiple(data, requestSchema),
        invalidJsonException;
    if (errors.valid) {
        return Promise.resolve(data);
    }
    invalidJsonException = new exceptions.InvalidJsonRequest('Wrong input data');
    logger.warn(invalidJsonException.message, {error: errors}, req);
    return Promise.reject(invalidJsonException);
};

module.exports = {
    validateRequest: function (req, requestSchema, logger) {
        return validate(req, req.body, requestSchema, logger);
    },
    validateGetRequest: function (req, requestSchema, logger) {
        return validate(req, req.query, requestSchema, logger);
    }
};
