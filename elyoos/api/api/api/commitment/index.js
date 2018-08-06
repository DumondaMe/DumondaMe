'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const commitment = requireModel('commitment/detail');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const apiHelper = require('elyoos-server-lib').apiHelper;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCommitmentDetail = {
    name: 'getCommitmentDetail',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'language'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        language: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCommitmentDetail, logger);
        let userId = apiHelper.getUserId(req);
        let response = await commitment.getDetail(userId, params.commitmentId, params.language);
        res.status(200).json(response);
    }));
};
