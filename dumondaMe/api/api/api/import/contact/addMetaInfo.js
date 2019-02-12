'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const auth = require('dumonda-me-server-lib').auth;
const importContacts = requireModel('import');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaImportGmailContacts = {
    name: 'importAddMetaData',
    type: 'object',
    additionalProperties: false,
    required: ['emails'],
    properties: {
        emails: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 10000,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaImportGmailContacts);
        let page = await importContacts.addMetaData(req.user.id, request.emails);
        res.status(200).json(page);
    }));
};
