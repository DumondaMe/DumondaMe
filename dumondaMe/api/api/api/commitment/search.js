'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const searchCommitment = requireModel('commitment/search');
const schemaLanguage = require("../../schema/language");
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaSearchCommitment = {
    name: 'getSearchCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['query'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 255},
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        lang: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchCommitment, logger);
        let response = await searchCommitment.search(params.query, params.lang, params.questionId);
        res.status(200).json(response);
    }));
};
