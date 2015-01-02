'use strict';

var user = require('./../../../../../models/user/user'),
    auth = require('./../../../../../lib/auth'),
    handlingRecommendation = require('./handlingRecommendation');

var schemaPostLinkRecommendationData = {
        name: 'newLinkRecommendationData',
        type: 'object',
        additionalProperties: false,
        required: ['link', 'title', 'category', 'ratingPositive'],
        properties: {
            id: {type: 'string', format: 'notEmptyString', maxLength: 50},
            link: {type: 'string', format: 'uri', minLenght: 1, maxLength: 500},
            title: {type: 'string', format: 'notEmptyString', maxLength: 50},
            category: {enum: ['video', 'education', 'seminar', 'praxis', 'miscellaneous']},
            ratingPositive: {type: 'boolean'},
            comment: {type: 'string', maxLength: 500}
        }
    },
    schemaDeleteLinkRecommendation = {
        name: 'deleteLinkRecommendation',
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

        return handlingRecommendation.postRecommendation(req, res, schemaPostLinkRecommendationData);
    });

    router.delete('/', auth.isAuthenticated(), function (req, res) {

        return handlingRecommendation.deleteRecommendation(req, res, schemaDeleteLinkRecommendation);
    });
};
