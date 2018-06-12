'use strict';

const db = requireDb();
const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');

let getRelation = function (isWatching) {
    if (isWatching) {
        return `WATCH`
    }
    return `IS_CREATOR`
};

let handlingResponseToQuestion = function (questions) {
    for (let question of questions) {
        question.questionSlug = dashify(question.question);
        if (question.description) {
            question.descriptionHtml = linkifyHtml(question.description);
            delete question.description;
        }
    }
};

let numberOfQuestions = function (userId, isWatching) {
    return db.cypher().match(`(user:User {userId: {userId}})-[:${getRelation(isWatching)}]->(question:Question)`)
        .return('count(*) AS numberOfQuestions')
        .end({userId});
};

let getQuestionCommand = function (userId, questionsPerPage, skipQuestions, isWatching) {
    return db.cypher().match(`(user:User {userId: {userId}})-[:${getRelation(isWatching)}]->(question:Question)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer:Answer)`)
        .optionalMatch(`(question)<-[:WATCH]-(watchingUser:User)`)
        .return(`question.question AS question, question.questionId AS questionId, question.description AS description,
                 question.created AS created, count(DISTINCT answer) AS numberOfAnswers, 
                 count(DISTINCT watchingUser) AS numberOfWatches`)
        .orderBy(`created DESC`)
        .skip(`{skipQuestions}`)
        .limit(`{questionsPerPage}`)
        .end({userId, questionsPerPage, skipQuestions});
};

let getQuestion = async function (userId, questionsPerPage, skipQuestions, isWatching) {
    let questions = await getQuestionCommand(userId, questionsPerPage, skipQuestions, isWatching)
        .send([numberOfQuestions(userId, isWatching).getCommand()]);
    return {};
};


module.exports = {
    numberOfQuestions,
    handlingResponseToQuestion,
    getQuestionCommand,
    getQuestion
};
