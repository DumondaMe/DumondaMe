'use strict';

var user = require('./../../../../../models/user/user'),
    auth = require('./../../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename);

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        res.status(200).end();
        //TODO Picture
        /*return user.getProfileImage(req.user.id).then(function (data) {
         res.setHeader('Content-Type', data.contentType);
         res.setHeader('Content-Length', data.length);
         res.end(data.data);
         }).catch(function (err) {
         //TODO: lade default bild
         logger.warn('No profile image', {error: err}, req);
         res.status(200).end();
         });*/
    });
};
