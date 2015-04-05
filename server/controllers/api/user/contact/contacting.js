'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    contacting = require('./../../../../models/contact/contacting'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    logger = requireLogger.getLogger(__filename);

var schemaRequestConnecting = {
    name: 'requestContacting',
    type: 'object',
    additionalProperties: false,
    required: ['itemsPerPage', 'skip'],
    properties: {
        itemsPerPage: {type: 'integer', minimum: 1, maximum: 50},
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return validation.validateQueryRequest(req, schemaRequestConnecting, logger).then(function (request) {
            return contacting.getContacting(req.user.id, request.itemsPerPage, req.query.skip);
        }).then(function (users) {
            res.status(200).json(users);
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error when getting contacting information', {error: err}, req);
            res.status(500).end();
        });
    });
};
