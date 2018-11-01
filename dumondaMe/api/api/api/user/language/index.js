'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require("../../../schema/language");
const language = requireModel('user/language/index');
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;


const schemaEditLanguage = {
    name: 'editLanguage',
    type: 'object',
    additionalProperties: false,
    required: ['language'],
    properties: {
        language: schemaLanguage.language
    }
};

module.exports = function (router) {

    router.put('/:language', asyncMiddleware(async (req, res) => {
        const params = await validation.validateRequest(req, schemaEditLanguage);
        await language.setLanguage(req.user, req.session, params.language);
        res.status(200).end();
    }));
};
