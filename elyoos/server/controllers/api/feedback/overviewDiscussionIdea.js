'use strict';

var auth = requireLib('auth');
var logger = requireLogger.getLogger(__filename);
var discussionIdeaOverview = requireModel('feedback/overviewDiscussionIdea');
var controllerErrors = requireLib('error/controllerErrors');
var validation = requireLib('jsonValidation');

var schemaGetDiscussionIdeaOverview = {
    name: 'getFeedbackDiscussionIdeaOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'discussionId'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
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
