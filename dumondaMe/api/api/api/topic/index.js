'use strict';

const topic = requireModel('topic/topic');
const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaGetTopics = {
    name: 'getTopics',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language,
        onlyMainTopics: {type: 'boolean'}
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetTopics);
        let response = await topic.getTopics(params.language, params.onlyMainTopics);
        res.status(200).json(response);
    }));
};
