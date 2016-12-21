'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var password = requireModel('user/password/changePassword');
var auth = require('elyoos-server-lib').auth;
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

var schemaChangePasword = {
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
