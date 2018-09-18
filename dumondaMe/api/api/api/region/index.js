'use strict';

const region = requireModel('region/region');
const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetRegions = {
    name: 'getRegions',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetRegions, logger);
        let response = await region.getRegions(params.language);
        res.status(200).json(response);
    }));
};