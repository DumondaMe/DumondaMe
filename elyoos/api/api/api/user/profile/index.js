'use strict';

const validation = require('elyoos-server-lib').jsonValidation;
const profile = requireModel('user/profile/profile');
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;

const schemaRequestGetUserDetails = {
    name: 'getUserDetails',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        userId: {type: 'string', format: 'notEmptyString', maxLength: 30}
    }
};

const schemaPostNewProfileData = {
    name: 'newProfileData',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname'],
    properties: {
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50}
    }
};

module.exports = function (router) {

    router.get('/', asyncMiddleware(async (req, res) => {
        let userProfile = await profile.getUserProfile(req.user.id, null);
        logger.info("Requests of user profile", req);
        res.status(200).json(userProfile);
    }));

    router.get('/:userId', asyncMiddleware(async (req, res) => {
        let response = await validation.validateRequest(req, schemaRequestGetUserDetails, logger);
        let userProfile = await profile.getUserProfile(req.user.id, response.userId);
        logger.info("Requests of another user profile", req);
        res.status(200).json(userProfile);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await validation.validateRequest(req, schemaPostNewProfileData, logger);
        await profile.updateUserProfile(req.user.id, req.body);
        logger.info("Successfully updated user profile", req);
        res.status(200).end();
    }));
};
