'use strict';

const topic = requireModel('topic/topic');
const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetTopics = {
    name: 'getTopics',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetTopics, logger);
        let response = await topic.getTopics(params.language);
        res.status(200).json(response);
    }));
};
