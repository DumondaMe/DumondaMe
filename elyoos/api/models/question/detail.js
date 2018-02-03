'use strict';

const db = requireDb();
const _ = require('lodash');
const exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('elyoos-server-lib').cdn;

const getAnswers = function (answers) {
    let result = [];
    for (let answer of answers) {
        if (answer.answer) {
            let formattedAnswer = answer.answer;
            formattedAnswer.upVotes = answer.upVotes;
            formattedAnswer.isAdmin = answer.isAdmin || false;
            formattedAnswer.answerType = answer.answerType.filter((l) => ['Youtube', 'Text'].some(v => v === l))[0];
            formattedAnswer.creator = {
                name: answer.creator.name,
                thumbnailUrl: cdn.getUrl(`profileImage/${answer.creator.userId}/thumbnail.jpg`) //todo apply new privacy settings
            };
            result.push(formattedAnswer);
        }
    }
    return result;
};

const getQuestion = async function (questionId, userId) {
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)<-[:IS_CREATOR]-(answerCreator:User)`)
        .optionalMatch(`(answer)<-[upVotesRel:UP_VOTE]-(:User)`)
        .with(`question, user, answer, answerCreator, upVotesRel`)
        .orderBy(`answer.created DESC`)
        .limit(20)
        .with(`question, user, answer, answerCreator, count(DISTINCT upVotesRel) AS upVotes, 
               answerCreator.userId = {userId} AS isAdmin, labels(answer) AS answerType`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .return(`question, user, 
                 collect({answer: answer, creator: answerCreator, upVotes: upVotes, isAdmin: isAdmin, 
                          answerType: answerType}) AS answers`)
        .end({questionId, userId}).send();
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
