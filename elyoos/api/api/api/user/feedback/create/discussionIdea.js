'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let discussionIdea = requireModel('feedback/create/discussionIdea');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaCreateFeedback = {
    name: 'createDiscussionIdeaFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description', 'discussionId'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        discussionId: {type: 'string', format: 'notEmptyString', maxLength: 50},
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs creating a new discussion idea', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateFeedback, logger).then(function (request) {
                return discussionIdea.create(req.user.id, request, req);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
