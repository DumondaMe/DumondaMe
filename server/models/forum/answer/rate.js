'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var rateExists = function (userId, answerId, req) {
    return db.cypher().match("(:User {userId: {userId}})-[:RATE_POSITIVE]->(:ForumAnswer {answerId: {answerId}})")
        .return("COUNT(*) AS numberOfAnswers").end({userId: userId, answerId: answerId}).send().then(function (resp) {
            if (resp[0].numberOfAnswers > 0) {
                return exceptions.getInvalidOperation("Rate for answer " + answerId + " exists already", logger, req);
            }
        });
};

var ratePositive = function (userId, answerId, req) {

    return rateExists(userId, answerId, req).then(function () {
        var timeCreatedRating = Math.floor(moment.utc().valueOf() / 1000);
        return db.cypher().match("(u:User {userId: {userId}}), (answer:ForumAnswer {answerId: {answerId}})")
            .createUnique("(u)-[:RATE_POSITIVE {created: {timeCreatedRating}}]->(answer)")
            .end({
                userId: userId,
                timeCreatedRating: timeCreatedRating,
                answerId: answerId
            })
            .send();
    });
};

var deleteRating = function (userId, answerId) {
    return db.cypher().match("(:User {userId: {userId}})-[rating:RATE_POSITIVE]->(:ForumAnswer {answerId: {answerId}})")
        .delete("rating")
        .end({userId: userId, answerId: answerId})
        .send();
};


module.exports = {
    ratePositive: ratePositive,
    deleteRating: deleteRating
};
