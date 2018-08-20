'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const auth = require('elyoos-server-lib').auth;
const schemaLanguage = require('../../../schema/language');
const feed = requireModel('user/feed/activity');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const time = require('elyoos-server-lib').time;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetActivityFeed = {
    name: 'getActivityFeed',
    type: 'object',
    additionalProperties: false,
    required: ['guiLanguage', 'languages'],
    properties: {
        guiLanguage: schemaLanguage.language,
        languages: schemaLanguage.languageMultiple,
        page: {type: 'integer', minimum: 0},
        timestamp: {type: 'integer', minimum: 0},
        typeFilter: {enum: ['Book', 'Text', 'Video', 'Link', 'Commitment']},
        trustCircle: {type: 'integer', minimum: 1, maximum: 3},
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
        },
        showInterested: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateQueryRequest(req, schemaGetActivityFeed, logger);
        params.page = params.page || 0;
        params.timestamp = params.timestamp || time.getNowUtcTimestamp();
        let response = await feed.getFeed(req.user.id, params.page, params.timestamp, params.typeFilter,
            params.guiLanguage, params.languages, params.trustCircle, params.topics, params.regions,
            params.showInterested);
        res.status(200).json(response);
    }));
};
