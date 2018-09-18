'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const topic = require("../../../../schema/topic");
const changeTopic = requireModel('user/question/topic/change');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaChangeTopic = {
    name: 'changeTopic',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'topics'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        topics: topic.topics
    }
};

module.exports = function (router) {

    router.put('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaChangeTopic, logger);
        await changeTopic.changeTopics(req.user.id, params.questionId, params.topics);
        res.status(200).end();
    }));
};
