'use strict';

var https = require('https');
var promise = require('bluebird');
let exceptions = require('elyoos-server-lib').exceptions;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var ERROR_CODE_RECAPTCHA_FAILED = 1;
var SECRET = '6LfWvyYTAAAAAOLH1SvjQ4-vAviNkZ0g2gOhtQss';

var rejectHandling = function (reject, req) {
    var invalidOperationException = new exceptions.InvalidOperation('Recaptcha validation failed', ERROR_CODE_RECAPTCHA_FAILED);
    logger.warn(invalidOperationException.message, req, {error: ''});
    reject(invalidOperationException);
};

var verifyRecaptcha = function (response, req) {

    return new promise(function (resolve, reject) {
        https.get(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${response}`, function (res) {
            var data = "";
            res.on('data', function (chunk) {
                data += chunk.toString();
            });
            res.on('end', function () {
                try {
                    var parsedData = JSON.parse(data);
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
