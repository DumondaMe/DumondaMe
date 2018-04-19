'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const watch = requireModel('user/question/watch');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaWatchQuestion = {
    name: 'watchQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.put('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWatchQuestion, logger);
        await watch.addWatch(req.user.id, params.questionId);
        res.status(200).end();
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaWatchQuestion, logger);
        await watch.removeWatch(req.user.id, params.questionId);
        res.status(200).end();
    }));
};
