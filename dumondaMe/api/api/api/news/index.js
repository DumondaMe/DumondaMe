'use strict';

let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let overview = requireModel('news/overview');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaGetNewsOverview = {
    name: 'getNewsOverview',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', function (req, res) {

        return controllerErrors('Error occurs when getting news overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetNewsOverview, logger).then(function (request) {
                logger.info("User requests news overview", req);
                return overview.getOverview(request);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};