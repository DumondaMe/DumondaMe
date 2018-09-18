'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/book');
const answerEdit = requireModel('user/question/answer/edit/book');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaCreateBookAnswer = {
    name: 'createBookAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'title', 'description'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        imageUrl: {type: 'string', format: 'urlWithProtocol', maxLength: 2000},
        title: {type: 'string', format: 'notEmptyString', maxLength: 100},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        authors: {type: 'string', format: 'notEmptyString', maxLength: 500},
        googleBookId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

const schemaEditBookAnswer = {
    name: 'editBookAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId', 'description'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000},
        authors: {type: 'string', format: 'notEmptyString', maxLength: 500}
    }
};


module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateBookAnswer, logger);
        let response = await answerCreate.createBookAnswer(req.user.id, params);
        res.status(200).json(response);
    }));

    router.put('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditBookAnswer, logger);
        let response = await answerEdit.editBookAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
