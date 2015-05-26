'use strict';

var db = require('./../../../neo4j');
var userInfo = require('../../user/userInfo');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var detailTitlePicture = require('./detailTitlePicture');
var logger = requireLogger.getLogger(__filename);

var getBookAuthors = function (pageId, userId) {

    return db.cypher().match("(:BookPage {pageId: {pageId}})<-[:IS_AUTHOR]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS isLoggedInUser")
        .end({pageId: pageId, userId: userId});
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
    commands.push(recommendation.getUserRecommendation(pageId, ':BookPage', userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId, ':BookPage').getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, ':BookPage', userId).getCommand());
    commands.push(db.cypher().match("(page:BookPage {pageId: {pageId}})")
        .return("page.title AS title, page.language AS language, page.description AS description, page.created AS created, page.author AS author, " +
        "page.publishDate AS publishDate")
        .end({pageId: pageId}).getCommand());

    return getBookAuthors(pageId, userId)
        .send(commands)
        .then(function (resp) {
            addAuthors(resp[4][0], resp[5]);
            detailTitlePicture.addTitlePicture(pageId, resp[4][0], 'BookPage');
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getBookDetail: getBookDetail
};
