'use strict';

const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const createMainTopic = requireModel('topic/create/mainTopic');
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;


const schemaCreateMainTopic = {
    name: 'createMainTopic',
    type: 'object',
    additionalProperties: false,
    required: ['de', 'en'],
    properties: {
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
        const params = await validation.validateRequest(req, schemaCreateMainTopic, logger);
        logger.info(`Create new main topic`, req);
        let response = await createMainTopic.create(params);
        res.status(200).json(response);
    }));
};
