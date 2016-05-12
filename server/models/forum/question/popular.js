'use strict';

var db = require('./../../../neo4j');

var getQuestions = function (userId, maxItems, skip) {

    return db.cypher().match("(question:ForumQuestion)")
        .optionalMatch("(question)-[:IS_ANSWER]->(questionElement:ForumAnswer)<-[rating:RATE_POSITIVE]-(:User)")
        .return("COUNT(rating) AS activityRating, question.questionId AS questionId, question.description AS description, " +
            "question.category AS category")
        .orderBy("activityRating DESC")
        .skip("{skip}")
        .limit("{maxItems}")
        .end({
            maxItems: maxItems,
            skip: skip
        })
        .send().then(function (resp) {
            return {question: resp};
        });
};


module.exports = {
    getQuestions: getQuestions
};
