'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const overview = requireModel('region/overview');
//const editRegions = requireModel('region/edit');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require("../schema/language");


const schemaGetRegionsOverview = {
    name: 'getRegionsOverview',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language
    }
};

const schemaEditRegions = {
    name: 'editRegions',
    type: 'object',
    additionalProperties: false,
    required: ['regionId', 'de', 'en'],
    properties: {
        parentRegionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        regionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        de: {type: 'string', format: 'notEmptyString', maxLength: 80},
        en: {type: 'string', format: 'notEmptyString', maxLength: 80}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetRegionsOverview, logger);
        logger.info(`User requests region overview`, req);
        const response = await overview.getOverview(params.language);
        res.status(200).json(response);
    }));

    /*router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditRegions, logger);
        logger.info(`Edit of region`, req);
        await editRegions.edit(params, req);
        res.status(200).end();
    }));*/
};
