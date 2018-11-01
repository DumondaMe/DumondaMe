'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const websitePreview = requireModel('commitment/websitePreview');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;

const schemaWebsitePreview = {
    name: 'getCommitmentWebsitePreview',
    type: 'object',
    additionalProperties: false,
    required: ['link'],
    properties: {
        link: {type: 'string', format: 'notEmptyString', maxLength: 2000}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWebsitePreview);
        let response = await websitePreview.getPreview(params.link.trim());
        res.status(200).json(response);
    }));
};
