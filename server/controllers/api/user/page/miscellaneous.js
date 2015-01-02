'use strict';

var passport = require('passport'),
    page = require('./../../../../models/user/page/page'),
    auth = require('./../../../../lib/auth'),
    logger = requireLogger.getLogger(__filename),
    exceptions = require('./../../../../lib/error/exceptions'),
    validation = require('./../../../../lib/jsonValidation');

var schemaPostNewBookPage = {
    name: 'postNewMiscellaneousPage',
    type: 'object',
    additionalProperties: false,
    required: ['titles'],
    properties: {
        titles: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'description', 'language'],
                properties: {
                    title: {type: 'string', format: 'notEmptyString', maxLength: 50},
                    description: {type: 'string', format: 'notEmptyString', maxLength: 1000},
                    language: {type: 'string', format: 'notEmptyString', maxLength: 20}
                }
            }
        },
        author: {type: 'string', format: 'notEmptyString', maxLength: 50},
        link: {type: 'string', format: 'notEmptyString', maxLength: 1000},
        category: {type: 'string', format: 'notEmptyString', maxLength: 30},
        street: {type: 'string', format: 'notEmptyString', maxLength: 200},
        postalCode: {type: 'string', format: 'notEmptyString', maxLength: 20},
        country: {type: 'string', format: 'notEmptyString', maxLength: 100}
    }
};

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {
        return validation.validateRequest(req, schemaPostNewBookPage, logger).then(function () {
            return page.createPage(req.user.id, req.body);
        }).then(function () {
            res.status(200).end();
        }).catch(exceptions.InvalidJsonRequest, function () {
            res.status(400).end();
        }).catch(function (err) {
            logger.error('Post new miscellaneous Page has failed', {error: err.errors}, req);
            res.status(500).end();
        });
    });
};
