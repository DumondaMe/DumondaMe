'use strict';

let validation = requireLib('jsonValidation');
let deleteFeedback = requireModel('feedback/delete');
let auth = requireLib('auth');
let controllerErrors = requireLib('error/controllerErrors');
let logger = requireLogger.getLogger(__filename);

let schemaDeleteFeedback = {
    name: 'deleteFeedback',
    type: 'object',
    additionalProperties: false,
    required: ['feedbackId'],
    properties: {
        feedbackId: {type: 'string', format: 'notEmptyString', maxLength: 50}
    }
};

module.exports = function (router) {

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a feedback', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteFeedback, logger).then(function (request) {
                return deleteFeedback.delete(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
