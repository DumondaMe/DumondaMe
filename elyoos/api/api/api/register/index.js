'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let registerUser = requireModel('register/registerUser');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaRegisterUser = {
    name: 'registerUser',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname', 'email', 'password', 'response'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255},
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 40},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 60},
        password: {type: 'string', format: 'notEmptyString', maxLength: 55, minLength: 8},
        response: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 3000},
    }
};

module.exports = function (router) {

    router.post('/', function (req, res) {

        return controllerErrors('Error occurs when register a new user', req, res, logger, function () {
            return validation.validateRequest(req, schemaRegisterUser, logger).then(function (request) {
                logger.info('Register new user with email ' + request.email, req);
                return registerUser.registerUser(request, req);
            }).then(function (userId) {
                res.status(200).json(userId);
            });
        });
    });
};
