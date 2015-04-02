'use strict';

var user = require('./../../../../models/user/user'),
    auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../lib/error/exceptions'),
    validation = require('./../../../../lib/jsonValidation');

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
        street: {type: 'string', format: 'notEmptyString', maxLength: 80},
        place: {type: 'string', format: 'notEmptyString', maxLength: 80}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return user.getUserProfile(req.user.id).then(function (userProfile) {
            res.status(200).json(userProfile);
        }).catch(function (err) {
            logger.error('Getting profile data failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {


        return validation.validateRequest(req, schemaPostNewProfileData, logger).then(function () {
            return user.updateUserProfile(req.user.id, req.body);
        }).then(function () {
            logger.info('Successfully updated user profile', {}, req);
            res.status(200).end();
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Update of profile data failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
