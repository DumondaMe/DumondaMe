'use strict';

let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let importOrganizations = requireModel('organization/import/index');
let exportOrganizations = requireModel('organization/export/index');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let topic = require("../../../../../../elyoos/server/controllers/schema/topic");

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

let schemaModifyOrganization = {
    name: 'changeOrganizations',
    type: 'object',
    additionalProperties: false,
    required: ['organizations'],
    properties: {
        organizations: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['uuid', 'name', 'description', 'language', 'categories'],
                properties: {
                    uuid: {type: 'string', format: 'notEmptyString', maxLength: 70},
                    name: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                    description: {type: 'string', format: 'notEmptyString', maxLength: 10000},
                    slogan: {type: 'string', format: 'string', maxLength: 500},
                    language: {enum: ['de', 'fr', 'en']},
                    website: {type: 'string', format: 'sring', maxLength: 1000},
                    categories: topic.topicMultiple
                }
            },
            minItems: 1,
            maxItems: 1000,
            uniqueItems: true
        }
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

    router.put('/', function (req, res) {

        return controllerErrors('Error occurs change organization data', req, res, logger, function () {
            return validation.validateRequest(req, schemaModifyOrganization, logger).then(function (request) {
                logger.info(`Import of changed organizations`, req);
                return importOrganizations.importOrganizations(request.organizations, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
