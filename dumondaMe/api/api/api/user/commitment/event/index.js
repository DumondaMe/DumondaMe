'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const create = requireModel('user/commitment/event/create');
const eventEdit = requireModel('user/commitment/event/edit');
const eventDelete = requireModel('user/commitment/event/delete');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaCreateEvent = {
    name: 'createEvent',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'title', 'location', 'regionId', 'startDate', 'endDate'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        title: {type: 'string', format: 'notEmptyString', maxLength: 100},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        location: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        regionId: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        startDate: {type: 'integer'},
        endDate: {type: 'integer'},
        linkDescription: {type: 'string', format: 'urlWithProtocol', maxLength: 2000}
    }
};

const schemaEditEvent = {
    name: 'editEvent',
    type: 'object',
    additionalProperties: false,
    required: ['eventId', 'title', 'location', 'regionId', 'startDate', 'endDate'],
    properties: {
        eventId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        title: {type: 'string', format: 'notEmptyString', maxLength: 100},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        location: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        regionId: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        startDate: {type: 'integer'},
        endDate: {type: 'integer'},
        linkDescription: {type: 'string', format: 'urlWithProtocol', maxLength: 2000}
    }
};

const schemaDeleteEvent = {
    name: 'deleteEvent',
    type: 'object',
    additionalProperties: false,
    required: ['eventId'],
    properties: {
        eventId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateEvent, logger);
        let response = await create.createEvent(req.user.id, params);
        res.status(200).json(response);
    }));

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditEvent, logger);
        await eventEdit.editEvent(req.user.id, params);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteEvent, logger);
        await eventDelete.deleteEvent(req.user.id, params.eventId);
        res.status(200).end();
    }));
};
