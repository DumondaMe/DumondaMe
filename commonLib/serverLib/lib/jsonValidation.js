'use strict';

const tv4 = require('tv4');
const exceptions = require('./error/exceptions');
const formats = require('tv4-formats');
const Promise = require('bluebird');
const _ = require('lodash');

const createDOMPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

tv4.addFormat(formats);

tv4.addFormat('notEmptyString', function (data) {
    if (typeof data === 'string' && /([^\s])/.test(data)) {
        return null;
    }
    return 'String is not empty';
});

tv4.addFormat('urlWithProtocol', function (data) {

    const protocol = `^(http|https)://`;
    const domain = '([a-z\\u00a1-\\uffff0-9\\-\\_]+\\.){1,}';
    const tld = `[a-z\\u00a1-\\uffff]{2,}`;
    const regex = `${protocol}${domain}${tld}`;

    const urlRegex = new RegExp(`${regex}`, 'i');

    if (typeof data === 'string' && urlRegex.test(data)) {
        return null;
    }
    return 'String is not url with protocol';
});

tv4.addFormat('youtubeLink', function (data) {
    if (typeof data === 'string' &&
        (/\.youtube\.com/i.test(data) || /youtu\.be/i.test(data)) && !/\/embed\//igm.test(data)) {
        return null;
    }
    return 'Invalid youtube link';
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

const validate = function (req, data, requestSchema) {
    let errors = tv4.validateMultiple(data, requestSchema),
        invalidJsonException;
    if (errors.valid) {
        return Promise.resolve(data);
    }
    invalidJsonException = new exceptions.InvalidJsonRequest(`Wrong input data ${data}`);
    return Promise.reject(invalidJsonException);
};

const convertValues = function (data, requestSchema) {
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

const handlingUrls = function (body, requestSchema) {
    for (let key in requestSchema.properties) {
        if (requestSchema.properties.hasOwnProperty(key) && requestSchema.properties[key].type && body[key]) {
            if (requestSchema.properties[key].format === 'urlWithProtocol' && _.isString(body[key])) {
                let url = new URL(body[key]);
                body[key] = url.toString();
            }
        }
    }
};

//To prevent xss attacks
const sanitize = function (body, allowHtml) {
    for (let param in body) {
        if (body.hasOwnProperty(param) && typeof body[param] === 'string') {
            if (allowHtml === true) {
                body[param] = DOMPurify.sanitize(body[param]);
            } else {
                body[param] = DOMPurify.sanitize(body[param], {ALLOWED_TAGS: []});
            }
        }
    }
};

module.exports = {
    validateRequest: function (req, requestSchema, allowHtml) {

        if (req.body.model) {
            req.body = JSON.parse(req.body.model);
            delete req.body.model;
        }
        if (req.params) {
            convertValues(req.params, requestSchema);
            req.body = Object.assign(req.body, req.params);
        }
        if (req.query) {
            convertValues(req.query, requestSchema);
            req.body = Object.assign(req.body, req.query);
        }
        sanitize(req.body, allowHtml);
        handlingUrls(req.body, requestSchema);
        return validate(req, req.body, requestSchema);
    },
    validateQueryRequest: function (req, requestSchema) {
        convertValues(req.query, requestSchema);
        sanitize(req.query);
        return validate(req, req.query, requestSchema);
    },
    validateParams: function (req, requestSchema) {
        convertValues(req.params, requestSchema);
        sanitize(req.params);
        return validate(req, req.params, requestSchema);
    }
};
