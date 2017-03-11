'use strict';

let db = requireDb();

let statistic = require('./../answer/statistic');
let pageResponse = require('./pageResponse');

let getDetail = function (userId, questionId) {

    let commands = [];
    commands.push(statistic.getProArgumentAnswerCommand(userId, questionId, 0, 10).getCommand());
    commands.push(statistic.getCounterArgumentAnswerCommand(userId, questionId, 0, 10).getCommand());
    commands.push(statistic.getSolutionAnswerCommand(userId, questionId, 0, 10).getCommand());

    return db.cypher().match("(question:ForumQuestion {questionId: {questionId}}), (user:User {userId: {userId}})")
        .return(`question.questionId AS questionId, question.description AS description, question.topic AS topic, question.language AS language,
                 EXISTS((user)-[:IS_ADMIN]->(question)) AS isAdmin`)
        .end({questionId: questionId, userId: userId})
        .send(commands).then(function (resp) {
            pageResponse.preparePageResponse(resp[0]);
            pageResponse.preparePageResponse(resp[1]);
            pageResponse.preparePageResponse(resp[2]);
            return {question: resp[3][0], proArgument: resp[0], counterArgument: resp[1], solution: resp[2]};
        });
};


module.exports = {
    getDetail: getDetail
};
