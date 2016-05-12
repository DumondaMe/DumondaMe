'use strict';

var db = require('./../../../neo4j');

var getAnswerCommand = function (questionId, skip, maxItems, label) {

    return db.cypher().match("(:ForumQuestion {questionId: {questionId}})-[:IS_ANSWER]->(answer:ForumAnswer" + label + ")")
        .optionalMatch("(answer)<-[rating:RATE_POSITIVE]-(:User)")
        .with("COUNT(rating) AS positiveRating, answer")
        .optionalMatch("(answer)-[:REFERENCE]->(page:Page)")
        .return("answer.answerId AS answerId, answer.description AS description, answer.created AS created, page, positiveRating")
        .orderBy("positiveRating DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            questionId: questionId,
            skip: skip,
            maxItems: maxItems
        });
};

var getExplanationAnswerCommand = function (questionId, skip, maxItems) {
    return getAnswerCommand(questionId, skip, maxItems, ':ForumExplanation');
};
var getSolutionAnswerCommand = function (questionId, skip, maxItems) {
    return getAnswerCommand(questionId, skip, maxItems, ':ForumSolution');
};

module.exports = {
    getExplanationAnswerCommand: getExplanationAnswerCommand,
    getSolutionAnswerCommand: getSolutionAnswerCommand
};
