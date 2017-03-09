'use strict';
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let privacy = requireModel('user/setting/privacy');
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaPostPrivacyCommands = {
    name: 'newPrivacy',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        changePrivacySetting: {
            type: 'object',
            additionalProperties: false,
            required: ['group', 'noContact'],
            properties: {
                group: {
                    type: 'array',
                    minItems: 1,
                    items: {'$ref': '#/definitions/privacySettings'}
                },
                noContact: {'$ref': '#/definitions/privacySettingsNoContact'}
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
            required: ['privacySettings'],
            properties: {
                privacySettings: {'$ref': '#/definitions/privacySettings'}
            }
        }
    },
    definitions: {
        privacySettingsNoContact: {
            type: 'object',
            additionalProperties: false,
            required: ['profileVisible', 'imageVisible', 'contactsVisible', 'pinwallVisible'],
            properties: {
                profileVisible: {type: 'boolean'},
                imageVisible: {type: 'boolean'},
                contactsVisible: {type: 'boolean'},
                pinwallVisible: {type: 'boolean'}
            }
        },
        privacySettings: {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'imageVisible', 'contactsVisible', 'pinwallVisible'],
            properties: {
                type: {'$ref': '#/definitions/privacyDescription'},
                imageVisible: {type: 'boolean'},
                contactsVisible: {type: 'boolean'},
                pinwallVisible: {type: 'boolean'}
            }
        },
        privacyDescription: {type: 'string', format: 'notEmptyString', minLength: 1, maxLength: 30}
    }
};

let schemaDeletePrivacySetting = {
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
            logger.info("User requests privacy settings", req);
            res.status(200).json(userPrivacy);
        }).catch(function (err) {
            logger.error('Getting user privacy settings failed', req, {error: err.errors});
            res.status(500).end();
        });
    });

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Setting user privacy settings failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaPostPrivacyCommands, logger).then(function (request) {
                if (request.changePrivacySetting) {
                    logger.info(`User changes privacy settings`, req);
                    return privacy.changePrivacySettings(req.user.id, request.changePrivacySetting, req);
                }
                if (request.renamePrivacy) {
                    logger.info(`User renames privacy setting
                    ${request.renamePrivacy.privacyDescription} to ${request.renamePrivacy.newPrivacyDescription}`, req);
                    return privacy.renamePrivacySetting(req.user.id, request.renamePrivacy.privacyDescription,
                        request.renamePrivacy.newPrivacyDescription, req);
                }
                if (request.addNewPrivacy) {
                    logger.info(`User add new privacy setting ${request.addNewPrivacy.privacySettings.type}`, req);
                    return privacy.addNewPrivacySetting(req.user.id, request.addNewPrivacy.privacySettings);
                }
            }).then(function () {
                res.status(200).end();
            });
        });
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs while deleting privacy settings', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeletePrivacySetting, logger).then(function (request) {
                logger.info("User deletes privacy setting " + request.privacyDescription +
                    " and moves contacts to privacy setting " + request.newPrivacyDescription, req);
                return privacy.deletePrivacySetting(req.user.id, request.privacyDescription, request.newPrivacyDescription);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
