/**
 * Recommendation Model
 */
'use strict';

var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);
var db = require('./../../lib/database').client;
var operation = require('../security/operation');

var getAllRecommendation = function (userId) {
    var result, source;
    return db().search({
        index: 'users',
        type: 'recommendation',
        body: {
            query: {
                filtered: {
                    filter: {
                        term: {userId: userId}
                    }
                }
            }
        }
    }).then(function (resp) {
        result = [];
        underscore.each(resp.hits.hits, function (hit) {
            source = hit._source;
            source.id = hit._id;
            delete source.userId;
            result.push(source);
        });
        return result;
    });
};

var updateRecommendation = function (userId, recommendation) {
    var body;
    if (recommendation.category === 'book') {
        body = {
            script: 'ctx._source.author = author;',
            params: {
                author: recommendation.author
            }
        };
    } else {
        body = {
            script: 'ctx._source.link = link;',
            params: {
                link: recommendation.link
            }
        };
    }

    body.script = body.script.concat('ctx._source.title = title;',
        'ctx._source.comment = comment;',
        'ctx._source.ratingPositive = ratingPositive;',
        'ctx._source.category = category;');

    body.params.title = recommendation.title;
    body.params.comment = recommendation.comment;
    body.params.ratingPositive = recommendation.ratingPositive;
    body.params.category = recommendation.category;

    return operation.modifyAllowed('recommendation', recommendation.id, userId).
        then(function () {
            return db().update({
                index: 'users',
                type: 'recommendation',
                id: recommendation.id,
                body: body
            });
        });
};

var newRecommendation = function (userId, recommendation) {
    var body;

    if (recommendation.category === 'book') {
        body = {
            author: recommendation.author
        };
    } else {
        body = {
            link: recommendation.link
        };
    }

    body.title = recommendation.title;
    body.comment = recommendation.comment;
    body.ratingPositive = recommendation.ratingPositive;
    body.category = recommendation.category;
    body.userId = userId;

    return db().create({
        index: 'users',
        type: 'recommendation',
        body: body
    });
};

var saveRecommendation = function (userId, recommendation) {

    if (recommendation.id) {

        return updateRecommendation(userId, recommendation);
    }

    return newRecommendation(userId, recommendation);
};

var deleteRecommendation = function (userId, recommendationId) {

    return operation.modifyAllowed('recommendation', recommendationId, userId).
        then(function () {
            return db().deleteByQuery({
                index: 'users',
                type: 'recommendation',
                body: {
                    query: {
                        filtered: {
                            filter: {
                                bool: {
                                    must: [
                                        {term: {userId: userId}},
                                        {term: {_id: recommendationId}}
                                    ]
                                }
                            }
                        }
                    }
                }
            });
        });
};

module.exports = {
    saveRecommendation: saveRecommendation,
    getAllRecommendation: getAllRecommendation,
    deleteRecommendation: deleteRecommendation
};