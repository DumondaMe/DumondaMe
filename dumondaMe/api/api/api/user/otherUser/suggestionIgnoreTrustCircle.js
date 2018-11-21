'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const auth = require('dumonda-me-server-lib').auth;
const suggestion = requireModel('user/otherUser/suggestion');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaGetUserSuggestionIgnoreTrustCircle = {
    name: 'getUserSuggestion',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'limit'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        limit: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let params = await validation.validateRequest(req, schemaGetUserSuggestionIgnoreTrustCircle);
        let response = await suggestion.getSuggestedUsersIgnoreTrustCircle(req.user.id, params.limit, params.skip);
        res.status(200).json(response);
    }));
};
