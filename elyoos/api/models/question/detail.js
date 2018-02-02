'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('elyoos-server-lib').cdn;

const getAnswers = function (answers) {
    let result = [];
    for (let answer of answers) {
        let formattedAnswer = answer.answer;
        formattedAnswer.upVotes = answer.upVotes;
        formattedAnswer.creator = {
            name: answer.creator.name,
            thumbnailUrl: cdn.getUrl(`profileImage/${answer.creator.userId}/thumbnail.jpg`) //todo apply new privacy settings
        };
        result.push(formattedAnswer);
    }
    return result;
};

const getQuestion = async function (questionId) {
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)<-[:IS_CREATOR]-(answerCreator:User)`)
        .with(`question, user, answer, answerCreator`)
        .orderBy(`answer.created DESC`)
        .limit(20)
        .optionalMatch(`(answer)<-[upVotesRel:UP_VOTE]-(:User)`)
        .with(`question, user, answer, answerCreator, count(DISTINCT upVotesRel) AS upVotes`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .return(`question, user, collect({answer: answer, creator: answerCreator, upVotes: upVotes}) AS answers`)
        .end({questionId: questionId}).send();
    if (response.length === 1) {
        let question = response[0].question;
        delete question.questionId;
        question.creator = {
            name: response[0].user.name,
            thumbnailUrl: cdn.getUrl(`profileImage/${response[0].user.userId}/thumbnail.jpg`) //todo apply new privacy settings
        };
        question.answers = getAnswers(response[0].answers);
        return question;
    } else {
        throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
    }
};

module.exports = {
    getQuestion
};
