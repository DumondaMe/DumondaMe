'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const watches = requireModel('commitment/watches');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const apiHelper = require('elyoos-server-lib').apiHelper;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetWatchesOfCommitment = {
    name: 'getWatchesOfCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'page'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        page: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetWatchesOfCommitment, logger);
        let userId = apiHelper.getUserId(req);
        let response = await watches.getUserWatchesCommitment(userId, params.commitmentId, params.page);
        res.status(200).json(response);
    }));
};
