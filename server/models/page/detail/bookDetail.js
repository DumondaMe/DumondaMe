'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var detailTitlePicture = require('./detailTitlePicture');

var getBookAuthors = function (pageId, userId) {

    return db.cypher().match("(:Page {pageId: {pageId}})<-[:IS_AUTHOR]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS isLoggedInUser")
        .orderBy("u.name")
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

var getDetail = function (pageId, label, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());
    commands.push(db.cypher().match("(page:Page {pageId: {pageId}, label: {label}})")
        .return("page.pageId AS pageId, page.title AS title, page.language AS language, page.description AS description, page.created AS created, " +
        "page.author AS author, page.publishDate AS publishDate, page.topic AS topic")
        .end({pageId: pageId, label: label}).getCommand());

    return getBookAuthors(pageId, userId)
        .send(commands)
        .then(function (resp) {
            addAuthors(resp[4][0], resp[5]);
            detailTitlePicture.addTitlePicture(pageId, resp[4][0], 'Book');
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getDetail: getDetail
};
