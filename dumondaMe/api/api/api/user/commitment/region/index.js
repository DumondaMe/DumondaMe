'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const changeRegion = requireModel('user/commitment/region/change');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaChangeRegion = {
    name: 'changeRegion',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'regions'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        regions: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 60},
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
