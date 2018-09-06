'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const watches = requireModel('question/watches');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const apiHelper = require('elyoos-server-lib').apiHelper;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaGetWatchesOfQuestion = {
    name: 'getWatchesOfQuestion',
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
        const params = await validation.validateRequest(req, schemaGetWatchesOfQuestion, logger);
        let userId = apiHelper.getUserId(req);
        let response = await watches.getUserWatchesQuestion(userId, params.id, params.page);
        res.status(200).json(response);
    }));
};
