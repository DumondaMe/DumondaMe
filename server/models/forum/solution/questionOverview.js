'use strict';

var db = require('./../../../neo4j');

var getSolutionCommand = function (userId, questionId, skip, maxItems) {

    return db.cypher().match("(:ForumQuestion {questionId: {questionId}})-[:HAS_SOLUTION]->(solution:ForumSolution)")
        .optionalMatch("(solution)<-[rating:RATE_POSITIVE]-(:User)")
        .with("COUNT(rating) AS positiveRating, solution")
        .optionalMatch("(solution)-[:REFERENCE]->(page:Page)")
        .return("solution.solutionId AS solutionId, solution.description AS description, solution.created AS created, page, positiveRating")
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
    getSolutionCommand: getSolutionCommand
};
