'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const deleteAnswer = requireModel('user/question/answer/deleteAnswer');
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);


const schemaDeleteAnswer = {
    name: 'deleteAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

module.exports = function (router) {

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaDeleteAnswer, logger);
        await deleteAnswer.deleteAnswer(req.user.id, params.answerId);
        res.status(200).end();
    }));
};
