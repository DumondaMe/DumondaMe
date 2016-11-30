'use strict';

var db = requireDb();
var underscore = require('underscore');
var cdn = require('../util/cdn');
var userInfo = require('../user/userInfo');
var addPageUrl = function (previews, thumbnail) {
    var bookImage = thumbnail ? '/thumbnail.jpg' : '/pagePreview.jpg',
        linkImage = thumbnail ? '/thumbnail.jpg' : '/preview.jpg';
    underscore.forEach(previews, function (preview) {
        if (preview.label === 'Book') {
            preview.url = cdn.getUrl('pages/' + preview.pageId + bookImage);
            delete preview.link;
        } else if(preview.label === 'Link' && preview.heightPreviewImage) {
            preview.url = cdn.getUrl('pages/' + preview.pageId + linkImage);
        } else if(preview.label === 'Blog' && preview.heightPreviewImage) {
            preview.url = cdn.getUrl('blog/' + preview.pageId + linkImage);
        }
    });
};

var addRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            summary: {
                numberOfRecommendations: preview.numberOfRecommendations,
            }
        };

        delete preview.numberOfRecommendations;
    });
};

var addContactRecommendation = function (previews) {
    underscore.forEach(previews, function (preview) {

        preview.recommendation = {
            contact: {
                name: preview.name,
                comment: preview.comment,
                url: userInfo.getImageForPreview(preview, 'thumbnail.jpg')
            }
        };

        delete preview.profileVisible;
        delete preview.imageVisible;
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
            "page.link AS link, page.hostname AS hostname, numberOfRecommendations, page.heightPreviewImage AS heightPreviewImage," +
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
