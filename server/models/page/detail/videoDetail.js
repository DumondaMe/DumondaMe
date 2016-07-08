'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');

var getDetail = function (pageId, label, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());

    return db.cypher().match("(page:Page {pageId: {pageId}, label: {label}})")
        .return(`page.pageId AS pageId, page.title AS title, page.description AS description, page.topic AS topic, page.link AS link,
                 page.created AS created, page.modified AS modified, page.label AS label, page.language AS language`)
        .end({pageId: pageId, label: label})
        .send(commands)
        .then(function (resp) {
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getDetail: getDetail
};
