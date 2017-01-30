'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let deleteEvent = requireModel('user/page/delete/deleteEvent');
let createEvent = requireModel('user/page/create/pageEvent');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaCreatePageEvent = {
    name: 'createPageEvent',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description', 'genericPageId', 'startDate', 'endDate'],
    properties: {
        genericPageId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 2000},
        startDate: {type: 'integer'},
        endDate: {type: 'integer'},
        address: {
            type: 'object',
            additionalProperties: false,
            required: ['description', 'lat', 'lng'],
            properties: {
                description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                lat: {type: 'number'},
                lng: {type: 'number'}
            }
        },
        existingAddressId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

let schemaDeleteEvent = {
    name: 'deleteEvent',
    type: 'object',
    additionalProperties: false,
    required: ['eventId'],
    properties: {
        eventId: {type: 'string', format: 'id', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs creating a page event', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreatePageEvent, logger).then(function (request) {
                if (request.hasOwnProperty('address')) {
                    return createEvent.createEvent(req.user.id, request, req);
                } else if (request.hasOwnProperty('existingAddressId')) {
                    return createEvent.createEventWithExistingAddress(req.user.id, request, req);
                }
                return exceptions.getInvalidOperation(`Missing address or existingAddressId request`, logger, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting an event', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteEvent, logger).then(function (request) {
                return deleteEvent.deleteEvent(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
