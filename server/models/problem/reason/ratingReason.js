'use strict';

var db = require('./../../../neo4j');
var moment = require('moment');
var check = require('./check/reason');

var countRatingReason = function () {
    return db.cypher().match("(:User)-[:POSITIVE_RATING]->(:Reason)")
        .return("count(*) AS numberOfRatings").end();

};

var positiveRateReasonCommand = function (userId, reasonId) {
    var created = Math.floor(moment.utc().valueOf() / 1000);
    return db.cypher().match("(u:User {userId: {userId}}), (reason:Reason {reasonId: {reasonId}})")
        .createUnique("(u)-[rating:POSITIVE_RATING {created: {created}}]->(reason)")
        .return("rating.created AS created")
        .end({
            userId: userId,
            reasonId: reasonId,
            created: created
        }).getCommand();
};

var positiveRateReason = function (userId, reasonId, req) {

    return check.checkAllowedPositiveRateReason(userId, reasonId, req).then(function () {
        return countRatingReason().send([positiveRateReasonCommand(userId, reasonId)]).then(function (resp) {
                if (resp[0][0].hasOwnProperty("created")) {
                    return {created: resp[0][0].created, numberOfRatings: resp[1][0].numberOfRatings};
                }
                return null;
            });
    });
};

var removeRatingReasonCommand = function (userId, reasonId) {
    return db.cypher().match("(u:User {userId: {userId}})-[rating:POSITIVE_RATING]->(reason:Reason {reasonId: {reasonId}})")
        .delete("rating")
        .end({
            userId: userId,
            reasonId: reasonId
        }).getCommand();
};

var removeRatingReason = function (userId, reasonId, req) {

    return check.checkAllowedRemoveRating(userId, reasonId, req).then(function () {
        return countRatingReason().send([removeRatingReasonCommand(userId, reasonId)]).then(function (resp) {
            return {numberOfRatings: resp[1][0].numberOfRatings};
        });
    });
};


module.exports = {
    positiveRateReason: positiveRateReason,
    removeRatingReason: removeRatingReason
};
