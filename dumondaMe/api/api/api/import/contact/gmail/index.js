'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const auth = require('dumonda-me-server-lib').auth;
const importGmail = requireModel('import/gmail/gmail');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaImportGmailContacts = {
    name: 'getGmailContacts',
    type: 'object',
    additionalProperties: false,
    required: ['code'],
    properties: {
        code: {type: 'string', format: 'notEmptyString', maxLength: 100}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaImportGmailContacts);
        let page = await importGmail.import(req.user.id, request, req);
        res.status(200).json(page);
    }));
};
