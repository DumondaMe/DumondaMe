'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const linkSearch = requireModel('link/search');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaSearchLink = {
    name: 'getSearchLink',
    type: 'object',
    additionalProperties: false,
    required: ['link'],
    properties: {
        link: {type: 'string', format: 'notEmptyString', maxLength: 2000}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateQueryRequest(req, schemaSearchLink, logger);
        let response = await linkSearch.search(params.link.trim());
        res.status(200).json(response);
    }));
};
