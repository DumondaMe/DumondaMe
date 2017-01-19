'use strict';

let path = require('path');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let indexFile = 'index.html';
if (process.env.NODE_ENV === 'development') {
    indexFile = 'indexPreview.html';
}

module.exports = function (router) {

    router.get('/*', function (req, res) {
        let username = '';
        if (req.session && req.session.passport && req.session.passport.user) {
            username = req.session.passport.user;
        }
        res.cookie('user', JSON.stringify({
            'username': username
        }));
        res.sendFile(path.join(process.env.BASE_DIR, '../client/app/', indexFile));
        logger.info('Request of client code', req);
    });

};
