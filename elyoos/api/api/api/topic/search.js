'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const searchTopic = requireModel('topic/search');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
        const params = await validation.validateRequest(req, schemaSearchTopic, logger);
        let response = await searchTopic.search(params.query);
        res.status(200).json(response);
    }));
};
