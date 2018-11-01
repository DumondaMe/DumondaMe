'use strict';

const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const overview = requireModel('region/regions');
const editRegion = requireModel('region/edit');
const createRegion = requireModel('region/create');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require("../schema/language");


const schemaGetRegionsOverview = {
    name: 'getRegionsOverview',
    type: 'object',
    additionalProperties: false,
    required: ['parentRegionId', 'language'],
    properties: {
        parentRegionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        language: schemaLanguage.language
    }
};

const schemaCreateRegion = {
    name: 'createRegion',
    type: 'object',
    additionalProperties: false,
    required: ['parentRegionId', 'de', 'en'],
    properties: {
        parentRegionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        de: {type: 'string', format: 'notEmptyString', maxLength: 80},
        en: {type: 'string', format: 'notEmptyString', maxLength: 80}
    }
};

const schemaEditRegion = {
    name: 'editRegions',
    type: 'object',
    additionalProperties: false,
    required: ['parentRegionId', 'regionId', 'de', 'en'],
    properties: {
        parentRegionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        regionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        de: {type: 'string', format: 'notEmptyString', maxLength: 80},
        en: {type: 'string', format: 'notEmptyString', maxLength: 80}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetRegionsOverview);
        logger.info(`User requests region overview`, req);
        const response = await overview.getRegions(params.language, params.parentRegionId);
        res.status(200).json(response);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateRegion);
        logger.info(`Create new region`, req);
        let response = await createRegion.create(params, req);
        res.status(200).json(response);
    }));

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditRegion);
        logger.info(`Edit of region`, req);
        await editRegion.edit(params, req);
        res.status(200).end();
    }));
};
