'use strict';

var logger = requireLogger.getLogger(__filename);

exports.handlingError = function () {
    return function (err, req, res, next) {
        if (err instanceof Error) {
            logger.error('Server Error Occured', {
                httpStatusCode: err.message,
                error: err
            }, req);
            res.status(500).send('Internal Server Error');
        } else {
            next();
        }
    };
};
