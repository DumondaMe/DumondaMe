'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let recommendedUser = requireModel('user/setting/recommendedUser');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaSetRecommendedUser = {
    name: 'recommendedUser',
    type: 'object',
    additionalProperties: false,
    required: ['showOnHomeScreen'],
    properties: {
        showOnHomeScreen: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when setting the recommended user setting', req, res, logger, function () {
            return validation.validateRequest(req, schemaSetRecommendedUser, logger).then(function (request) {
                logger.info("User sets recommended user setting", req);
                return recommendedUser.setRecommendedUserOnHomeScreen(req.user.id, request.showOnHomeScreen);
            }).then(function () {
                res.status(200).end();
            });
        });
    });

};
