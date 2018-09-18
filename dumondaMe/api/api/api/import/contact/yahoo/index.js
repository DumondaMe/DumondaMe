'use strict';

let validation = require('dumonda-me-server-lib').jsonValidation;
let auth = require('dumonda-me-server-lib').auth;
let importYahoo = requireModel('import/yahoo/yahoo');
let controllerErrors = require('dumonda-me-server-lib').controllerErrors;
let logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

let schemaImportYahooContacts = {
    name: 'getYahooContacts',
    type: 'object',
    additionalProperties: false,
    required: ['code'],
    properties: {
        code: {type: 'string', format: 'notEmptyString', maxLength: 100}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when importing yahoo contacts', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaImportYahooContacts, logger).then(function (request) {
                logger.info('Request import of yahoo contacts', req);
                return importYahoo.import(req.user.id, request, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
