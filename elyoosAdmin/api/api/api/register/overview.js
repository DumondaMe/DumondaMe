'use strict';

let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let overview = requireModel('register/overview');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetRegisteredOverview = {
    name: 'getFeedbackRegisteredOverview',
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

        return controllerErrors('Error occurs when getting registered user overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetRegisteredOverview, logger).then(function (request) {
                logger.info("User requests feedback registered overview", req);
                return overview.getOverview(request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
