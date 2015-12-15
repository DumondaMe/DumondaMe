'use strict';

module.exports = function (router) {

    router.get('/', function (req, res) {
        var status = {isLoggedIn: req.isAuthenticated()};
        res.status(200).json(status);
    });
};
