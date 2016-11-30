'use strict';

var validation = requireLib('jsonValidation');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var popularPlaces= requireModel('recommendation/popularPlaces');
var logger = requireLogger.getLogger(__filename);

var schemaGetPopularPlace = {
    name: 'getPopularPlace',
    type: 'object',
    additionalProperties: false,
    required: ['skip', 'maxItems', 'centerLat', 'centerLng', 'radius'],
    properties: {
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        centerLat: {type: 'number'},
        centerLng: {type: 'number'},
        radius: {type: 'number'}, //[km]
    }
};


module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting popular place', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetPopularPlace, logger).then(function (request) {
                return popularPlaces.getPopularPlaces(req.user.id, request);
            }).then(function (suggestion) {
                res.status(200).json(suggestion);
            });
        });
    });
};
