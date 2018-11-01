'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const searchTopic = requireModel('topic/search');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaSearchTopic = {
    name: 'getSearchTopic',
    type: 'object',
    additionalProperties: false,
    required: ['query'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchTopic);
        let response = await searchTopic.search(params.query);
        res.status(200).json(response);
    }));
};
