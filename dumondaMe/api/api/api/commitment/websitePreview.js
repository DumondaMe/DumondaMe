'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const websitePreview = requireModel('commitment/websitePreview');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

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
        const params = await validation.validateRequest(req, schemaWebsitePreview, logger);
        let response = await websitePreview.getPreview(params.link.trim());
        res.status(200).json(response);
    }));
};
