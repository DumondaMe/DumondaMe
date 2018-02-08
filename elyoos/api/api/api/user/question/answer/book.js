'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/book');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateBookAnswer = {
    name: 'createBookAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'title', 'description'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        imageUrl: {type: 'string', format: 'urlWithProtocol', maxLength: 2000},
        title: {type: 'string', format: 'notEmptyString', maxLength: 100},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        authors: {type: 'string', format: 'notEmptyString', maxLength: 500},
        googleBookId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};


module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateBookAnswer, logger);
        let response = await answerCreate.createBookAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
