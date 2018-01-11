'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let discussionIdeaOverview = requireModel('feedback/overviewDiscussionIdea');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetDiscussionIdeaOverview = {
    name: 'getFeedbackDiscussionIdeaOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'status', 'discussionId'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        status: {enum: ['open', 'closed']},
        discussionId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting discussion idea overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetDiscussionIdeaOverview, logger).then(function (request) {
                logger.info("User requests feedback discussion idea overview", req);
                return discussionIdeaOverview.getOverview(req.user.id, request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
