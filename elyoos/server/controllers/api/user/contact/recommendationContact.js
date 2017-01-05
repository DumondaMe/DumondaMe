'use strict';

let contactRecommendation = requireModel('user/contact/contactRecommendation');
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error when getting recommended user', req, res, logger, function () {
            logger.info("User requests recommend user", req);
            return contactRecommendation.getContactRecommendation(req.user.id).then(function (users) {
                res.status(200).json(users);
            });
        });
    });
};
