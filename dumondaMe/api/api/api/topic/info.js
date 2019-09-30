'use strict';

const topic = requireModel('topic/topicInfo');
const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaGetTopics = {
    name: 'getTopicInfo',
    type: 'object',
    additionalProperties: false,
    required: ['language', 'topicIds'],
    properties: {
        language: schemaLanguage.language,
        topicIds: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 60},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetTopics);
        let response = await topic.getTopicsInfos(params.language, params.topicIds);
        res.status(200).json(response);
    }));
};
