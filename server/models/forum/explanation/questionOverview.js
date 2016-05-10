'use strict';

var db = require('./../../../neo4j');

var getExplanationCommand = function (userId, questionId, skip, maxItems) {

    return db.cypher().match("(:ForumQuestion {questionId: {questionId}})-[:HAS_EXPLANATION]->(explanation:ForumExplanation)")
        .optionalMatch("(explanation)<-[rating:RATE_POSITIVE]-(:User)")
        .with("COUNT(rating) AS positiveRating, explanation")
        .optionalMatch("(explanation)-[:REFERENCE]->(page:Page)")
        .return("explanation.explanationId AS explanationId, explanation.description AS description, explanation.created AS created, page, " +
            "positiveRating")
        .orderBy("positiveRating DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            userId: userId,
            questionId: questionId,
            skip: skip,
            maxItems: maxItems
        });
};


module.exports = {
    getExplanationCommand: getExplanationCommand
};
