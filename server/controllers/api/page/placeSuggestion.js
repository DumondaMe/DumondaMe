'use strict';

var validation = require('./../../../lib/jsonValidation');
var auth = require('./../../../lib/auth');
var controllerErrors = require('./../../../lib/error/controllerErrors');
var placeSuggestion = require('./../../../models/page/placeSuggestion');
var logger = requireLogger.getLogger(__filename);

var schemaGetPlaceSuggestion = {
    name: 'getPlaceSuggestion',
    type: 'object',
    additionalProperties: false,
    required: ['place'],
    properties: {
        place: {type: 'string', format: 'notEmptyString', minLength: 3, maxLength: 150}
    }
};


module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting place suggestion', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPlaceSuggestion, logger).then(function (request) {
                return placeSuggestion.search(request.place);
            }).then(function (suggestion) {
                res.status(200).json(suggestion);
            });
        });
    });
};
