'use strict';

var validation = require('./../../../../lib/jsonValidation'),
    password = require('./../../../../models/user/password'),
    auth = require('./../../../../lib/auth'),
    exceptions = require('./../../../../lib/error/exceptions'),
    logger = requireLogger.getLogger(__filename);

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

        return validation.validateRequest(req, schemaChangePasword, logger).then(function (request) {
            return password.changePassword(req.user.id, request.newPassword, request.actualPassword);
        }).then(function () {
            res.status(200).end();
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(exceptions.invalidOperation, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Error occurs when changing the password', {error: err}, req);
            res.status(500).end();
        });
    });

};
