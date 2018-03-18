'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const topic = require("../../../schema/topic");
const language = require("../../../schema/language");
const commitmentCreate = requireModel('user/commitment/create');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaCreateQuestion = {
    name: 'createQuestion',
    type: 'object',
    additionalProperties: false,
    required: ['title', 'description', 'topic', 'lang'],
    properties: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 80},
        description: {type: 'string', format: 'notEmptyString', maxLength: 700},
        topic: topic.topicMultiple,
        lang: language.language,
        website: {type: 'string', format: 'urlWithProtocol', maxLength: 2000}
    }
};

const getFile = function (req) {
    if (req.files && req.files.file && req.files.file.path) {
        return req.files.file.path;
    }
    return null;
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateQuestion, logger);
        let response = await commitmentCreate.createCommitment(req.user.id, params, getFile(req));
        res.status(200).json(response);
    }));
};
