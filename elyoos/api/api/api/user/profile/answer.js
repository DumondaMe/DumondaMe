'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require('../../../schema/language');
const answer = requireModel('user/profile/answer');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRequestGetAnswer = {
    name: 'getProfileAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems', 'upVoted', 'language'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        upVoted: {type: 'boolean'},
        language: schemaLanguage.language
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestGetAnswer, logger);
        logger.info(`Requests answer of user ${request.userId}`, req);
        let answers = await answer.getAnswer(req.user.id, request.userId,
            request.maxItems, request.skip, request.upVoted, request.language, req);
        res.status(200).json(answers);
    }));
};
