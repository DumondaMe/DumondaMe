'use strict';

let validation = require('elyoos-server-lib').jsonValidation;
let auth = require('elyoos-server-lib').auth;
let controllerErrors = require('elyoos-server-lib').controllerErrors;
let addressSuggestion = requireModel('address/suggestion');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let schemaGetAddressSuggestion = {
    name: 'getAddressSuggestion',
    type: 'object',
    additionalProperties: false,
    required: ['address'],
    properties: {
        address: {type: 'string', format: 'notEmptyString', minLength: 3, maxLength: 150}
    }
};


module.exports = function (router) {

    router.get('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when getting address suggestion', req, res, logger, function () {
            return validation.validateQueryRequest(req, schemaGetAddressSuggestion, logger).then(function (request) {
                return addressSuggestion.search(request.address);
            }).then(function (suggestion) {
                res.status(200).json(suggestion);
            });
        });
    });
};
