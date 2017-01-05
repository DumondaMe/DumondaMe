'use strict';

let tv4 = require('tv4');
let exceptions = require('./error/exceptions');
let formats = require('tv4-formats');
let Promise = require('bluebird');
let _ = require('lodash');

tv4.addFormat(formats);

tv4.addFormat('notEmptyString', function (data) {
    if (typeof data === 'string' && /([^\s])/.test(data)) {
        return null;
    }
    return 'String is not empty';
});

tv4.addFormat('youtubeLink', function (data) {
    if (typeof data === 'string' &&
        (data.indexOf('https://www.youtube.com/watch?v=') !== -1 || data.indexOf('https://m.youtube.com/watch?v=') !== -1)) {
        return null;
    }
    return 'Invalid Youtube Link';
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

tv4.addFormat('id', function (data) {
    if (typeof data === 'string' && /([^\s])/.test(data)) {
        if (/^[a-zA-Z0-9]+$/.test(data)) {
            return null;
        }
        return 'String contains invalid signs';
    }
    return 'String is empty';
});

let validate = function (req, data, requestSchema, logger) {
    let errors = tv4.validateMultiple(data, requestSchema),
        invalidJsonException;
    if (errors.valid) {
        return Promise.resolve(data);
    }
    invalidJsonException = new exceptions.InvalidJsonRequest('Wrong input data');
    logger.warn(invalidJsonException.message, req, {error: errors}, req);
    return Promise.reject(invalidJsonException);
};

let convertValues = function (data, requestSchema) {
    let key;
    for (key in requestSchema.properties) {
        if (requestSchema.properties.hasOwnProperty(key) && requestSchema.properties[key].type && data[key]) {
            if (requestSchema.properties[key].type === 'integer') {
                data[key] = parseInt(data[key], 10);
            } else if (requestSchema.properties[key].type === 'boolean') {
                data[key] = data[key] === 'true';
            } else if (requestSchema.properties[key].type === 'number') {
                data[key] = parseFloat(data[key]);
            } else if (requestSchema.properties[key].type === 'array' && _.isString(data[key])) {
                data[key] = [data[key]];
            }
        }
    }
};

module.exports = {
    validateRequest: function (req, requestSchema, logger) {

        if (req.body.model) {
            req.body = JSON.parse(req.body.model);
            delete req.body.model;
        }

        return validate(req, req.body, requestSchema, logger);
    },
    validateQueryRequest: function (req, requestSchema, logger) {
        convertValues(req.query, requestSchema);
        return validate(req, req.query, requestSchema, logger);
    }
};
