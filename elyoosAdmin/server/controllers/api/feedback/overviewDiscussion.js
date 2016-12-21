'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let overview = requireModel('feedback/overviewDiscussion');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetFeedbackDiscussionOverview = {
    name: 'getFeedbackDiscussionOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'discussionId', 'order'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        discussionId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        order: {enum: ['rated', 'newestModification']}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting discussion overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetFeedbackDiscussionOverview, logger).then(function (request) {
                logger.info("User requests discussion overview", req);
                return overview.getOverview(request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
