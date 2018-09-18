'use strict';

let path = require('path');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

module.exports = function (router) {

    router.get('/*', function (req, res) {
        res.sendFile(path.join(process.env.BASE_DIR, '../client/app/indexAuth.html'));
        logger.info('Request of client auth code', req);
    });

};
