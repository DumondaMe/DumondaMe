'use strict';

let db = requireDb();

let getAnswerCommand = function (userId, questionId, skip, maxItems, label) {

    return db.cypher().match("(:ForumQuestion {questionId: {questionId}})-[:IS_ANSWER]->(answer:ForumAnswer" + label + ")")
        .optionalMatch("(answer)<-[rating:RATE_POSITIVE]-(:User)")
        .with("COUNT(rating) AS positiveRating, answer")
        .match("(user:User {userId: {userId}})")
        .optionalMatch("(answer)-[:REFERENCE]->(page:Page)")
        .return(`answer.answerId AS answerId, answer.title AS title, answer.created AS created, page, positiveRating, 
                 EXISTS((answer)<-[:IS_ADMIN]-(user)) AS isAdmin,
                 EXISTS((answer)<-[:RATE_POSITIVE]-(user)) AS ratedByUser`)
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

let getExplanationAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, ':ForumExplanation');
};
let getSolutionAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, ':ForumSolution');
};

module.exports = {
    getExplanationAnswerCommand: getExplanationAnswerCommand,
    getSolutionAnswerCommand: getSolutionAnswerCommand
};
