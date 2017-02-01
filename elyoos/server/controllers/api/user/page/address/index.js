'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let deleteAddress = requireModel('user/page/delete/address');
let createAddress = requireModel('user/page/create/pageAddress');
let editAddress = requireModel('user/page/edit/pageAddress');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaManagePageAddress = {
    name: 'managePageEvent',
    type: 'object',
    additionalProperties: false,
    properties: {
        create: {
            type: 'object',
            additionalProperties: false,
            required: ['genericPageId', 'address', 'lat', 'lng'],
            properties: {
                genericPageId: {type: 'string', format: 'id', maxLength: 50},
                address: {type: 'string', format: 'notEmptyString', maxLength: 500},
                description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                lat: {type: 'number'},
                lng: {type: 'number'}
            }
        }, edit: {
            type: 'object',
            additionalProperties: false,
            required: ['address', 'lat', 'lng'],
            properties: {
                addressId: {type: 'string', format: 'id', maxLength: 50},
                address: {type: 'string', format: 'notEmptyString', maxLength: 500},
                description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                lat: {type: 'number'},
                lng: {type: 'number'}
            }
        }
    }
};

let schemaDeleteAddress = {
    name: 'deleteAddress',
    type: 'object',
    additionalProperties: false,
    required: ['addressId'],
    properties: {
        addressId: {type: 'string', format: 'id', maxLength: 50}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs managing a page address', req, res, logger, function () {
            return validation.validateRequest(req, schemaManagePageAddress, logger).then(function (request) {
                if (request.hasOwnProperty('create')) {
                    return createAddress.createAddress(req.user.id, request.create, req);
                } else if (request.hasOwnProperty('edit')) {
                    return editAddress.editAddress(req.user.id, request.edit, req);
                }
                return exceptions.getInvalidOperation(`Invalid request`, logger, req);
            }).then(function (recommendation) {
                res.status(200).json(recommendation);
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting an address', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteAddress, logger).then(function (request) {
                return deleteAddress.deleteAddress(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
