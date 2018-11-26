'use strict';
const auth = require('dumonda-me-server-lib').auth;
const schemaLanguage = require('../../../schema/language');
const languages = requireModel('user/setting/languages');
const validation = require('dumonda-me-server-lib').jsonValidation;
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaChangeUserLanguages = {
    name: 'changeUserLanguages',
    type: 'object',
    additionalProperties: false,
    required: ['languages'],
    properties: {
        languages: schemaLanguage.languageMultiple,
    }
};

module.exports = function (router) {

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let request = await validation.validateRequest(req, schemaChangeUserLanguages);
        await languages.changeLanguagesSettings(req.user.id, request.languages);
        res.status(200).end();
    }));
};
