'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const upVotes = requireModel('question/answer/upVotes');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const apiHelper = require('elyoos-server-lib').apiHelper;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetUpVotesOfAnswer = {
    name: 'getUpVotesOfAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'page'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        page: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaGetUpVotesOfAnswer, logger);
        let userId = apiHelper.getUserId(req);
        let response = await upVotes.getUpVotes(userId, params.answerId, params.page);
        res.status(200).json(response);
    }));
};
