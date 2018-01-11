'use strict';

let db = requireDb();
let uuid = require('elyoos-server-lib').uuid;
let time = require('elyoos-server-lib').time;
let cdn = require('elyoos-server-lib').cdn;
let recommendation = require('../page/detail/recommendation');
let exceptions = require('elyoos-server-lib').exceptions;
let securityRecommendation = require('./security');
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkAddingRecommendationAllowed = function (userId, pageId, isBlog, req) {
    let commands = [];

    commands.push(db.cypher().match("(blog:Blog {pageId: {pageId}})").return("blog").end({pageId: pageId}).getCommand());

    return db.cypher().match("(user:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(page:Page {pageId: {pageId}})")
        .return("user.userId AS userId, LABELS(page) AS labels")
        .end({userId: userId, pageId: pageId}).send(commands)
        .then(function (resp) {
            if (resp[1].length > 0) {
                return exceptions.getInvalidOperation('User tries to add recommendation for page ' + pageId + ' twice', logger, req);
            }
            if (resp[0].length > 0 && !isBlog) {
                return exceptions.getInvalidOperation('Wrong api call for ' + pageId, logger, req);
            }
        });
};

let deleteRecommendation = function (userId, recommendationId, pageId, req) {
    return securityRecommendation.checkDeleteRecommendationAllowed(userId, recommendationId, req).then(function () {

        let commands = [];

        commands.push(db.cypher().match("(:User {userId: {userId}})-[rel:RECOMMENDS]->" +
            "(rec:Recommendation {recommendationId: {recommendationId}})-[rel2]->(page:Page)")
            .delete("rel, rec, rel2")
            .end({
                userId: userId,
                recommendationId: recommendationId
            }).getCommand());

        commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, userId)
            .send(commands)
            .then(function (resp) {
                return {
                    recommendation: {
                        all: resp[1][0],
                        contact: resp[2][0]
                    }
                };
            });
    });
};

let addRecommendation = function (userId, pageId, isBlog, req) {
    return checkAddingRecommendationAllowed(userId, pageId, isBlog, req).then(function () {

        let recommendationId = uuid.generateUUID(), commands = [], created = time.getNowUtcTimestamp();

        commands.push(db.cypher().match("(user:User {userId: {userId}}), (page:Page {pageId: {pageId}})")
            .create("(user)-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement {created: {created}, " +
                "recommendationId: {recommendationId}})-[:RECOMMENDS]->(page)")
            .with("recommendation, page")
            .create("(recommendation)-[:PINWALL_DATA]->(page)")
            .end({
                userId: userId,
                pageId: pageId,
                recommendationId: recommendationId,
                created: created
            }).getCommand());
        commands.push(recommendation.getRecommendationSummaryAll(pageId).getCommand());
        return recommendation.getRecommendationSummaryContacts(pageId, userId)
            .send(commands)
            .then(function (resp) {
                return {
                    profileUrl: cdn.getUrl('profileImage/' + userId + '/thumbnail.jpg'),
                    recommendationId: recommendationId,
                    created: created,
                    recommendation: {
                        all: resp[1][0],
                        contact: resp[2][0]
                    }
                };
            });
    });
};

module.exports = {
    addRecommendation: addRecommendation,
    deleteRecommendation: deleteRecommendation
};
