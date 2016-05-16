'use strict';

var db = require('./../../../neo4j');

var getAnswerCommand = function (userId, questionId, skip, maxItems, label) {

    return db.cypher().match("(:ForumQuestion {questionId: {questionId}})-[:IS_ANSWER]->(answer:ForumAnswer" + label + ")")
        .optionalMatch("(answer)<-[rating:RATE_POSITIVE]-(:User)")
        .with("COUNT(rating) AS positiveRating, answer")
        .optionalMatch("(answer)-[:REFERENCE]->(page:Page)")
        .return("answer.answerId AS answerId, answer.title AS title, answer.created AS created, page, positiveRating, " +
            "EXISTS((answer)<-[:RATE_POSITIVE]-(:User {userId: {userId}})) AS ratedByUser")
        .orderBy("positiveRating DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            questionId: questionId,
            skip: skip,
            maxItems: maxItems,
            userId: userId
        });
};

var getExplanationAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, ':ForumExplanation');
};
var getSolutionAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, ':ForumSolution');
};

module.exports = {
    getExplanationAnswerCommand: getExplanationAnswerCommand,
    getSolutionAnswerCommand: getSolutionAnswerCommand
};
