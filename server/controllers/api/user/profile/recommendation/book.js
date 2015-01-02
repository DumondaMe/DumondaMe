'use strict';

var user = require('./../../../../../models/user/user'),
    auth = require('./../../../../../lib/auth'),
    handlingRecommendation = require('./handlingRecommendation');

var schemaPostNewBookRecommendationData = {
        name: 'newBookRecommendationData',
        type: 'object',
        additionalProperties: false,
        required: ['author', 'title', 'ratingPositive', 'category'],
        properties: {
            id: {type: 'string', format: 'notEmptyString', maxLength: 50},
            category: {enum: ['book']},
            author: {type: 'string', format: 'notEmptyString', maxLength: 150},
            title: {type: 'string', format: 'notEmptyString', maxLength: 50},
            ratingPositive: {type: 'boolean'},
            comment: {type: 'string', maxLength: 500}
        }
    },
    schemaDeleteBookRecommendation = {
        name: 'deleteRecommendation',
        type: 'object',
        additionalProperties: false,
        required: ['id'],
        properties: {
            id: {type: 'string', format: 'notEmptyString', maxLength: 50}
        }
    };

module.exports = function (router) {

    router.post('/', auth.isAuthenticated(), function (req, res) {

        if (!req.body.comment) {
            req.body.comment = '';
        }
        req.body.category = 'book';

        return handlingRecommendation.postRecommendation(req, res, schemaPostNewBookRecommendationData);
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {

        return handlingRecommendation.deleteRecommendation(req, res, schemaDeleteBookRecommendation);
    });
};
