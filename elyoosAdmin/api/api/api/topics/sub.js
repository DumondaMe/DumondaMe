'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const createSubTopic = requireModel('topic/create/subTopic');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;


const schemaCreateSubTopic = {
    name: 'createSubTopic',
    type: 'object',
    additionalProperties: false,
    required: ['parentTopicId', 'de', 'en'],
    properties: {
        parentTopicId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        de: {type: 'string', format: 'notEmptyString', maxLength: 80},
        en: {type: 'string', format: 'notEmptyString', maxLength: 80},
        similarDe: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 80},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        },
        similarEn: {
            type: 'array',
            items: {type: 'string', format: 'notEmptyString', maxLength: 80},
            minItems: 1,
            maxItems: 100,
            uniqueItems: true
        }
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaCreateSubTopic, logger);
        logger.info(`Create new sub topic`, req);
        let response = await createSubTopic.create(params);
        res.status(200).json(response);
    }));
};
