'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const topic = require("../../../../schema/topic");
const changeTopic = requireModel('user/commitment/topic/change');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaChangeTopic = {
    name: 'changeTopic',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'topics'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        topics: topic.topics
    }
};

module.exports = function (router) {

    router.put('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaChangeTopic, logger);
        await changeTopic.changeTopics(req.user.id, params.answerId, params.topics);
        res.status(200).end();
    }));
};
