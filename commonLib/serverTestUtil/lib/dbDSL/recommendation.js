'use strict';

let db = require('../db');
let _ = require('lodash');
let dbConnectionHandling = require('./dbConnectionHandling');

let recommendationId = 0;

let init = function () {
    recommendationId = 0;
};

let crateRecommendationsForPage = function (pageId, recommendedUserIds) {
    _.forEach(recommendedUserIds, function (recommendedUserId) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:User {userId: {userId}})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: {created}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(a)")
            .end({
                pageId: pageId,
                userId: recommendedUserId.userId,
                recommendationId: `${recommendationId}`,
                created: recommendedUserId.created
            }).getCommand());
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:Recommendation {recommendationId: {recommendationId}})")
            .create("(b)-[:PINWALL_DATA]->(a)")
            .end({pageId: pageId, recommendationId: `${recommendationId}`}).getCommand());
        recommendationId++;
    });
};

let crateRecommendationsForBlog = function (pageId, recommendedUserIds) {
    _.forEach(recommendedUserIds, function (recommendedUserId) {
        dbConnectionHandling.getCommands().push(db.cypher().match("(a:Blog {pageId: {pageId}}), (b:User {userId: {userId}})")
            .create("(b)-[:RECOMMENDS]->(:Recommendation:PinwallElement {created: {created}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(a)")
            .end({
                pageId: pageId, userId: recommendedUserId.userId, recommendationId: `${recommendationId}`, created: recommendedUserId.created
            }).getCommand());
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