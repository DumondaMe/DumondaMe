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
    /*router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting detail of a user', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaRequestGetUserDetails, logger)
                .then(function (request) {
                    logger.info("User requests detail information for user " + request.userId, req);
                    return userProfile.getUserDetails(req.user.id, request.userId, req);

                })
                .then(function (userDetailResp) {
                    res.status(200).json(userDetailResp);
                });
        });
    });*/

    router.get('/', asyncMiddleware(async (req, res) => {
        //let response = await validation.validateQueryRequest(req, schemaRequestGetUserDetails, logger);
        let userProfile = await profile.getUserProfile(req.user.id, req);
        logger.info("Requests of user profile", req);
        res.status(200).json(userProfile);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await validation.validateRequest(req, schemaPostNewProfileData, logger);
        await profile.updateUserProfile(req.user.id, req.body);
        logger.info("Successfully updated user profile", req);
        res.status(200).end();
    }));
};
