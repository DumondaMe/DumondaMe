'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/commitment');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateCommitmentAnswer = {
    name: 'createCommitmentAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'questionId', 'description'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        description: {type: 'string', format: 'notEmptyString', maxLength: 700}
    }
};


module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateCommitmentAnswer, logger);
        let response = await answerCreate.createCommitmentAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
