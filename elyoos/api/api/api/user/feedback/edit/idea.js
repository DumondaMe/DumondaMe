'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let edit = requireModel('feedback/edit/idea');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaEditFeedback = {
    name: 'editIdeaFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description', 'feedbackId'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs edit a idea feedback', req, res, logger, function () {
            return validation.validateRequest(req, schemaEditFeedback, logger).then(function (request) {
                return edit.edit(req.user.id, request, req);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
