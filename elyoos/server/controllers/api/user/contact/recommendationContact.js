'use strict';

var contactRecommendation = requireModel('user/contact/contactRecommendation');
var auth = requireLib('auth');
var controllerErrors = requireLib('error/controllerErrors');
var logger = requireLogger.getLogger(__filename);

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
