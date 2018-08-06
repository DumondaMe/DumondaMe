'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const schemaLanguage = require('../../schema/language');
const events = requireModel('commitment/events');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);

const schemaEventsOfCommitment = {
    name: 'getEventOfCommitment',
    type: 'object',
    additionalProperties: false,
    required: ['commitmentId', 'upComing', 'page', 'language'],
    properties: {
        commitmentId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        upComing: {type: 'boolean'},
        page: {type: 'integer'},
        language: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEventsOfCommitment, logger);
        let response = await events.getEvents(params.commitmentId, params.upComing, params.page, params.language);
        res.status(200).json(response);
    }));
};
