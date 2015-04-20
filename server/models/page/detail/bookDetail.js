'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var detailTitlePicture = require('./detailTitlePicture');
var underscore = require('underscore');
var logger = requireLogger.getLogger(__filename);

var getBookAuthors = function (pageId) {

    return db.cypher().match("(:BookPage {pageId: {pageId}})<-[:IS_AUTHOR]-(u:User)")
        .return("u.name AS name, u.userId AS userId")
        .end({pageId: pageId})
        .getCommand();
};

var addAuthors = function (bookPage, authorLinks) {
    var authors = [];
    if (bookPage.author) {
        authors.push({name: bookPage.author});
        delete bookPage.author;
    }
    if (authorLinks && authorLinks.length > 0) {
        authors = authors.concat(authorLinks);
    }

    bookPage.author = authors;
};

var getBookDetail = function (pageId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, ':BookPage'));
    commands.push(getBookAuthors(pageId));

    return db.cypher().match("(page:BookPage {pageId: {pageId}})")
        .return("page.title AS title, page.description AS description, page.created AS created, page.author AS author")
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            addAuthors(resp[2][0], resp[1]);
            detailTitlePicture.addTitlePicture(pageId, resp[2][0]);
            return {page: resp[2][0], administrators: resp[0]};
        });
};

module.exports = {
    getBookDetail: getBookDetail
};
