'use strict';

var db = require('../db');
var _ = require('lodash');
var dbConnectionHandling = require('./dbConnectionHandling');

var recommendationId = 0;

var init = function () {
    recommendationId = 0;
};

var crateRecommendationsForPage = function (pageId, recommendedUserIds) {
    _.forEach(recommendedUserIds, function (recommendedUserId) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:User {userId: {userId}})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: {created}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(a)")
            .end({pageId: pageId, userId: recommendedUserId.userId, recommendationId: recommendationId, created: recommendedUserId.created}).getCommand());
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:Recommendation {recommendationId: {recommendationId}})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end({pageId: pageId, recommendationId: recommendationId}).getCommand());
        recommendationId++;
    });
};

var crateRecommendationsForBlog = function (pageId, recommendedUserIds) {
    _.forEach(recommendedUserIds, function (recommendedUserId) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Blog {pageId: {pageId}}), (b:User {userId: {userId}})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: {created}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(a)")
            .end({pageId: pageId, userId: recommendedUserId.userId, recommendationId: recommendationId, created: recommendedUserId.created}).getCommand());
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Blog {pageId: {pageId}}), (b:Recommendation {recommendationId: {recommendationId}})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end({pageId: pageId, recommendationId: recommendationId}).getCommand());
        recommendationId++;
    });
};

module.exports = {
    init: init,
    crateRecommendationsForPage: crateRecommendationsForPage,
    crateRecommendationsForBlog: crateRecommendationsForBlog
};