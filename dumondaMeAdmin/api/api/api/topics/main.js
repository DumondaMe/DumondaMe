'use strict';

const auth = require('dumonda-me-server-lib').auth;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const createMainTopic = requireModel('topic/create/mainTopic');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;
const validation = require('dumonda-me-server-lib').jsonValidation;


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
        const params = await validation.validateRequest(req, schemaCreateMainTopic);
        logger.info(`Create new main topic`, req);
        let response = await createMainTopic.create(params);
        res.status(200).json(response);
    }));
};
