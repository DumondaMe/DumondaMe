'use strict';

var db = require('./../../../neo4j/index');
var exceptions = require('./../../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);


var checkAllowedPositiveRateReason = function (userId, reasonId, req) {

    function checkRatingAlreadyExists(resp) {
        return resp.length > 0;
    }

    return db.cypher()
        .match("(user:User {userId: {userId}}), (reason:Reason {reasonId: {reasonId}})")
        .with("user, reason")
        .match("(user)-[rating:POSITIVE_RATING]->(reason)")
        .return("rating")
        .end({userId: userId, reasonId: reasonId}).send()
        .then(function (resp) {
            if (checkRatingAlreadyExists(resp)) {
                return exceptions.getInvalidOperation('User has reason already positive rated ' + reasonId, logger, req);
            }
        });
};

var checkAllowedRemoveRating = function (userId, reasonId, req) {

    function checkRatingNotExists(resp) {
        return resp.length === 0;
    }

    return db.cypher()
        .match("(user:User {userId: {userId}})-[rating:POSITIVE_RATING]->(reason:Reason {reasonId: {reasonId}})")
        .return("rating")
        .end({userId: userId, reasonId: reasonId}).send()
        .then(function (resp) {
            if (checkRatingNotExists(resp)) {
                return exceptions.getInvalidOperation('User has reason not positively rated ' + reasonId, logger, req);
            }
        });
};

module.exports = {
    checkAllowedPositiveRateReason: checkAllowedPositiveRateReason,
    checkAllowedRemoveRating: checkAllowedRemoveRating
};
