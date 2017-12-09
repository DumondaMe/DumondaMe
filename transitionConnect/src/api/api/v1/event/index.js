'use strict';

let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let exportEvents = requireModel('event/export/index');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetListEvents = {
    name: 'getListEvents',
    type: 'object',
    additionalProperties: false,
    required: ['skip'],
    properties: {
        skip: {type: 'integer',}
    }
};

let schemaGetEvent = {
    name: 'getEvent',
    type: 'object',
    additionalProperties: false,
    required: ['uid'],
    properties: {
        uid: {type: 'string', format: 'notEmptyString', maxLength: 1000}
    }
};

module.exports = function (router) {

    router.get('/', function (req, res) {

        return controllerErrors('Error occurs when getting event list', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetListEvents, logger).then(function (request) {
                logger.info("Get list of events exported to tc", req);
                return exportEvents.getListEvents(request.skip);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.get('/:uid', function (req, res) {

        return controllerErrors('Error occurs when getting event detail', req, res, logger, function () {

            return validation.validateParams(req, schemaGetEvent, logger).then(function (request) {
                logger.info(`Export of event ${request.uid}`, req);
                return exportEvents.exportEvent(request.uid, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
