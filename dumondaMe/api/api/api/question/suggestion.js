'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const suggestion = requireModel('question/suggestion');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaGetSuggestions = {
    name: 'getSuggestions',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'page'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        page: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetSuggestions);
        let response = await suggestion.getSuggestions(params.questionId, params.page, req.user.id, req.user.superUser);
        res.status(200).json(response);
    }));
};
