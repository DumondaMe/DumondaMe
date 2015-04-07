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

tv4.addFormat('passwordString', function (data) {
    if (typeof data === 'string') {
        if (/([^\s])/.test(data)) {
            if (/(?=.*[A-Z])/.test(data)) {
                if (/(?=.*[0-9])/.test(data)) {
                    return null;
                }
                return 'Password contains no numbers';
            }
            return 'Password contains no capital letters';
        }
        return 'Password contains only empty strings';
    }
    return 'Password has not type string';
});

var validate = function (req, data, requestSchema, logger) {
    var errors = tv4.validateMultiple(data, requestSchema),
        invalidJsonException;
    if (errors.valid) {
        return Promise.resolve(data);
    }
    invalidJsonException = new exceptions.InvalidJsonRequest('Wrong input data');
    logger.warn(invalidJsonException.message, req, {error: errors}, req);
    return Promise.reject(invalidJsonException);
};

var convertValues = function (data, requestSchema) {
    var key;
    for (key in requestSchema.properties) {
        if (requestSchema.properties.hasOwnProperty(key) && requestSchema.properties[key].type && data[key]) {
            if (requestSchema.properties[key].type === 'integer') {
                data[key] = parseInt(data[key], 10);
            } else if (requestSchema.properties[key].type === 'boolean') {
                data[key] = data[key] === 'true';
            }
        }
    }
};

module.exports = {
    validateRequest: function (req, requestSchema, logger) {
        return validate(req, req.body, requestSchema, logger);
    },
    validateQueryRequest: function (req, requestSchema, logger) {
        convertValues(req.query, requestSchema);
        return validate(req, req.query, requestSchema, logger);
    }
};
