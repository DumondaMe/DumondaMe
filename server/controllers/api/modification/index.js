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

        return validation.validateQueryRequest(req, schemaRequestModification, logger).then(function () {
            return modification.hasModification(req.user.id, req.session);
        }).then(function (hasChanged) {
            if (hasChanged.hasChanged || req.query.forceShowModification) {
                logger.info('Profile of user has changed', req);
                res.status(200).json(hasChanged);
            } else {
                res.status(200).end();
            }
        }).catch(function (err) {
            logger.error('Getting modification failed', req, {error: err.errors});
            res.status(500).end();
        });
    });
};
