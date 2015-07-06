'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var detailTitlePicture = require('./detailTitlePicture');

var getDetail = function (pageId, label, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());
    return db.cypher().match("(page:Page {pageId: {pageId}, label: {label}})")
        .return("page.title AS title, page.language AS language, page.description AS description, page.created AS created, page.website AS website, " +
        "page.street AS street, page.place AS place, page.postalCode AS postalCode, page.country AS country")
        .end({pageId: pageId, label: label})
        .send(commands)
        .then(function (resp) {
            detailTitlePicture.addTitlePicture(pageId, resp[4][0]);
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });

};

module.exports = {
    getDetail: getDetail
};
