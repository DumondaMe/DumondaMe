'use strict';

var validation = requireLib('jsonValidation');
var registerUser = requireModel('register/registerUser');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

var schemaRegisterUser = {
    name: 'registerUser',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname', 'email', 'birthday', 'password', 'country', 'female', 'response'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255},
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 40},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 60},
        birthday: {type: 'integer'},
        country: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50},
        female: {type: 'boolean'},
        password: {type: 'string', format: 'notEmptyString', maxLength: 55, minLength: 8},
        street: {type: 'string', maxLength: 80},
        place: {type: 'string', maxLength: 80},
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
