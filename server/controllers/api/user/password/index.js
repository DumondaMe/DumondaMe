'use strict';

var validation = require('./../../../../lib/jsonValidation');
var password = require('./../../../../models/user/password');
var auth = require('./../../../../lib/auth');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

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
                return password.changePassword(req.user.id, request.newPassword, request.actualPassword);
            }).then(function () {
                res.status(200).end();
            });
        });
    });

};
