'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let pinwall = requireModel('user/pinwall/pinwall');
let auth = require('elyoos-server-lib').auth;
let exceptions = require('elyoos-server-lib').exceptions;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaRequestUserPinwall = {
    name: 'getUserDetailsPinwall',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems', 'type'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        type: {enum: ['adminNewest', 'adminPopular', 'recommendation']},
    }
};

module.exports = function (router) {
    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting pinwall of user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestUserPinwall, logger)
                .then(function (request) {
                    logger.info("User requests pinwall of user " + request.userId, req);
                    if (request.userId !== req.user.id) {
                        if (request.type === 'adminPopular' || request.type === 'adminNewest') {
                            return pinwall.getPagesOfOtherUser(req.user.id, request);
                        } else if (request.type === 'recommendation') {
                            return pinwall.getRecommendationOfOtherUser(req.user.id, request, req);
                        }
                        return exceptions.getInvalidOperation(`Unknown request type ${request.type}`, logger, req);
                    } else {
                        return exceptions.getInvalidOperation("Users id and userId are the same", logger, req);
                    }
                })
                .then(function (pinwallResp) {
                    res.status(200).json(pinwallResp);
                });
        });
    });
};
