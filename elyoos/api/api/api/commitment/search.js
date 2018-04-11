'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const searchCommitment = requireModel('commitment/search');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaSearchCommitment = {
    name: 'getSearchCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['query'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchCommitment, logger);
        let response = await searchCommitment.search(params.query);
        res.status(200).json(response);
    }));
};
