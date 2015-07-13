'use strict';

var db = require('./../../../neo4j');
var time = require('./../../../lib/time');
var _ = require('underscore');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var detailTitlePicture = require('./detailTitlePicture');

var getCourses = function (pageId) {
    return db.cypher().match("(:Page {pageId: {pageId}, label: 'Education'})-[:HAS]->(course:Page {label: 'Course'})")
        .optionalMatch("(course)-[:HAS]->(activity:Activity)")
        .where("activity.startTime >= {actualTime}")
        .return("course, activity")
        .orderBy("course.pageId, activity.startTime")
        .end({pageId: pageId, actualTime: time.getNowUtcTimestamp()}).getCommand();
};

var addCourseToResponse = function (courses, page) {
    page.activities = [];
    page.course = [];
    _.forEach(courses, function (course) {
        if (course.hasOwnProperty("activity") && course.hasOwnProperty("course")) {
            course.activity.pageId = course.course.pageId;
            course.activity.title = course.course.title;
            course.activity.label = course.course.label;
            page.activities.push(course.activity);
        }

        if (course.hasOwnProperty("course")) {
            if (!_.findWhere(page.course, {pageId: course.course.pageId})) {
                page.course.push(course.course);
            }
        }
    });
};

var getDetail = function (pageId, label, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());
    commands.push(getCourses(pageId));
    return db.cypher().match("(page:Page {pageId: {pageId}, label: 'Education'})")
        .optionalMatch("(page)-[:HAS]->(course:Page {label: 'Course'})")
        .return("page.title AS title, page.language AS language, page.description AS description, page.created AS created, page.website AS website, " +
        "page.street AS street, page.place AS place, page.postalCode AS postalCode, page.country AS country")
        .end({pageId: pageId, label: label})
        .send(commands)
        .then(function (resp) {
            detailTitlePicture.addTitlePicture(pageId, resp[5][0]);
            addCourseToResponse(resp[4], resp[5][0]);
            return response.getResponse(resp, resp[5][0], pageId, userId);
        });

};

module.exports = {
    getDetail: getDetail
};
