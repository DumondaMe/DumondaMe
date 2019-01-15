'use strict';

const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const rateLimit = require('dumonda-me-server-lib').limiteRate;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;
const unsubscribe = requireModel('unsubscribe/answerQuestion');

const schemaUnsubscribeAnswerQuestion = {
    name: 'UnsubscribeAnswerQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
        email: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 255}
    }
};

const apiLimiter = rateLimit.getRate({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 3
});

module.exports = function (router) {

    router.post('/', apiLimiter, asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaUnsubscribeAnswerQuestion);
        logger.info(`Unsubscribe to answer question ${request.email}`, req);
        await unsubscribe.unsubscribe(request.email, req);
        res.status(200).end();
    }));
};
