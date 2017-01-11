'use strict';

let logger = require('../logging').getLogger(__filename);

exports.handlingError = function () {
    return function (err, req, res, next) {
        if (err instanceof Error) {
            if (err.message === '401') {
                logger.warn('User has no authentication', req, {httpStatusCode: 401, error: err});
                res.status(401).send('No Authentication');
            } else if (err.message === '403') {
                logger.warn('Forbidden to access resource', req, {httpStatusCode: 403, error: err});
                res.status(403).send('Forbidden');
            } else {
                logger.error('Server Error Occured', req, {
                    httpStatusCode: err.message,
                    error: err
                });
                res.status(500).send('Internal Server Error');
            }
        } else {
            next();
        }
    };
};
