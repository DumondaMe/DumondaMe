'use strict';

let authCheck = requireModel('user/auth/checkAuthentication');

module.exports = function (router) {

    router.get('/', function (req, res) {
        let userId;
        if(req.user && req.user.id) {
            userId = req.user.id;
        }
        return authCheck.check(req.isAuthenticated(), userId).then(function(status) {
            res.status(200).json(status);
        });
    });
};
