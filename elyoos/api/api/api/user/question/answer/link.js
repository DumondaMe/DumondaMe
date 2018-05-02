'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const answerCreate = requireModel('user/question/answer/create/link');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateLinkAnswer = {
    name: 'createLinkAnswer',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'link', 'title', 'description', 'type'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        link: {type: 'string', format: 'urlWithProtocol', maxLength: 2000},
        imageUrl: {type: 'string', format: 'urlWithProtocol', maxLength: 2000},
        title: {type: 'string', format: 'notEmptyString', maxLength: 140},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        type: {enum: ['article', 'blog', 'website']}
    }
};


module.exports = function (router) {

    router.post('/:questionId', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateLinkAnswer, logger);
        let response = await answerCreate.createLinkAnswer(req.user.id, params);
        res.status(200).json(response);
    }));
};
