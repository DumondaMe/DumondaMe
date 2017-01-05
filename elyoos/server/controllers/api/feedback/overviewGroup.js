'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let feedbackGroupOverview = requireModel('feedback/overviewGroup');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetGroupOverview = {
    name: 'getFeedbackGroupOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'status', 'group'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        status: {enum: ['open', 'closed']},
        group: {enum: ['Bug', 'Idea', 'Discussion']}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting feedback group overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetGroupOverview, logger).then(function (request) {
                logger.info("User requests feedback group overview", req);
                return feedbackGroupOverview.getOverview(req.user.id, request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
