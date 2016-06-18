'use strict';

var db = require('./../../neo4j');
var uuid = require('./../../lib/uuid');
var time = require('./../../lib/time');
var cdn = require('../util/cdn');
var exceptions = require('./../../lib/error/exceptions');
var securityRecommendation = require('./security');
var logger = requireLogger.getLogger(__filename);

var getRecommendationSummaryAll = function (blogId) {
    return db.cypher().match("(:Blog {blogId: {blogId}})<-[:RECOMMENDS]-(:Recommendation)<-[:RECOMMENDS]-(:User)")
        .return("count(*) AS numberOfRecommendations")
        .end({blogId: blogId});
};

var getRecommendationSummaryContacts = function (blogId, userId) {
    return db.cypher().match("(:Blog {blogId: {blogId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(:User)" +
        "<-[:IS_CONTACT]-(:User {userId: {userId}})")
        .return("count(*) AS numberOfRecommendations")
        .end({blogId: blogId, userId: userId});
};

var checkUserIsNotWriter = function (blogId) {
    return db.cypher().match(`(:Blog {blogId: {blogId}})<-[:WRITTEN]-(writer:User)`)
        .return("writer.userId AS writerUserId")
        .end({blogId: blogId});
};

var checkAddingRecommendationAllowed = function (userId, blogId, req) {
    var commands = [];

    commands.push(checkUserIsNotWriter(blogId).getCommand());
    return db.cypher().match(`(user:User {userId: {userId}})-[:RECOMMENDS]->(:Recommendation)-[:RECOMMENDS]->(:Blog {blogId: {blogId}})`)
        .return("user.userId AS userId")
        .end({userId: userId, blogId: blogId}).send(commands)
        .then(function (resp) {
            if (resp[1].length > 0) {
                return exceptions.getInvalidOperation('User tries to add recommendation for blog ' + blogId + ' with label ' +
                    blogId + ' twice', logger, req);
            } else if(resp[0].length === 1 && resp[0][0].writerUserId === userId) {
                return exceptions.getInvalidOperation('User can not recommend own blog ' + blogId, logger, req);
            }
        });
};

var deleteRecommendation = function (userId, recommendationId, pageId, req) {
    return securityRecommendation.checkDeleteRecommendationAllowed(userId, recommendationId, req).then(function () {

        var commands = [];

        commands.push(db.cypher().match("(:User {userId: {userId}})-[rel:RECOMMENDS]->" +
                "(rec:Recommendation {recommendationId: {recommendationId}})-[rel2]->(blog:Blog)")
            .delete("rel, rec, rel2")
            .end({
                userId: userId,
                recommendationId: recommendationId
            }).getCommand());

        commands.push(getRecommendationSummaryAll(pageId).getCommand());
        return getRecommendationSummaryContacts(pageId, userId)
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

var addRecommendation = function (userId, blogId, comment, req) {

    return checkAddingRecommendationAllowed(userId, blogId, req).then(function () {

        var recommendationId = uuid.generateUUID(), commands = [], created = time.getNowUtcTimestamp();

        commands.push(db.cypher().match("(user:User {userId: {userId}}), (blog:Blog {blogId: {blogId}})")
            .create(`(user)-[:RECOMMENDS]->(recommendation:Recommendation:PinwallElement {created: {created}, rating: 1, 
                      comment: {comment}, recommendationId: {recommendationId}})-[:RECOMMENDS]->(blog)`)
            .with("recommendation, blog")
            .create("(recommendation)-[:PINWALL_DATA]->(blog)")
            .end({
                userId: userId,
                blogId: blogId,
                recommendationId: recommendationId,
                comment: comment,
                created: created
            }).getCommand());
        commands.push(getRecommendationSummaryAll(blogId).getCommand());
        return getRecommendationSummaryContacts(blogId, userId)
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
