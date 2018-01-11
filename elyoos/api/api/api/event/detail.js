'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let detail = requireModel('event/detail');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetDetailEventsPages = {
    name: 'getDetailEvents',
    type: 'object',
    additionalProperties: false,
    required: ['eventId'],
    properties: {
        eventId: {type: 'string', format: 'id', maxLength: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting event detail', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetDetailEventsPages, logger).then(function (request) {
                logger.info('Request event detail', req);
                return detail.getDetail(req.user.id, request);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
