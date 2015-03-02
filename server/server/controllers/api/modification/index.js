'use strict';

var modification = require('./../../../models/modification/modification'),
    auth = require('./../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../common/src/lib/error/exceptions'),
    validation = require('./../../../../common/src/lib/jsonValidation');

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return modification.hasModification(req.user.id, req.session).then(function (hasChanged) {
            if (hasChanged) {
                res.status(200).json({hasChanged: true});
            } else {
                res.status(200).end();
            }
        }).catch(function (err) {
            logger.error('Getting modification failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
