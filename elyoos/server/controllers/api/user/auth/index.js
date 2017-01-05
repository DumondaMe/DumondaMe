'use strict';

module.exports = function (router) {

    router.get('/', function (req, res) {
        let status = {isLoggedIn: req.isAuthenticated()};
        res.status(200).json(status);
    });
};
