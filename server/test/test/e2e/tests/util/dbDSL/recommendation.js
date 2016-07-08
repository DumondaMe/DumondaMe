'use strict';

var db = require('../db');
var _ = require('lodash');
var dbConnectionHandling = require('./dbConnectionHandling');

var recommendationId = 0;
var created = 0;

var init = function () {
    recommendationId = 0;
    created = 0;
};

var crateRecommendationsForPage = function (pageId, recommendedUserIds) {
    _.forEach(recommendedUserIds, function (userId) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:User {userId: {userId}})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: {created}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(a)")
            .end({pageId: pageId, userId: userId, recommendationId: recommendationId, created: created}).getCommand());
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:Recommendation {recommendationId: {recommendationId}})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end({pageId: pageId, recommendationId: recommendationId}).getCommand());
        recommendationId++;
        created++;
    });
};

var crateRecommendationsForBlog = function (blogId, recommendedUserIds) {
    _.forEach(recommendedUserIds, function (userId) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Blog {blogId: {blogId}}), (b:User {userId: {userId}})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: {created}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(a)")
            .end({blogId: blogId, userId: userId, recommendationId: recommendationId, created: created}).getCommand());
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Blog {blogId: {blogId}}), (b:Recommendation {recommendationId: {recommendationId}})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end({blogId: blogId, recommendationId: recommendationId}).getCommand());
        recommendationId++;
        created++;
    });
};

module.exports = {
    init: init,
    crateRecommendationsForPage: crateRecommendationsForPage,
    crateRecommendationsForBlog: crateRecommendationsForBlog
};