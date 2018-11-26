'use strict';
const auth = require('dumonda-me-server-lib').auth;
const topics = requireModel('user/setting/topics');
const validation = require('dumonda-me-server-lib').jsonValidation;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaChangeTopicUserInterested = {
    name: 'changeTopicUserInterested',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        topics: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 255},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaChangeTopicUserInterested);
        await topics.changeTopicsSettings(req.user.id, request.topics);
        res.status(200).end();
    }));
};
