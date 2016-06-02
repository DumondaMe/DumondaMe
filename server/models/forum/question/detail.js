'use strict';

var db = require('./../../../neo4j');

var statistic = require('./../answer/statistic');
var pageResponse = require('./pageResponse');

var getDetail = function (userId, questionId) {

    var commands = [];
    commands.push(statistic.getExplanationAnswerCommand(userId, questionId, 0, 10).getCommand());
    commands.push(statistic.getSolutionAnswerCommand(userId, questionId, 0, 10).getCommand());

    return db.cypher().match("(question:ForumQuestion {questionId: {questionId}}), (user:User {userId: {userId}})")
        .return(`question.questionId AS questionId, question.description AS description, question.topic AS topic, question.language AS language,
                 EXISTS((user)-[:IS_ADMIN]->(question)) AS isAdmin`)
        .end({questionId: questionId, userId: userId})
        .send(commands).then(function (resp) {
            pageResponse.preparePageResponse(resp[0]);
            pageResponse.preparePageResponse(resp[1]);
            return {question: resp[2][0], explanation: resp[0], solution: resp[1]};
        });
};


module.exports = {
    getDetail: getDetail
};
