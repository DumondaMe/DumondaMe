'use strict';
var auth = require('./../../../../../../lib/auth');
var logger = requireLogger.getLogger(__filename);
var solution = require('./../../../../../../models/forum/solution/solution');
var controllerErrors = require('./../../../../../../lib/error/controllerErrors');
var validation = require('./../../../../../../lib/jsonValidation');

var schemaAddQuestion = {
    name: 'createForumSolution',
    type: 'object',
    additionalProperties: false,
    required: ['questionId', 'description'],
    properties: {
        questionId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        pageId: {type: 'string', format: 'notEmptyString', maxLength: 30},
        description: {type: 'string', format: 'notEmptyString', maxLength: 1000}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        return controllerErrors('Error occurs when creating a forum solution', req, res, logger, function () {
            return validation.validateRequest(req, schemaAddQuestion, logger).then(function (request) {
                logger.info("User created a new forum solution", req);
                return solution.createSolution(req.user.id, request.questionId, request.description, request.pageId, req);
            }).then(function (data) {
                res.status(200).json(data);
            });
        });
    });
};
