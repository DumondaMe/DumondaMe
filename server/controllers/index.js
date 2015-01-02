'use strict';

module.exports = function (router) {

    router.get('/*', function (req, res) {
        var username = '';
        if (req.session && req.session.passport && req.session.passport.user) {
            username = req.session.passport.user;
        }
        res.cookie('user', JSON.stringify({
            'username': username
        }));
        res.sendfile('./client/app/index.html');
    });

};
