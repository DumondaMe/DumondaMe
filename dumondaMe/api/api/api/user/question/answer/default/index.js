'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/default');
const answerEdit = requireModel('user/question/answer/edit/default');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const apiHelper = require('dumonda-me-server-lib').apiHelper;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const schemaCreateDefaultAnswer = {
    name: 'createDefaultAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        answer: {type: 'string', format: 'notEmptyString', maxLength: 10000},
        createAnswerWithLink: {type: 'boolean'}
    }
};

const schemaEditDefaultAnswer = {
    name: 'editDefaultAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        answer: {type: 'string', format: 'notEmptyString', maxLength: 10000}
    }
};

module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateDefaultAnswer);
        if (typeof apiHelper.getFile(req) === 'string' || typeof params.answer === 'string') {
            let response = await answerCreate.createAnswer(req.user.id, params, apiHelper.getFile(req), req);
            if (response.created) {
                res.status(200).json(response.created);
            } else if (response.linksFound) {
                res.status(406).json(response.linksFound);
            } else {
                logger.warn("Answer could not be created", req);
                res.status(400).end();
            }
        } else {
            logger.warn("No answer and no image defined", req);
            res.status(400).end();
        }
    }));

    router.put('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditDefaultAnswer);
        let response = await answerEdit.editAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
