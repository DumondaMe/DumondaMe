'use strict';

let https = require('https');
let promise = require('bluebird');
let exceptions = require('dumonda-me-server-lib').exceptions;
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

let ERROR_CODE_RECAPTCHA_FAILED = 1;

let rejectHandling = function (reject, req) {
    let invalidOperationException = new exceptions.InvalidOperation('Recaptcha validation failed', ERROR_CODE_RECAPTCHA_FAILED);
    logger.warn(invalidOperationException.message, req, {error: ''});
    reject(invalidOperationException);
};

let verifyRecaptcha = function (response, req) {

    return new promise(function (resolve, reject) {
        https.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${response}`,
            function (res) {
                let data = "";
                res.on('data', function (chunk) {
                    data += chunk.toString();
                });
                res.on('end', function () {
                    try {
                        let parsedData = JSON.parse(data);
                        if (parsedData.success) {
                            resolve(parsedData.success);
                        } else {
                            rejectHandling(reject, req);
                        }
                    } catch (e) {
                        rejectHandling(reject, req);
                    }
                });
            });
    });
};

module.exports = {
    verifyRecaptcha: verifyRecaptcha
};
