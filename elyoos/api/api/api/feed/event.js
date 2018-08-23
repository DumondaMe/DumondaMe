'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const auth = require('elyoos-server-lib').auth;
const schemaLanguage = require('../../schema/language');
const feed = requireModel('user/feed/event');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetEventFeed = {
    name: 'getEventFeed',
    type: 'object',
    additionalProperties: false,
    required: ['guiLanguage', 'languages'],
    properties: {
        guiLanguage: schemaLanguage.language,
        languages: schemaLanguage.languageMultiple,
        page: {type: 'integer', minimum: 0},
        timestamp: {type: 'integer', minimum: 0},
        topics: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        },
        regions: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 1000,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateQueryRequest(req, schemaGetEventFeed, logger);
        params.page = params.page || 0;
        params.timestamp = params.timestamp || time.getNowUtcTimestamp();
        let response = await feed.getFeed(req.user.id, params.page, params.timestamp,
            params.guiLanguage, params.languages, null, params.topics, params.regions);
        res.status(200).json(response);
    }));
};
