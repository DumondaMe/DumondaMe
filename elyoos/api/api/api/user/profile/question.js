'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const question = requireModel('user/profile/question');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaRequestGetQuestion = {
    name: 'getProfileQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'skip', 'maxItems', 'isWatching'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        skip: {type: 'integer', minimum: 0},
        maxItems: {type: 'integer', minimum: 1, maximum: 50},
        isWatching: {type: 'boolean'}
    }
};

module.exports = function (router) {
    router.get('/', asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaRequestGetQuestion, logger);
        logger.info(`Requests question of user ${request.userId}`, req);
        let questions = await question.getQuestion(req.user.id, request.userId,
            request.maxItems, request.skip, request.isWatching, req);
        res.status(200).json(questions);
    }));
};
