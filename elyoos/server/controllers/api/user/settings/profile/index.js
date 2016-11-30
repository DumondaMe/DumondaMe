'use strict';

var user = requireModel('user/user');
var auth = requireLib('auth');
var logger = requireLogger.getLogger(__filename);
var controllerErrors = requireLib('error/controllerErrors');
var validation = requireLib('jsonValidation');

var schemaPostNewProfileData = {
    name: 'newProfileData',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname', 'birthday', 'country', 'female'],
    properties: {
        forename: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        surname: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50},
        birthday: {type: 'integer'},
        country: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 50},
        female: {type: 'boolean'},
        street: {type: 'string', maxLength: 80},
        place: {type: 'string', maxLength: 80}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return user.getUserProfile(req.user.id, req).then(function (userProfile) {
            logger.info("User requests the user profile", req);
            res.status(200).json(userProfile);
        }).catch(function (err) {
            logger.error('Getting profile data failed', req, {error: err.errors});
            res.status(500).end();
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Update of profile data failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaPostNewProfileData, logger).then(function () {
                return user.updateUserProfile(req.user.id, req.body);
            }).then(function () {
                logger.info("User Successfully updated user profile", req);
                res.status(200).end();
            });
        });
    });
};
