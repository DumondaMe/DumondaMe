'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const searchCommitment = requireModel('commitment/search');
const schemaLanguage = require("../../schema/language");
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaSearchCommitment = {
    name: 'getSearchCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['query', 'lang'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 30},
        lang: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchCommitment, logger);
        let response = await searchCommitment.search(params.query, params.lang);
        res.status(200).json(response);
    }));
};
