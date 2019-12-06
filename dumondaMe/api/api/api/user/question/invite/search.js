'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const search = requireModel('user/question/invite/search');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaSearchUsers = {
    name: 'searchUsers',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'email'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        email: {type: 'string', format: 'notEmptyString', maxLength: 255}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchUsers);
        let response = await search.search(params.email, params.questionId);
        res.status(200).json(response);
    }));
};
