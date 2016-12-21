'use strict';

var validation = require('elyoos-server-lib').jsonValidation;
var auth = require('elyoos-server-lib').auth;
var deletePage = requireModel('user/page/deletePage');
var controllerErrors = require('elyoos-server-lib').controllerErrors;
var logger = require('elyoos-server-lib').logging.getLogger(__filename);


var schemaDeleteBlog = {
    name: 'deleteBlog',
    type: 'object',
    additionalProperties: false,
    required: ['pageId'],
    properties: {
        pageId: {type: 'string', format: 'id', maxLength: 50}
    }
};
module.exports = function (router) {
    router.delete('/', auth.isAuthenticated(), function (req, res) {
        return controllerErrors('Error occurs while deleting a page', req, res, logger, function () {
            return validation.validateRequest(req, schemaDeleteBlog, logger).then(function (request) {
                return deletePage.deletePage(req.user.id, request, req);
            }).then(function () {
                res.status(200).end();
            });
        });
    });
};
