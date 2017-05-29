'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let page = requireModel('recommendation/similarPages');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetSimilarPage = {
    name: 'getSimilarPage',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'pageId'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        pageId: {type: 'string', format: 'id', maxLength: 30},
    }
};


module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting similar pages', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetSimilarPage, logger).then(function (request) {
                return page.getSimilarPages(req.user.id, request);
            }).then(function (suggestion) {
                res.status(200).json(suggestion);
            });
        });
    });
};
