'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let sync = requireModel('user/page/transitionConnect/sync');

let schemaSetSync = {
    name: 'setSync',
    type: 'object',
    additionalProperties: false,
    required: ['pageId', 'state'],
    properties: {
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 50},
        state: {type: 'boolean'}
    }
};

module.exports = function (router) {

    router.put('/:pageId', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs', req, res, logger, function () {
            return validation.validateRequest(req, schemaSetSync, logger).then(function (request) {
                return sync.setSyncState(req.user.id, request.pageId, request.state, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
