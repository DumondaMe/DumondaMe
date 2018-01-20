'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('elyoos-server-lib').cdn;

const getTextAnswersCommand = function (questionId) {
    return db.cypher().match(`(:Question {questionId: {questionId}})-[:TEXT_ANSWER]-(answer:Answer)
                               <-[:IS_CREATOR]-(user:User)`)
        .return(`answer, user`)
        .orderBy(`answer.created DESC`)
        .end({questionId: questionId}).getCommand();
};

const getTextAnswers = function (answers) {
    let result = [];
    for (let answer of answers) {
        let formattedAnswer = answer.answer;
        formattedAnswer.creator = {
            name: answer.user.name,
            thumbnailUrl: cdn.getUrl(`profileImage/${answer.user.userId}/thumbnail.jpg`) //todo apply new privacy settings
        };
        result.push(formattedAnswer);
    }
    return result;
};

const getQuestion = async function (questionId) {
    const INDEX_QUESTION = 1;
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .return(`question, user`)
        .end({questionId: questionId}).send([getTextAnswersCommand(questionId)]);
    if (response[INDEX_QUESTION].length === 1) {
        let question = response[INDEX_QUESTION][0].question;
        delete question.questionId;
        question.creator = {
            name: response[INDEX_QUESTION][0].user.name,
            thumbnailUrl: cdn.getUrl(`profileImage/${response[INDEX_QUESTION][0].user.userId}/thumbnail.jpg`) //todo apply new privacy settings
        };
        question.textAnswer = getTextAnswers(response[0]);
        return question;
    } else {
        throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
    }
};

module.exports = {
    getQuestion
};
