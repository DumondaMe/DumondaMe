'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let pinwall = requireModel('user/pinwall/pinwall');
let language = require("../../../schema/language");
let topic = require("../../../schema/topic");
let pageType = require("../../../schema/pageType");
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetUserHomePinwallInfos = {
    name: 'getHomeInfos',
    type: 'object',
    additionalProperties: false,
    required: ['skipBlog', 'skipRecommendation', 'maxItems', 'onlyContact', 'order'],
    properties: {
        skipBlog: {type: 'integer', minimum: 0},
        skipRecommendation: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        onlyContact: {type: 'boolean'},
        order: {enum: ['new', 'popular', 'suggestPage']},
        language: language.languageMultiple,
        topic: topic.topicMultiple,
        pageType: pageType.typeMultiple
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting users home infos', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetUserHomePinwallInfos, logger).then(function (request) {
                logger.info('Request home of user', req);
                return pinwall.getPinwall(req.user.id, request, req);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
