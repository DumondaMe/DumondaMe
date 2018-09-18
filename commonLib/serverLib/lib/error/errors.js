'use strict';

let logger = require('../logging').getLogger(__filename);

exports.handlingError = function () {
    return function (err, req, res, next) {
        if (err instanceof Error) {
            if (err.name === 'invalidJsonRequest' || err.name === 'invalidOperation') {
                if (err.dumondaMeErrorCode) {
                    res.status(400).json({errorCode: err.dumondaMeErrorCode});
                } else {
                    res.status(400).end();
                }
            } else if (err.name === 'unauthorized') {
                if (err.dumondaMeErrorCode) {
                    res.status(401).json({errorCode: err.dumondaMeErrorCode});
                } else {
                    res.status(401).end();
                }
            } else if (err.message === '401') {
                logger.warn('User has no authentication', req, {httpStatusCode: 401, error: err});
                res.status(401).send('No Authentication');
            } else if (err.message === '403') {
                logger.warn('Forbidden to access resource', req, {httpStatusCode: 403, error: err});
                res.status(403).send('Forbidden');
            } else if (err.message === '404') {
                logger.warn('Not Found', req, {httpStatusCode: 404, error: err});
                res.status(404).send('Not Found');
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
