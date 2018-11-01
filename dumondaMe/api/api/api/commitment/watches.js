'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const watches = requireModel('commitment/watches');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const apiHelper = require('dumonda-me-server-lib').apiHelper;

const schemaGetWatchesOfCommitment = {
    name: 'getWatchesOfCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['id', 'page'],
    properties: {
        id: {type: 'string', format: 'notEmptyString', maxLength: 60},
        page: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetWatchesOfCommitment);
        let userId = apiHelper.getUserId(req);
        let response = await watches.getUserWatchesCommitment(userId, params.id, params.page);
        res.status(200).json(response);
    }));
};
