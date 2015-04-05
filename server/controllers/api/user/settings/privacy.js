'use strict';
var auth = require('./../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var privacy = require('./../../../../models/user/privacy');
var exceptions = require('./../../../../lib/error/exceptions');
var controllerErrors = require('./../../../../lib/error/controllerErrors');
var validation = require('./../../../../lib/jsonValidation');

var schemaPostNewPrivacy = {
    name: 'newPrivacy',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        changePrivacySetting: {
            type: 'object',
            additionalProperties: false,
            required: ['privacySettings', 'privacyDescription'],
            properties: {
                privacySettings: {'$ref': '#/definitions/privacySettings'},
                privacyDescription: {'$ref': '#/definitions/privacyDescription'}
            }
        },
        changePrivacyNoContactSetting: {
            type: 'object',
            additionalProperties: false,
            required: ['privacySettings'],
            properties: {
                privacySettings: {'$ref': '#/definitions/privacySettings'}
            }
        },
        renamePrivacy: {
            type: 'object',
            additionalProperties: false,
            required: ['privacyDescription', 'newPrivacyDescription'],
            properties: {
                privacyDescription: {'$ref': '#/definitions/privacyDescription'},
                newPrivacyDescription: {'$ref': '#/definitions/privacyDescription'}
            }
        },
        addNewPrivacy: {
            type: 'object',
            additionalProperties: false,
            required: ['privacySettings', 'privacyDescription'],
            properties: {
                privacySettings: {'$ref': '#/definitions/privacySettings'},
                privacyDescription: {'$ref': '#/definitions/privacyDescription'}
            }
        }
    },
    definitions: {
        privacySettings: {
            type: 'object',
            additionalProperties: false,
            required: ['profileVisible', 'profileDataVisible', 'imageVisible', 'contactsVisible'],
            properties: {
                profileVisible: {type: 'boolean'},
                profileDataVisible: {type: 'boolean'},
                imageVisible: {type: 'boolean'},
                contactsVisible: {type: 'boolean'}
            }
        },
        privacyDescription: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30}
    }
};

var schemaDeletePrivacySetting = {
    name: 'deletePrivacySetting',
    type: 'object',
    additionalProperties: false,
    required: ['privacyDescription', 'newPrivacyDescription'],
    properties: {
        privacyDescription: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30},
        newPrivacyDescription: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30}
    }
};

module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return privacy.getPrivacySettings(req.user.id).then(function (userPrivacy) {
            logger.info("User " + req.user.id + " requests privacy settings");
            res.status(200).json(userPrivacy);
        }).catch(function (err) {
            logger.error('Getting user privacy settings failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Setting user privacy settings failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaPostNewPrivacy, logger).then(function (request) {
                if (request.changePrivacySetting) {
                    logger.info("User " + req.user.id + " changes privacy setting " + request.changePrivacySetting.privacyDescription);
                    return privacy.changePrivacySettings(req.user.id, request.changePrivacySetting.privacyDescription,
                        request.changePrivacySetting.privacySettings);
                }
                if (request.changePrivacyNoContactSetting) {
                    logger.info("User " + req.user.id + " changes privacy no contact setting " +
                    request.changePrivacyNoContactSetting.privacyDescription);
                    return privacy.changePrivacySettingsNoContact(req.user.id, request.changePrivacyNoContactSetting.privacySettings);
                }
                if (request.renamePrivacy) {
                    logger.info("User " + req.user.id + " renames privacy setting " +
                    request.renamePrivacy.privacyDescription + " to " + request.renamePrivacy.newPrivacyDescription);
                    return privacy.renamePrivacySetting(req.user.id, request.renamePrivacy.privacyDescription,
                        request.renamePrivacy.newPrivacyDescription);
                }
                if (request.addNewPrivacy) {
                    logger.info("User " + req.user.id + " add new privacy setting " + request.addNewPrivacy.privacyDescription);
                    return privacy.addNewPrivacySetting(req.user.id, request.addNewPrivacy.privacyDescription,
                        request.addNewPrivacy.privacySettings);
                }
            }).then(function () {
                res.status(200).end();
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs while deleting privacy settings', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeletePrivacySetting, logger).then(function (request) {
                logger.info("User " + req.user.id + " deletes privacy setting " + request.privacyDescription +
                " and moves contacts to privacy setting " + request.newPrivacyDescription);
                return privacy.deletePrivacySetting(req.user.id, request.privacyDescription, request.newPrivacyDescription);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
