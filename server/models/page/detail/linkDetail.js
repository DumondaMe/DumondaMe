'use strict';

var db = require('./../../../neo4j');
var administrator = require('./administrator');
var recommendation = require('./recommendation');
var response = require('./detailResponse');
var cdn = require('../../util/cdn');

var getDetail = function (pageId, label, userId) {

    var commands = [];

    commands.push(administrator.getAdministrator(pageId, userId));
    commands.push(recommendation.getUserRecommendation(pageId, userId));
    commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
    commands.push(recommendation.getRecommendationSummaryContacts(pageId, userId).getCommand());

    return db.cypher().match("(page:Page {pageId: {pageId}, label: {label}})")
        .return("page.pageId AS pageId, page.title AS title, page.description AS description, page.category AS category, page.link AS link, " +
        "page.hostname AS hostname, page.created AS created, page.modified AS modified, page.label AS label")
        .end({pageId: pageId, label: label})
        .send(commands)
        .then(function (resp) {
            resp[4][0].imageUrl = cdn.getUrl('pages/' + pageId + '/normal.jpg');
            return response.getResponse(resp, resp[4][0], pageId, userId);
        });
};

module.exports = {
    getDetail: getDetail
};
