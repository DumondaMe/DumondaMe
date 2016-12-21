'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let reopenFeedback = requireModel('feedback/reopen');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaReopenFeedback = {
    name: 'reopenFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['feedbackId', 'reasonText'],
    properties: {
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        reasonText: {type: 'string', format: 'notEmptyString', maxLength: 500},
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs reopening a feedback', req, res, logger, function () {
            return validation.validateRequest(req, schemaReopenFeedback, logger).then(function (request) {
                return reopenFeedback.open(req.user.id, request, req);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
