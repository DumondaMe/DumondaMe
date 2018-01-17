'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const topic = require("../../../schema/topic");
const language = require("../../../schema/language");
const question = requireModel('user/question/create');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateQuestion = {
    name: 'createQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['question', 'topic', 'lang'],
    properties: {
        question: {type: 'string', format: 'notEmptyString', maxLength: 80},
        description: {type: 'string', format: 'notEmptyString', maxLength: 80},
        topic: topic.topicMultiple,
        lang: language.language
    }
};

const schemaDeleteContact = {
    name: 'deleteContact',
    type: 'object',
    additionalProperties: false,
    required: ['contactIds'],
    properties: {
        contactIds: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 30},
            minItems: 1,
            maxItems: 30,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {

        const params = await validation.validateRequest(req, schemaCreateQuestion, logger);
        let response = await question.createQuestion(req.user.id, params);
        res.status(200).json(response);
    }));

    router.delete('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {

        const request = await validation.validateRequest(req, schemaDeleteContact, logger);
        res.status(200).end();
    }));
};
