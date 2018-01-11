'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let edit = requireModel('feedback/edit/bug');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaEditFeedback = {
    name: 'editBugFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description', 'screen', 'browser', 'operatingSystem', 'feedbackId'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        screen: {enum: ['desktop', 'tablet', 'mobile', 'all']},
        browser: {enum: ['ie', 'firefox', 'chrome', 'safari', 'other']},
        operatingSystem: {enum: ['windows', 'macOs', 'linux', 'other']},
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs edit a bug feedback', req, res, logger, function () {
            return validation.validateRequest(req, schemaEditFeedback, logger).then(function (request) {
                return edit.edit(req.user.id, request, req);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
