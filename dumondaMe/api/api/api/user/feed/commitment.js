'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const auth = require('dumonda-me-server-lib').auth;
const schemaLanguage = require('../../../schema/language');
const feed = requireModel('user/feed/commitment');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaGetCommitmentFeed = {
    name: 'getCommitmentFeed',
    type: 'object',
    additionalProperties: false,
    required: ['guiLanguage', 'languages', 'order'],
    properties: {
        guiLanguage: schemaLanguage.language,
        languages: schemaLanguage.languageMultiple,
        order: {enum: ['mostPopular', 'newest', 'noQuestionLink']},
        periodOfTime: {enum: ['week', 'month']},
        page: {type: 'integer', minimum: 0},
        timestamp: {type: 'integer', minimum: 0},
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
        }
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateQueryRequest(req, schemaGetCommitmentFeed, logger);
        params.page = params.page || 0;
        params.timestamp = params.timestamp || time.getNowUtcTimestamp();
        let response = await feed.getFeed(req.user.id, params.page, params.timestamp, params.order, params.periodOfTime,
            params.guiLanguage, params.languages, params.trustCircle, params.topics, params.regions);
        res.status(200).json(response);
    }));
};
