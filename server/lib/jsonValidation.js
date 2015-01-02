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

module.exports = {
    validateRequest: function (req, requestSchema, logger) {
        var errors = tv4.validateMultiple(req.body, requestSchema),
            invalidJsonException;
        if (errors.valid) {
            return Promise.resolve(req.body);
        }
        invalidJsonException = new exceptions.InvalidJsonRequest('Wrong input data');
        logger.warn(invalidJsonException.message, {error: errors}, req);
        return Promise.reject(invalidJsonException);
    },
    sendValidateResponse: function (res, responseSchema, logger, dataToSend) {
        var errors = tv4.validateMultiple(dataToSend, responseSchema);
        if (errors.valid) {
            res.json(dataToSend);
        } else {
            logger.warn('Wrong response data', {error: errors}, res);
            res.status(500).end();
        }
    }
};
