'use strict';

var modification = requireModel('modification/modification');
var auth = requireLib('auth');
var logger = requireLogger.getLogger(__filename);
var validation = requireLib('jsonValidation');

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
