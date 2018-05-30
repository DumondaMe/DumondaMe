'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const create = requireModel('user/commitment/event/create');
const eventEdit = requireModel('user/commitment/event/edit');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateEvent = {
    name: 'createEvent',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'title', 'location', 'region', 'startDate', 'endDate'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        title: {type: 'string', format: 'notEmptyString', maxLength: 100},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        location: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        region: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        startDate: {type: 'integer'},
        endDate: {type: 'integer'},
        linkDescription: {type: 'string', format: 'urlWithProtocol', maxLength: 2000}
    }
};

const schemaEditEvent = {
    name: 'editEvent',
    type: 'object',
    additionalProperties: false,
    required: ['eventId', 'title', 'location', 'region', 'startDate', 'endDate'],
    properties: {
        eventId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        title: {type: 'string', format: 'notEmptyString', maxLength: 100},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        location: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        region: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        startDate: {type: 'integer'},
        endDate: {type: 'integer'},
        linkDescription: {type: 'string', format: 'urlWithProtocol', maxLength: 2000}
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
};
