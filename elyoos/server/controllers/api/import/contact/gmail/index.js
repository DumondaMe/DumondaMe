'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let importGmail = requireModel('import/gmail/gmail');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaImportGmailContacts = {
    name: 'getGmailContacts',
    type: 'object',
    additionalProperties: false,
    required: ['code'],
    properties: {
        code: {type: 'string', format: 'notEmptyString', maxLength: 100}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when importing gmail contacts', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaImportGmailContacts, logger).then(function (request) {
                logger.info('Request import of gmail contacts', req);
                return importGmail.import(req.user.id, request, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
