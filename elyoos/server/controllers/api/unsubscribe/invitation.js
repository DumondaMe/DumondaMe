'use strict';

let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let rateLimit = require('elyoos-server-lib').limiteRate;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
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
    delayAfter: 3,
    delayMs: 3 * 1000,
    max: 10
});

module.exports = function (router) {

    router.post('/', apiLimiter, function (req, res) {

        return controllerErrors('Error occurs on unsubscribe invitation', req, res, logger, function () {
            return validation.validateRequest(req, schemaUnsubscribeInvitation, logger).then(function (request) {
                logger.info(`Unsubscribe Email ${request.email}`);
                return unsubscribe.unsubscribe(request.email, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
