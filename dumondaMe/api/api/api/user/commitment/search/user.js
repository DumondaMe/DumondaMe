'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const search = requireModel('user/commitment/search/user');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaSearchUsers = {
    name: 'searchUsers',
    type: 'object',
    additionalProperties: false,
    required: ['query', 'commitmentId', 'skip', 'limit'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 255},
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        skip: {type: 'integer', minimum: 0},
        limit: {type: 'integer', minimum: 1, maximum: 50}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchUsers);
        let response = await search.search(params.query, params.commitmentId, req.user.id, params.skip, params.limit);
        res.status(200).json(response);
    }));
};
