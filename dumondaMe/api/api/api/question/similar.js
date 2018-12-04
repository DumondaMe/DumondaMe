'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const similar = requireModel('question/similar');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaGetSuggestions = {
    name: 'getSuggestions',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'timestamp', 'skip', 'limit'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        timestamp: {type: 'integer'},
        skip: {type: 'integer', minimum: 0},
        limit: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetSuggestions);
        let response = await similar.getSimilarQuestions(params.questionId, params.timestamp, params.skip,
            params.limit);
        res.status(200).json(response);
    }));
};
