'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const commitment = requireModel('commitment/detail');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const apiHelper = require('elyoos-server-lib').apiHelper;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCommitmentDetail = {
    name: 'getCommitmentDetail',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCommitmentDetail, logger);
        let userId = apiHelper.getUserId(req);
        let response = await commitment.getDetail(userId, params.answerId);
        res.status(200).json(response);
    }));
};
