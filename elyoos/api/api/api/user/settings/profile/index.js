'use strict';

const profile = requireModel('user/setting/userProfile');
const auth = require('elyoos-server-lib').auth;
const logger = require('elyoos-server-lib').logging.getLogger(__filename);
const asyncMiddleware = require('elyoos-server-lib').asyncMiddleware;
const validation = require('elyoos-server-lib').jsonValidation;

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

    router.get('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        let userProfile = await profile.getUserProfile(req.user.id, req);
        logger.info("User requests the user profile", req);
        res.status(200).json(userProfile);
    }));

    router.post('/', auth.isAuthenticated(), asyncMiddleware(async (req, res) => {
        await validation.validateRequest(req, schemaPostNewProfileData, logger);
        await profile.updateUserProfile(req.user.id, req.body);
        logger.info("User Successfully updated user profile", req);
        res.status(200).end();
    }));
};
