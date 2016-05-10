'use strict';

var db = require('./../../../neo4j');

var explanationQuestionOverview = require('./../explanation/questionOverview');
var solutionQuestionOverview = require('./../solution/questionOverview');

var getDetail = function (userId, questionId) {

    var commands = [];
    commands.push(explanationQuestionOverview.getExplanationCommand(userId, questionId, 0, 10).getCommand());
    commands.push(solutionQuestionOverview.getSolutionCommand(userId, questionId, 0, 10).getCommand());

    return db.cypher().match("(question:ForumQuestion {questionId: {questionId}})")
        .return("question.description AS description, question.category AS category, question.language AS language")
        .end({
            userId: userId,
            questionId: questionId
        })
        .send(commands).then(function (resp) {
            return {question: resp[2][0], explanation: resp[0], solution: resp[1]};
        });
};


module.exports = {
    getDetail: getDetail
};
