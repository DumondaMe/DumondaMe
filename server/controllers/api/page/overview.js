'use strict';

var validation = require('./../../../lib/jsonValidation');
var pageRecommendation = require('./../../../models/page/pageRecommendation');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var language = require("../../schema/language");
var topic = require("../../schema/topic");
var pageType = require("../../schema/pageType");
var logger = requireLogger.getLogger(__filename);

var schemaGetPage = {
    name: 'getPage',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'onlyFollow', 'language', 'ordered'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        onlyFollow: {type: 'boolean'},
        language: language.languageMultiple,
        ordered: {enum: ['newest', 'popular'],
        topic: topic.topicMultiple,
        pageType: pageType.typeMultiple}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs when getting page overview', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPage, logger).then(function (request) {
                logger.info('Request page overview', req);
                return pageRecommendation.getPopularPages(req.user.id, request.skip, request.maxItems, request.onlyContacts, request.category);
            }).then(function (page) {
                res.status(200).json(page);
            });
        });
    });
};
