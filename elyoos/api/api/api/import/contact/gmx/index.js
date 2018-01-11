'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let importGmx = requireModel('import/gmx/gmx');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaImportGmxContacts = {
    name: 'getGmxContacts',
    type: 'object',
    additionalProperties: false,
    required: ['username', 'password'],
    properties: {
        username: {type: 'string', format: 'notEmptyString', maxLength: 255},
        password: {type: 'string', format: 'notEmptyString', maxLength: 255}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when importing gmx contacts', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaImportGmxContacts, logger).then(function (request) {
                logger.info('Request import of gmx contacts', req);
                return importGmx.import(req.user.id, request, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
