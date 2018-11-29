'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const password = requireModel('user/password/changePassword');
const auth = require('dumonda-me-server-lib').auth;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaChangePasword = {
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

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaChangePasword);
        await password.changePassword(req.user.id, request.newPassword, request.actualPassword, req);
        res.status(200).end();
    }));

    /*router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when changing the password', req, res, logger, function () {
            return validation.validateRequest(req, schemaChangePasword).then(function (request) {
                logger.info("User changes password", req);
                return password.changePassword(req.user.id, request.newPassword, request.actualPassword, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });*/

};
