'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const commitment = requireModel('commitment/detail');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const apiHelper = require('dumonda-me-server-lib').apiHelper;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaCommitmentDetail = {
    name: 'getCommitmentDetail',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'language'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 60},
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
