'use strict';

let validation = requireLib('jsonValidation');
let normal = requireModel('feedback/create/normal');
let discussionIdea = requireModel('feedback/create/discussionIdea');
let auth = requireLib('auth');
let controllerErrors = requireLib('error/controllerErrors');
let logger = requireLogger.getLogger(__filename);

let schemaCreateFeedback = {
    name: 'createFeedback',
    type: 'object',
    additionalProperties: false,
    properties: {
        normal: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'description', 'group'],
            properties: {
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                group: {enum: ['Bug', 'Idea']}
            }
        },
        discussion: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'description', 'discussionId'],
            properties: {
                title: {'$ref': '#/definitions/title'},
                description: {'$ref': '#/definitions/description'},
                discussionId: {type: 'string', format: 'notEmptyString', maxLength: 50},
            }
        }
    },
    definitions: {
        title: {type: 'string', format: 'notEmptyString', maxLength: 160},
        description: {type: 'string', format: 'notEmptyString', maxLength: 3000}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs creating a new feedback', req, res, logger, function () {
            return validation.validateRequest(req, schemaCreateFeedback, logger).then(function (request) {
                if(request.hasOwnProperty('normal')) {
                    return normal.create(req.user.id, request.normal);
                } else if(request.hasOwnProperty('discussion')) {
                    return discussionIdea.create(req.user.id, request.discussion, req);
                }

            }).then(function (feedback) {
                res.status(200).json(feedback);
            });
        });
    });
};
