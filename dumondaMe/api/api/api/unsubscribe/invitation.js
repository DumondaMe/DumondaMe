'use strict';

let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
let rateLimit = require('dumonda-me-server-lib').limiteRate;
let controllerErrors = require('dumonda-me-server-lib').controllerErrors;
let validation = require('dumonda-me-server-lib').jsonValidation;
let unsubscribe = requireModel('unsubscribe/invitation');

let schemaUnsubscribeInvitation = {
    name: 'UnsubscribeInvitation',
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
        email: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 1000}
    }
};

let apiLimiter = rateLimit.getRate({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 3
});

module.exports = function (router) {

    router.post('/', apiLimiter, function (req, res) {
        return controllerErrors('Error occurs on unsubscribe invitation', req, res, logger, function () {
            return validation.validateRequest(req, schemaUnsubscribeInvitation).then(function (request) {
                logger.info(`Unsubscribe Email ${request.email}`);
                return unsubscribe.unsubscribe(request.email, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
