'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const search = requireModel('search/index');
const schemaLanguage = require("../../schema/language");
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaSearch = {
    name: 'getSearch',
    type: 'object',
    additionalProperties: false,
    required: ['query', 'lang'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 255},
        lang: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearch, logger);
        let response = await search.search(params.query, params.lang, req.user.id);
        res.status(200).json(response);
    }));
};
