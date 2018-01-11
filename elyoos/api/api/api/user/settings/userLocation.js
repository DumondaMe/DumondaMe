'use strict';

let userLocation = requireModel('user/setting/userLocation');
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaPostUserLocation = {
    name: 'userLocation',
    type: 'object',
    additionalProperties: false,
    required: ['description', 'latitude', 'longitude'],
    properties: {
        description: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 1000},
        latitude: {type: 'number'},
        longitude: {type: 'number'}
    }
};

let schemaDeleteUserLocation = {
    name: 'deleteUserLocation',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {}
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Setting user location failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaPostUserLocation, logger).then(function (request) {
                return userLocation.setUserLocation(req.user.id, request);
            }).then(function () {
                logger.info("User updated user location", req);
                res.status(200).end();
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting user location', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteUserLocation, logger).then(function (request) {
                return userLocation.deleteUserLocation(req.user.id, request.contactIds, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
