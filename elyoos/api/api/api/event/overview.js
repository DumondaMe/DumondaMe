'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let overview = requireModel('event/overview');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetOverviewEventsPages = {
    name: 'getOverviewEvents',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting event overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetOverviewEventsPages, logger).then(function (request) {
                logger.info('Request event overview', req);
                return overview.getOverview(req.user.id, request);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
