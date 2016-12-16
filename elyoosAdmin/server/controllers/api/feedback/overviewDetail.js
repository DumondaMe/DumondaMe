'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let overview = requireModel('feedback/overviewDetail');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetFeedbackDetailOverview = {
    name: 'getFeedbackDetailOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'status', 'order'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        type: {enum: ['all', 'bug', 'idea', 'discussion']},
        status: {enum: ['open', 'closed']},
        order: {enum: ['created', 'newestModification']}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting feedback detail overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetFeedbackDetailOverview, logger).then(function (request) {
                logger.info("User requests feedback detail overview", req);
                return overview.getOverview(request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
