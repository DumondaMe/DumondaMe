'use strict';

var db = require('./../../../neo4j/index');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var checkAllowedToEditPage = function (userId, pageId, req) {

    function userNotAllowedToEditPage(resp) {
        return resp.length === 0;
    }

    return db.cypher()
        .match("(page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .return("user.userId AS userId")
        .end({userId: userId, pageId: pageId}).send()
        .then(function (resp) {
            if (userNotAllowedToEditPage(resp)) {
                return exceptions.getInvalidOperation('User tried to edit page with no Admin rights ' + pageId, logger, req);
            }
        });
};

var checkAllowedToDeletePage = function (userId, pageId, req) {

    var commands = [];

    function userNotAdmin(resp) {
        return resp[1].length === 0;
    }

    function pageAlreadyRated(resp) {
        return resp[0].length > 0;
    }

    commands.push(db.cypher().match("(otherUser:User)-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page:Page {pageId: {pageId}})")
        .where("otherUser.userId <> {userId}").return("otherUser").end({userId: userId, pageId: pageId}).getCommand());

    return db.cypher()
        .match("(page:Page {pageId: {pageId}})<-[:IS_ADMIN]-(user:User {userId: {userId}})")
        .return("page.pageId AS pageId")
        .end({userId: userId, pageId: pageId}).send(commands)
        .then(function (resp) {
            if (userNotAdmin(resp)) {
                return exceptions.getInvalidOperation('User tried to delete a page where he is not admin' + pageId, logger, req);
            }
            if (pageAlreadyRated(resp)) {
                return exceptions.getInvalidOperation('Page is already rated by other users' + pageId, logger, req);
            }
        });
};

module.exports = {
    checkAllowedToEditPage: checkAllowedToEditPage,
    checkAllowedToDeletePage: checkAllowedToDeletePage
};
