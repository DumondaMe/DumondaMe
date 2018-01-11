'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let idea = requireModel('feedback/create/idea');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaCreateFeedback = {
    name: 'createIdeaFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs creating a new idea', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateFeedback, logger).then(function (request) {
                return idea.create(req.user.id, request);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
