'use strict';

const validation = require('dumonda-me-server-lib').jsonValidation;
const schemaLanguage = require('../../../schema/language');
const profile = requireModel('user/profile/profile');
const auth = require('dumonda-me-server-lib').auth;
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);
const asyncMiddleware = require('dumonda-me-server-lib').asyncMiddleware;

const schemaRequestGetUserDetails = {
    name: 'getUserDetails',
    type: 'object',
    additionalProperties: false,
    required: ['languages', 'guiLanguage'],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 60},
        languages: schemaLanguage.languageMultiple,
        guiLanguage: schemaLanguage.language,
        timestamp: {type: 'integer', minimum: 0}
    }
};

const schemaPostNewProfileData = {
    name: 'newProfileData',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname'],
    properties: {
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 40},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 60},
        userDescription: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 3000}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        let params = await validation.validateRequest(req, schemaRequestGetUserDetails);
        params.timestamp = params.timestamp || time.getNowUtcTimestamp();
        let userProfile = await profile.getUserProfile(req.user.id, params.userId, params.languages, params.guiLanguage,
            params.timestamp);
        logger.info("Requests of user profile", req);
        res.status(200).json(userProfile);
    }));

    router.put('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await validation.validateRequest(req, schemaPostNewProfileData);
        await profile.updateUserProfile(req.user.id, req.body);
        logger.info("Successfully updated user profile", req);
        res.status(200).end();
    }));
};
