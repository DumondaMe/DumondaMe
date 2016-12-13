'use strict';

var contactStatistic = requireModel('contact/contactStatistic');
var auth = require('elyoos-server-lib').auth;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        logger.info("User requests contact statistic", req);

        return contactStatistic.getContactStatistics(req.user.id)
            .then(function (statistic) {
                res.status(200).json(statistic);
            });
    });
};
