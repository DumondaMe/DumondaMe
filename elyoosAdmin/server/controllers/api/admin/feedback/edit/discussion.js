'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let editDiscussion = requireModel('feedback/edit/discussion');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaEditDiscussion = {
    name: 'editDiscussion',
    type: 'object',
    additionalProperties: false,
    required: ['discussionId', 'title', 'description'],
    properties: {
        discussionId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs edit discussion', req, res, logger, function () {
            return validation.validateRequest(req, schemaEditDiscussion, logger).then(function (request) {
                return editDiscussion.edit(req.user.id, request, req);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
