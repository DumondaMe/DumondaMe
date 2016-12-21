'use strict';

var path = require('path');
var logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.get('/*', function (req, res) {
        var username = '';
        if (req.session && req.session.passport && req.session.passport.user) {
            username = req.session.passport.user;
        }
        res.cookie('user', JSON.stringify({
            'username': username
        }));
        res.sendFile(path.join(process.env.BASE_DIR, '../client/app/', 'index.html'));
        logger.info('Request of client code', req);
    });

};
