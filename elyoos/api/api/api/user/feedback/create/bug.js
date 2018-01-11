'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let bug = requireModel('feedback/create/bug');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaCreateFeedback = {
    name: 'createBugFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description', 'screen', 'browser', 'operatingSystem'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        screen: {enum: ['desktop', 'tablet', 'mobile', 'all']},
        browser: {enum: ['ie', 'firefox', 'chrome', 'safari', 'other']},
        operatingSystem: {enum: ['windows', 'macOs', 'linux', 'other']}
    }

};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs creating a new bug', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateFeedback, logger).then(function (request) {
                return bug.create(req.user.id, request);
            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
