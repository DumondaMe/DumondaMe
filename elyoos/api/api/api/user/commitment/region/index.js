'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const changeRegion = requireModel('user/commitment/region/change');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaChangeRegion = {
    name: 'changeRegion',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'regions'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        regions: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 30},
            minItems: 1,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.put('/:commitmentId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaChangeRegion, logger);
        await changeRegion.changeRegions(req.user.id, params.commitmentId, params.regions);
        res.status(200).end();
    }));
};
