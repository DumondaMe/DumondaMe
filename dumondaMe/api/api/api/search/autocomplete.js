'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const autocomplete = requireModel('search/autocomplete');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaAutocomplete = {
    name: 'getAutocomplete',
    type: 'object',
    additionalProperties: false,
    required: ['query'],
    properties: {
        query: {type: 'string', format: 'notEmptyString', maxLength: 255}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaAutocomplete, logger);
        let response = await autocomplete.search(params.query);
        res.status(200).json(response);
    }));
};
