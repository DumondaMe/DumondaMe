'use strict';

let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let importModifiedOrganization = requireModel('organization/import/modifiedOrg');
let importNewOrganization = requireModel('organization/import/newOrg');
let deleteOrganization = requireModel('organization/import/deleteOrg');
let exportOrganizations = requireModel('organization/export/index');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let topic = require("../../../schema/topic");

let schemaGetListOrganizations = {
    name: 'getListOrganizations',
    type: 'object',
    additionalProperties: false,
    required: ['skip'],
    properties: {
        skip: {type: 'integer',}
    }
};

let schemaGetOrganization = {
    name: 'getOrganization',
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 1000}
    }
};

let locations = {
    type: 'array',
    items: {
        type: 'object',
        additionalProperties: false,
        required: ['address', 'description', 'geo'],
        properties: {
            address: {type: 'string', format: 'notEmptyString', maxLength: 1000},
            description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
            geo: {
                type: 'object',
                additionalProperties: false,
                required: ['latitude', 'longitude'],
                properties: {
                    latitude: {type: 'number'},
                    longitude: {type: 'number'}
                }
            }
        }
    },
    maxItems: 200,
    uniqueItems: false
};

let schemaCreateOrganization = {
    name: 'createOrganizations',
    type: 'object',
    additionalProperties: false,
    required: ['uuid', 'name', 'description', 'categories', 'admins'],
    properties: {
        uuid: {type: 'string', format: 'notEmptyString', maxLength: 70},
        name: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
        slogan: {type: 'string', format: 'string', maxLength: 500},
        website: {type: 'string', format: 'string', maxLength: 1000},
        categories: topic.topicMultiple,
        admins: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 30},
            minItems: 1,
            maxItems: 50,
            uniqueItems: true
        },
        locations: locations
    }
};

let schemaModifyOrganization = {
    name: 'modifyOrganizations',
    type: 'object',
    additionalProperties: false,
    required: ['id', 'name', 'description', 'categories'],
    properties: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 70},
        name: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
        slogan: {type: 'string', format: 'string', maxLength: 500},
        website: {type: 'string', format: 'string', maxLength: 1000},
        categories: topic.topicMultiple,
        locations: locations
    }
};

let schemaDeleteOrganization = {
    name: 'deleteOrganization',
    type: 'object',
    additionalProperties: false,
    required: ['id'],
    properties: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 70},
    }
};

module.exports = function (router) {

    router.get('/', function (req, res) {
        return controllerErrors('Error occurs when getting organisation list', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetListOrganizations, logger).then(function (request) {
                logger.info("Get list of organisations exported to tc", req);
                return exportOrganizations.getListOrganisations(request.skip);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.get('/:id', function (req, res) {
        return controllerErrors('Error occurs when getting organisation detail', req, res, logger, function () {

            return validation.validateParams(req, schemaGetOrganization, logger).then(function (request) {
                logger.info(`Export of organisation ${request.id}`, req);
                return exportOrganizations.exportOrganisation(request.id, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.post('/', function (req, res) {
        return controllerErrors('Error occurs importing new organization', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateOrganization, logger).then(function (request) {
                logger.info(`Import new organization from tc`, req);
                return importNewOrganization.import(request, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });

    router.put('/:id', function (req, res) {
        return controllerErrors('Error occurs changing organization data', req, res, logger, function () {
            return validation.validateRequest(req, schemaModifyOrganization, logger).then(function (request) {
                logger.info(`Import changed organization ${request.id} from tc`, req);
                return importModifiedOrganization.import(request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });

    router.delete('/:id', function (req, res) {
        return controllerErrors('Error occurs deleting an organization', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteOrganization, logger).then(function (request) {
                logger.info(`Delete organization ${request.id}`, req);
                return deleteOrganization.delete(request.id, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
