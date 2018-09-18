'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let password = requireModel('user/password/changePassword');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaChangePasword = {
    name: 'changePassword',
    type: 'object',
    additionalProperties: false,
    required: ['newPassword', 'actualPassword'],
    properties: {
        actualPassword: {type: 'string', format: 'notEmptyString', maxLength: 55, minLength: 1},
        newPassword: {type: 'string', format: 'passwordString', maxLength: 55, minLength: 8}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when changing the password', req, res, logger, function () {
            return validation.validateRequest(req, schemaChangePasword, logger).then(function (request) {
                logger.info("User changes password", req);
                return password.changePassword(req.user.id, request.newPassword, request.actualPassword, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });

};
