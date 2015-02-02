'use strict';

var user = require('./../../../../models/user/user'),
    auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../../common/src/lib/error/exceptions'),
    validation = require('./../../../../../common/src/lib/jsonValidation');

var schemaPostNewProfileData = {
    name: 'newProfileData',
    type: 'object',
    additionalProperties: false,
    required: ['forename', 'surname', 'birthday', 'country', 'female'],
    properties: {
        forename: {type: 'string', minLength: 1, maxLength: 30},
        surname: {type: 'string', minLength: 1, maxLength: 50},
        birthday: {type: 'string', format: 'date'},
        country: {type: 'string', minLength: 1, maxLength: 50},
        female: {type: 'boolean'},
        street: {type: 'string', maxLength: 80},
        place: {type: 'string', maxLength: 80}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return user.getUserProfile(req.user.id, req.session.cookie._expires).then(function (userProfile) {
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
