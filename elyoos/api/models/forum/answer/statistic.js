'use strict';

let db = requireDb();

let getAnswerCommand = function (userId, questionId, skip, maxItems, type) {

    return db.cypher().match("(:ForumQuestion {questionId: {questionId}})-[:IS_ANSWER]->(answer:ForumAnswer {type: {type}})")
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
            questionId: questionId, skip: skip, maxItems: maxItems,
            userId: userId, type: type
        });
};

let getProArgumentAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, 'proArgument');
};
let getCounterArgumentAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, 'counterArgument');
};
let getSolutionAnswerCommand = function (userId, questionId, skip, maxItems) {
    return getAnswerCommand(userId, questionId, skip, maxItems, 'solution');
};

module.exports = {
    getProArgumentAnswerCommand: getProArgumentAnswerCommand,
    getCounterArgumentAnswerCommand: getCounterArgumentAnswerCommand,
    getSolutionAnswerCommand: getSolutionAnswerCommand
};
