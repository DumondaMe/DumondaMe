'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const auth = require('dumonda-me-server-lib').auth;
const importWebde = requireModel('import/webDe/webDe');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaImportWebDeContacts = {
    name: 'getWebDeContacts',
    type: 'object',
    additionalProperties: false,
    required: ['username', 'password'],
    properties: {
        username: {type: 'string', format: 'notEmptyString', maxLength: 255},
        password: {type: 'string', format: 'notEmptyString', maxLength: 255}
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaImportWebDeContacts);
        let page = await importWebde.import(req.user.id, request, req);
        res.status(200).json(page);
    }));
};
