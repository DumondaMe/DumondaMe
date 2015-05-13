'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var detailTitlePicture = require('./detailTitlePicture');
var logger = requireLogger.getLogger(__filename);

var getInstructors = function (pageId, userId) {
    return db.cypher().match("(:CoursePage {pageId: {pageId}})<-[:INSTRUCTOR]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS isLoggedInUser")
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var getCourseDetail = function (pageId, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, ':CoursePage', userId));
    commands.push(getInstructors(pageId, userId));

    return db.cypher().match("(page:CoursePage {pageId: {pageId}})")
        .return("page.title AS title, page.description AS description, page.created AS created, page.link AS link")
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            resp[2][0].instructor = resp[1];
            detailTitlePicture.addTitlePicture(pageId, resp[2][0], 'CoursePage');
            return {page: resp[2][0], administrators: {list: resp[0]}};
        });
};

module.exports = {
    getCourseDetail: getCourseDetail
};
