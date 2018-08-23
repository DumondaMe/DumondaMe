'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const overview = requireModel('topic/overview');
const editTopic = requireModel('topic/edit');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require("../schema/language");


const schemaGetTopicsOverview = {
    name: 'getTopicOverview',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language
    }
};

const schemaEditTopic = {
    name: 'editTopics',
    type: 'object',
    additionalProperties: false,
    required: ['topicId', 'de', 'en'],
    properties: {
        parentTopicId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        topicId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        de: {type: 'string', format: 'notEmptyString', maxLength: 80},
        en: {type: 'string', format: 'notEmptyString', maxLength: 80},
        similarDe: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 80},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        },
        similarEn: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 80},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetTopicsOverview, logger);
        logger.info("User requests topic overview", req);
        const response = await overview.getOverview(params);
        res.status(200).json(response);
    }));

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditTopic, logger);
        logger.info(`Edit of topic`, req);
        await editTopic.edit(params, req);
        res.status(200).end();
    }));
};
