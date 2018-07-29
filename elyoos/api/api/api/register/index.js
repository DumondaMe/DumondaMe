'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require("../../schema/language");
const registerUser = requireModel('register/registerUser');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRegisterUser = {
    name: 'registerUser',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname', 'email', 'language', 'password', 'response'],
    properties: {
        email: {type: 'string', format: 'email', minLength: 1, maxLength: 255},
        language: schemaLanguage.language,
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 40},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 60},
        password: {type: 'string', format: 'notEmptyString', maxLength: 55, minLength: 8},
        response: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 3000},
    }
};

module.exports = function (router) {

    router.post('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaRegisterUser, logger);
        logger.info('Register new user with email ' + params.email, req);
        await registerUser.registerUser(params, req);
        res.status(200).end();
    }));
};
