'use strict';

var modification = require('./../../../models/modification/modification'),
    auth = require('./../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../lib/error/exceptions'),
    validation = require('./../../../lib/jsonValidation');

var schemaRequestModification = {
    name: 'requestModification',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        forceShowModification: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        logger.info('Modification request of user ' + req.user.id);
        return validation.validateQueryRequest(req, schemaRequestModification, logger).then(function () {
            return modification.hasModification(req.user.id, req.session);
        }).then(function (hasChanged) {
            if (hasChanged.hasChanged || req.query.forceShowModification) {
                logger.info('Profile of user ' + req.user.id + ' has changed');
                res.status(200).json(hasChanged);
            } else {
                logger.debug('Profile of user ' + req.user.id + ' has not changed');
                res.status(200).end();
            }
        }).catch(function (err) {
            logger.error('Getting modification failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
