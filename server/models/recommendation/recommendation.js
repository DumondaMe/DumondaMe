'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var underscore = require('underscore');
var cdn = require('../util/cdn');
var logger = requireLogger.getLogger(__filename);

var addImageUrl = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.previewUrl = cdn.getUrl('pages/' + preview.label + '/' + preview.pageId + '/pageTitlePicturePreview.jpg');
    });
};

var addLabel = function (previews) {
    underscore.forEach(previews, function (preview) {
        preview.label = preview.types[0];
        delete preview.types;
    });
};

var getUserRecommendations = function (userId, skip, limit) {
    return db.cypher().match("(:User {userId: {userId}})-[:RECOMMENDS]->(r:Recommendation)-[:RECOMMENDS]->(recommended)")
        .return("r.created AS created, r.rating AS rating, r.comment AS comment, r.recommendationId AS recommendationId, " +
        "LABELS(recommended) AS types, recommended.title AS title, recommended.description AS description, recommended.pageId AS pageId")
        .orderBy("r.created DESC")
        .skip("{skip}")
        .limit("{limit}")
        .end({skip: skip, limit: limit, userId: userId}).send()
        .then(function (resp) {
            addLabel(resp);
            addImageUrl(resp);
            return {recommendations: resp};
        });
};

module.exports = {
    getUserRecommendations: getUserRecommendations
};
