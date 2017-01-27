'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let overview = requireModel('page/event/eventOverview');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetPageEventOverview = {
    name: 'getPageEventOverview',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'skip', 'actual', 'maxItems'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        actual: {type: 'boolean'},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting a page event overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPageEventOverview, logger).then(function (request) {
                logger.info('Request page event overview', req);
                return overview.getEventOverview(req.user.id, request);
            }).then(function (pageReview) {
                res.status(200).json(pageReview);
            });
        });
    });
};
