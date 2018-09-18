'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const upVote = requireModel('user/question/answer/upVote');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaUpVote = {
    name: 'upVote',
    type: 'object',
    additionalProperties: false,
    required: ['answerId'],
    properties: {
        answerId: {type: 'string', format: 'notEmptyString', maxLength: 60}
    }
};


module.exports = function (router) {

    router.post('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaUpVote, logger);
        await upVote.upVote(req.user.id, params.answerId);
        res.status(200).end();
    }));

    router.delete('/:answerId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaUpVote, logger);
        await upVote.deleteUpVote(req.user.id, params.answerId);
        res.status(200).end();
    }));
};
