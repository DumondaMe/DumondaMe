'use strict';

var validation = require('./../../../../../common/src/lib/jsonValidation'),
    contacting = require('./../../../../models/contact/contacting'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../../common/src/lib/error/exceptions'),
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

        if (req.query.itemsPerPage && req.query.skip) {
            req.query.itemsPerPage = parseInt(req.query.itemsPerPage, 10);
            req.query.skip = parseInt(req.query.skip, 10);
        }
        return validation.validateQueryRequest(req, schemaRequestConnecting, logger).then(function (request) {
            return contacting.getContacting(req.user.id, request.itemsPerPage, req.query.skip, req.session.cookie._expires);
        }).then(function (users) {
            var data = {};
            data.contactingUsers = users[0];
            data.numberOfContactingLastDay = users[1][0].count;
            data.numberOfContactingLastWeek = users[1][1].count;
            data.numberOfContactingLastMonth = users[1][2].count;
            data.numberOfAllContactings = users[1][3].count;
            res.status(200).json(data);
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error when getting contacting information', {error: err}, req);
            res.status(500).end();
        });
    });
};
