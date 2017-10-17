'use strict';

let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;
let importOrganizations = requireModel('organization/import/index');
let exportOrganizations = requireModel('organization/export/index');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let topic = require("../../../../../elyoos/server/controllers/schema/topic");

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
                    slogan: {type: 'string', format: 'notEmptyString', maxLength: 500},
                    language: {enum: ['de', 'fr', 'en']},
                    website: {type: 'string', format: 'notEmptyString', maxLength: 1000},
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

        return controllerErrors('Error occurs when getting feedback detail', req, res, logger, function () {

            logger.info("Export of Organizations", req);
            return exportOrganizations.exportOrganizations().then(function (data) {
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
