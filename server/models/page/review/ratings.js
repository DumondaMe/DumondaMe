'use strict';

var db = require('./../../../neo4j');

var getMatchQuery = function (onlyContacts) {
    var matchQuery = "(page:Page {pageId: {pageId}})<-[:RECOMMENDS]-(rec:Recommendation)<-[:RECOMMENDS]-(otherUser:User)";
    if (onlyContacts) {
        matchQuery = matchQuery.concat("<-[IS_CONTACT]-(user:User {userId: {userId}})");
    } else {
        matchQuery = matchQuery.concat(", (user:User {userId: {userId}})");
    }

    return db.cypher().match(matchQuery);
};

var getRatings = function (userId, requestParams) {

    var matchQuery = getMatchQuery( requestParams.onlyContacts);

    return matchQuery
        .return("rec.rating AS rating, count(*) AS numberOfRatings")
        .orderBy("rating")
        .end({pageId: requestParams.pageId, userId: userId}).send()
        .then(function (resp) {
            return {ratings: resp};
        });
};

module.exports = {
    getRatings: getRatings
};
