'use strict';

let path = require('path');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let indexFile = 'index.html';
if (process.env.NODE_ENV === 'development') {
    indexFile = 'indexPreview.html';
}

module.exports = function (router) {

    router.get('/*', function (req, res) {
        res.sendFile(path.join(process.env.BASE_DIR, '../client/app/', indexFile));
        logger.info('Request of client code', req);
    });

};
