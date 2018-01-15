'use strict';
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let rate = requireModel('forum/answer/rate');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaRateAnswer = {
    name: 'rateForumAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when rating a forum answer', req, res, logger, function () {
            return validation.validateRequest(req, schemaRateAnswer, logger).then(function (request) {
                logger.info("User rates a forum answer", req);
                return rate.ratePositive(req.user.id, request.answerId, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when deleting rating of a forum answer', req, res, logger, function () {
            return validation.validateRequest(req, schemaRateAnswer, logger).then(function (request) {
                return rate.deleteRating(req.user.id, request.answerId, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};