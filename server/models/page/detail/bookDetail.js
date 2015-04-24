'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var detailTitlePicture = require('./detailTitlePicture');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getBookAuthors = function (pageId, userId) {

    return db.cypher().match("(:BookPage {pageId: {pageId}})<-[:IS_AUTHOR]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS isLoggedInUser")
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var addAuthors = function (bookPage, authorLinks) {
    var authors = [];
    if (bookPage.author) {
        authors.push({name: bookPage.author, isLoggedInUser: false});
        delete bookPage.author;
    }
    if (authorLinks && authorLinks.length > 0) {
        authors = authors.concat(authorLinks);
    }

    bookPage.author = authors;
};

var getBookDetail = function (pageId, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, ':BookPage', userId));
    commands.push(getBookAuthors(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, ':BookPage', userId));
    commands.push(recommendation.getOtherUserRecommendation(pageId, ':BookPage', userId, 10, 0));

    return db.cypher().match("(page:BookPage {pageId: {pageId}})")
        .return("page.title AS title, page.description AS description, page.created AS created, page.author AS author")
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            addAuthors(resp[4][0], resp[1]);
            recommendation.addProfileThumbnail(resp[2][0], userId);
            recommendation.addProfileThumbnails(resp[3]);
            detailTitlePicture.addTitlePicture(pageId, resp[4][0], 'BookPage');
            return {
                page: resp[4][0],
                administrators: resp[0],
                recommendation: {
                    user: resp[2][0],
                    users: resp[3]
                }
            };
        });
};

module.exports = {
    getBookDetail: getBookDetail
};
