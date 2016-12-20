'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let deleteDiscussion = requireModel('feedback/delete/discussion');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaDeleteDiscussion = {
    name: 'deleteDiscussion',
    type: 'object',
    additionalProperties: false,
    required: ['discussionId'],
    properties: {
        discussionId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs deleting a discussion', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteDiscussion, logger).then(function (request) {
                return deleteDiscussion.delete(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
