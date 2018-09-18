'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const linkSearch = requireModel('link/search');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaSearchLink = {
    name: 'getSearchLink',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'link'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        link: {type: 'string', format: 'notEmptyString', maxLength: 2000}
    }
};

module.exports = function (router) {

    router.get('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaSearchLink, logger);
        let response = await linkSearch.search(params.link.trim(), params.questionId);
        res.status(200).json(response);
    }));
};
