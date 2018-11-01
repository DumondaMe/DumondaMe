'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const upVotes = requireModel('question/answer/upVotes');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const apiHelper = require('dumonda-me-server-lib').apiHelper;

const schemaGetUpVotesOfAnswer = {
    name: 'getUpVotesOfAnswer',
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
        const params = await validation.validateRequest(req, schemaGetUpVotesOfAnswer);
        let userId = apiHelper.getUserId(req);
        let response = await upVotes.getUpVotes(userId, params.id, params.page);
        res.status(200).json(response);
    }));
};
