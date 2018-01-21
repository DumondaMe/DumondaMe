'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const feed = requireModel('feeds/question');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetQuestionFeed = {
    name: 'getQuestionFeed',
    type: 'object',
    additionalProperties: false,
    required: ['skip'],
    properties: {
        skip: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateQueryRequest(req, schemaGetQuestionFeed, logger);
        let response = await feed.getFeed(params.skip);
        res.status(200).json(response);
    }));
};
