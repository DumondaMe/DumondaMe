'use strict';

var db = require('./../../neo4j');
var underscore = require('underscore');
var cdn = require('../util/cdn');
var userInfo = require('../user/userInfo');

var addPageUrl = function (previews) {
    underscore.forEach(previews, function (preview) {
        if (preview.label === 'Book') {
            preview.url = cdn.getUrl('pages/' + preview.pageId + '/pagePreview.jpg');
            delete preview.link;
        } else if(preview.label === 'Link') {
            preview.url = cdn.getUrl('pages/' + preview.pageId + '/preview.jpg');
        }
    });
};

var addRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            summary: {
                numberOfRatings: preview.numberOfRatings,
                rating: preview.rating
            }
        };

        delete preview.numberOfRatings;
        delete preview.rating;
    });
};

var addContactRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            contact: {
                name: preview.name,
                comment: preview.comment,
                rating: preview.rating,
                url: userInfo.getImageForPreview(preview, 'thumbnail.jpg')
            }
        };

        delete preview.profileVisible;
        delete preview.imageVisible;
        delete preview.rating;
        delete preview.name;
        delete preview.comment;
        delete preview.userId;
    });
};

var pagePreviewQuery = function (params, orderBy, startQuery) {

    var commands = [];

    commands.push(db.cypher().addCommand(startQuery.getCommandString())
        .return("count(*) AS totalNumberOfPages").end(params).getCommand());

    return startQuery
        .return("page.pageId AS pageId, page.title AS title, page.description AS description, page.label AS label, page.language AS language, " +
            "page.link AS link, page.hostname AS hostname, numberOfRatings, rating, " +
            "EXISTS((page)<-[:IS_ADMIN]-(:User {userId: {userId}})) AS isAdmin")
        .orderBy(orderBy)
        .skip("{skip}")
        .limit("{limit}")
        .end(params)
        .send(commands)
        .then(function (resp) {
            addRecommendation(resp[1]);
            addPageUrl(resp[1]);
            return {pages: resp[1], totalNumberOfPages: resp[0][0].totalNumberOfPages};
        });
};

module.exports = {
    pagePreviewQuery: pagePreviewQuery,
    addPageUrl: addPageUrl,
    addRecommendation: addRecommendation,
    addContactRecommendation: addContactRecommendation
};
