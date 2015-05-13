'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var detailTitlePicture = require('./detailTitlePicture');
var underscore = require('underscore');
var cdn = require('../../util/cdn');
var logger = requireLogger.getLogger(__filename);

var getPrincipal = function (pageId, userId) {

    return db.cypher().match("(:SchoolPage {pageId: {pageId}})<-[:PRINCIPAL]-(u:User)")
        .return("u.name AS name, u.userId AS userId, u.userId = {userId} AS isLoggedInUser")
        .end({pageId: pageId, userId: userId})
        .getCommand();
};

var getCourses = function (pageId) {

    return db.cypher().match("(:SchoolPage {pageId: {pageId}})-[:OFFER]->(u:CoursePage)")
        .return("u.title AS title, u.pageId AS pageId")
        .end({pageId: pageId})
        .getCommand();
};

var addPreviewToCourse = function (schoolPage, courses) {

    underscore.forEach(courses, function (course) {
        course.previewUrl = cdn.getUrl('pages/CoursePage/' + course.pageId + '/pageTitlePicturePreview.jpg');
    });

    schoolPage.pageReference = courses;
};

var getSchoolDetail = function (pageId, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, ':SchoolPage', userId));
    commands.push(getPrincipal(pageId, userId));
    commands.push(getCourses(pageId));

    return db.cypher().match("(page:SchoolPage {pageId: {pageId}})")
        .return("page.title AS title, page.description AS description, page.created AS created, page.link AS link")
        .end({pageId: pageId})
        .send(commands)
        .then(function (resp) {
            resp[3][0].principal = resp[1];
            addPreviewToCourse(resp[3][0], resp[2]);
            detailTitlePicture.addTitlePicture(pageId, resp[3][0], 'SchoolPage');
            return {page: resp[3][0], administrators: {list: resp[0]}};
        });
};

module.exports = {
    getSchoolDetail: getSchoolDetail
};
