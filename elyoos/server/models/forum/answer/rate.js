'use strict';

let db = requireDb();
let moment = require('moment');
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let rateExists = function (userId, answerId, req) {
    return db.cypher().match("(:User {userId: {userId}})-[:RATE_POSITIVE]->(:ForumAnswer {answerId: {answerId}})")
        .return("COUNT(*) AS numberOfAnswers").end({userId: userId, answerId: answerId}).send().then(function (resp) {
            if (resp[0].numberOfAnswers > 0) {
                return exceptions.getInvalidOperation("Rate for answer " + answerId + " exists already", logger, req);
            }
        });
};

let ratePositive = function (userId, answerId, req) {

    return rateExists(userId, answerId, req).then(function () {
        let timeCreatedRating = Math.floor(moment.utc().valueOf() / 1000);
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

let deleteRating = function (userId, answerId) {
    return db.cypher().match("(:User {userId: {userId}})-[rating:RATE_POSITIVE]->(:ForumAnswer {answerId: {answerId}})")
        .delete("rating")
        .end({userId: userId, answerId: answerId})
        .send();
};


module.exports = {
    ratePositive: ratePositive,
    deleteRating: deleteRating
};
