'use strict';

var validation = require('./../../../lib/jsonValidation'),
    registerUser = require('./../../../models/user/registerUser'),
    auth = require('./../../../lib/auth'),
    exceptions = require('./../../../lib/error/exceptions'),
    controllerErrors = require('./../../../lib/error/controllerErrors'),
    logger = requireLogger.getLogger(__filename);

var schemaRegisterUser = {
    name: 'registerUser',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname', 'email', 'birthday', 'password', 'country', 'female'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255},
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50},
        birthday: {type: 'integer'},
        country: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50},
        female: {type: 'boolean'},
        password: {type: 'string', format: 'notEmptyString', maxLength: 55, minLength: 8}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when register a new user', req, res, logger, function () {
            return validation.validateRequest(req, schemaRegisterUser, logger).then(function (request) {
                if (req.user.id === '0') {
                    return registerUser.registerUser(request);
                }
                return exceptions.getInvalidOperation('Only user id 0 can register new user at the moment ' + req.user.id, logger);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
