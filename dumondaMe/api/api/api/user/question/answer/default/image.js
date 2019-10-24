'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const answerEdit = requireModel('user/question/answer/edit/default');
const deleteAnswer = requireModel('user/question/answer/delete');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const auth = require('dumonda-me-server-lib').auth;
const apiHelper = require('dumonda-me-server-lib').apiHelper;

const schemaDefaultAnswer = {
    name: 'defaultAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDefaultAnswer);
        let response = await answerEdit.changeImage(req.user.id, params.answerId, apiHelper.getFile(req), req);
        res.status(200).json(response);
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDefaultAnswer);
        await deleteAnswer.deleteImages(req.user.id, params.answerId, 'default', req);
        res.status(200).end();
    }));
};
