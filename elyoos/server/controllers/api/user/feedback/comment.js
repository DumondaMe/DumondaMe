'use strict';

let auth = require('elyoos-server-lib').auth;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);
let feedbackComment = requireModel('feedback/create/comment');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaCreateFeedbackComment = {
    name: 'createFeedbackComment',
    type: 'object',
    additionalProperties: false,
    required: ['feedbackId', 'text'],
    properties: {
        text: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when creating a comment for a feedback', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateFeedbackComment, logger).then(function (request) {
                logger.info(`User creates comment for feedback`, req);
                return feedbackComment.create(req.user.id, request, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
