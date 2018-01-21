'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const feed = requireModel('feeds/question');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetQuestionFeed = {
    name: 'getQuestionFeed',
    type: 'object',
    additionalProperties: false,
    required: ['timestamp'],
    properties: {
        page: {type: 'integer', minimum: 0},
        timestamp: {type: 'integer', minimum: 0}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateQueryRequest(req, schemaGetQuestionFeed, logger);
        params.page = params.page || 0;
        let response = await feed.getFeed(params.page, params.timestamp);
        res.status(200).json(response);
    }));
};
