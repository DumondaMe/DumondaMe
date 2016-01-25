'use strict';

var db = require('./../../../neo4j');

var getLinks = function (userId, reasonId, skip, limit) {
    return db.cypher()
        .match("(reason:Reason {reasonId: {reasonId}})-[:HAS_EXPLANATION]->(explanation:ReasonExplanation)-[:REFERENCES]->(link:Link)," +
            "(user:User {userId: {userId}})")
        .optionalMatch("(explanation)<-[ratings:POSITIVE_RATING]-(:User)")
        .return("explanation.created AS created, link AS link, " +
            "COUNT(ratings) AS numberOfRatings, " +
            "EXISTS((user)-[:POSITIVE_RATING]->(explanation)) AS ratedByUser, " +
            "EXISTS((explanation)<-[:IS_ADMIN]-(user)) AS isAdmin")
        .orderBy("numberOfRatings DESC, created DESC")
        .end({
            reasonId: reasonId,
            userId: userId,
            skip: skip,
            limit: limit
        }).getCommand();
};

var getPages = function (userId, reasonId, skip, limit) {
    return db.cypher()
        .match("(reason:Reason {reasonId: {reasonId}})-[:HAS_EXPLANATION]->(explanation:ReasonExplanation)-[:REFERENCES]->(page:Page)," +
            "(user:User {userId: {userId}})")
        .optionalMatch("(explanation)<-[ratings:POSITIVE_RATING]-(:User)")
        .return("explanation.created AS created, page AS page, " +
            "COUNT(ratings) AS numberOfRatings, " +
            "EXISTS((user)-[:POSITIVE_RATING]->(explanation)) AS ratedByUser, " +
            "EXISTS((explanation)<-[:IS_ADMIN]-(user)) AS isAdmin")
        .orderBy("numberOfRatings DESC, created DESC")
        .end({
            reasonId: reasonId,
            userId: userId,
            skip: skip,
            limit: limit
        }).getCommand();
};

var getDetail = function (userId, reasonId) {

    var commands = [];
    commands.push(getLinks(userId, reasonId, 0, 10));
    commands.push(getPages(userId, reasonId, 0, 10));

    return db.cypher().match("(reason:Reason {reasonId: {reasonId}})-[:BELONGS]->(problem:Problem), (user:User {userId: {userId}})")
        .optionalMatch("(reason)<-[ratings:POSITIVE_RATING]-(:User)")
        .return("reason.title AS title, reason.description AS description, reason.created AS created, " +
            "COUNT(ratings) AS numberOfRatings, problem AS problem, " +
            "EXISTS((user)-[:POSITIVE_RATING]->(reason)) AS ratedByUser, " +
            "EXISTS((reason)<-[:IS_ADMIN]-(user)) AS isAdmin")
        .orderBy("numberOfRatings DESC, created DESC")
        .end({
            reasonId: reasonId,
            userId: userId
        }).send(commands).then(function (resp) {
            return {reason: resp[2][0], links: resp[0], pages: resp[1]};
        });
};


module.exports = {
    getDetail: getDetail
};
