'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let checkRecommendationExists = function (userId, recommendationId) {
    return db.cypher().match(`(recommendation:Feedback:Recommendation {recommendationId: {recommendationId}})`)
        .return("recommendation").end({userId: userId, recommendationId: recommendationId});
};

let checkCreatedByUser = function (userId, recommendationId) {
    return db.cypher().match(`(user:User {userId: {userId}})-[:RECOMMENDED_BY]->(:Feedback:Recommendation {recommendationId: {recommendationId}})`)
        .return("user").end({userId: userId, recommendationId: recommendationId});
};

let allowedToDeleteRecommendation = function (userId, recommendationId, req) {
    let commands = [];
    commands.push(checkCreatedByUser(userId, recommendationId).getCommand());

    return checkRecommendationExists(userId, recommendationId).send(commands).then(function (resp) {
        if (resp[0].length === 0) {
            return exceptions.getInvalidOperation(`User ${userId} is not creator of recommendation ${recommendationId}`, logger, req);
        }
        if (resp[1].length === 0) {
            return exceptions.getInvalidOperation(`Recommendation of feedback ${recommendationId} does not exist`, logger, req);
        }
    });
};

let deleteRecommendation = function (userId, params, req) {
    return allowedToDeleteRecommendation(userId, params.recommendationId, req).then(function () {
        return db.cypher().match(`(user:User {userId: {userId}})-[rel:RECOMMENDED_BY]->
                                  (feedback:Feedback:Recommendation {recommendationId: {recommendationId}})-[rel2:RECOMMENDS]->(:Feedback)`)
            .delete(`feedback, rel, rel2`)
            .end({userId: userId, recommendationId: params.recommendationId}).send();
    });
};


module.exports = {
    delete: deleteRecommendation
};
