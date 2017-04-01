'use strict';

let accountSetup = requireModel('user/setting/accountSetup');
let auth = require('elyoos-server-lib').auth;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let validation = require('elyoos-server-lib').jsonValidation;

let schemaPostFinishSetupAccount = {
    name: 'finishSetupAccount',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
    }
};

module.exports = function (router) {


    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Finish setup account failed', req, res, logger, function () {
            return validation.validateRequest(req, schemaPostFinishSetupAccount, logger).then(function () {
                return accountSetup.accountSetupFinished(req.user.id, req.body);
            }).then(function () {
                logger.info("User finished successfully account setup", req);
                res.status(200).end();
            });
        });
    });
};
