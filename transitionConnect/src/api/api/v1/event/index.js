'use strict';

let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let exportEvents = requireModel('event/export/index');
let modifiedEvent = requireModel('event/import/modifiedEvent');
let createEvent = requireModel('event/import/createEvent');
let deleteEvent = requireModel('event/import/deleteEvent');
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

let schemaCreateEvent = {
    name: 'createEvent',
    type: 'object',
    additionalProperties: false,
    required: ['orgId', 'iCal'],
    properties: {
        orgId: {type: 'string', format: 'notEmptyString', maxLength: 100},
        iCal: {type: 'string', format: 'notEmptyString', maxLength: 100000}
    }
};

let schemaModifyEvent = {
    name: 'modifyEvent',
    type: 'object',
    additionalProperties: false,
    required: ['uid', 'iCal'],
    properties: {
        uid: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        iCal: {type: 'string', format: 'notEmptyString', maxLength: 100000}
    }
};

let schemaDeleteEvent = {
    name: 'modifyDelete',
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

    router.post('/', function (req, res) {

        return controllerErrors('Error occurs when create an event', req, res, logger, function () {

            return validation.validateRequest(req, schemaCreateEvent, logger).then(function (request) {
                logger.info(`Create event for organization ${request.orgId}`, req);
                return createEvent.importEvent(request.orgId, request.iCal, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.put('/:uid', function (req, res) {

        return controllerErrors('Error occurs when modify an event', req, res, logger, function () {

            return validation.validateRequest(req, schemaModifyEvent, logger).then(function (request) {
                logger.info(`Modify event ${request.uid}`, req);
                return modifiedEvent.importEvent(request.uid, request.iCal, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.delete('/:uid', function (req, res) {
        return controllerErrors('Error occurs deleting an event', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteEvent, logger).then(function (request) {
                logger.info(`Delete event ${request.uid}`, req);
                return deleteEvent.delete(request.uid, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
