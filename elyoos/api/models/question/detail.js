'use strict';

const db = requireDb();
const _ = require('lodash');
const exceptions = require('elyoos-server-lib').exceptions;
let cdn = require('elyoos-server-lib').cdn;

const getAnswers = async function (answers) {
    let result = [];
    for (let answer of answers) {
        if (answer.answer) {
            let formattedAnswer = answer.answer;
            formattedAnswer.upVotes = answer.upVotes;
            formattedAnswer.isAdmin = answer.isAdmin || false;
            formattedAnswer.hasVoted = answer.hasVoted || false;
            formattedAnswer.answerType = answer.answerType.filter((l) => ['Youtube', 'Text'].some(v => v === l))[0];
            formattedAnswer.creator = {
                name: answer.creator.name,
                thumbnailUrl: await cdn.getSignedUrl(`profileImage/${answer.creator.userId}/thumbnail.jpg`) //todo apply new privacy settings
            };
            result.push(formattedAnswer);
        }
    }
    return result;
};

const getQuestion = async function (questionId, userId) {
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)<-[:IS_CREATOR]-(answerCreator:User)`)
        .with(`question, user, answer, answerCreator`)
        .orderBy(`answer.created DESC`)
        .limit(20)
        .optionalMatch(`(answer)<-[upVotesRel:UP_VOTE]-(:User)`)
        .with(`question, user, answer, answerCreator, count(DISTINCT upVotesRel) AS upVotes, 
               answerCreator.userId = {userId} AS isAdmin, labels(answer) AS answerType,
               EXISTS((:User {userId: {userId}})-[:UP_VOTE]->(answer)) AS hasVoted`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .return(`question, user, 
                 collect({answer: answer, creator: answerCreator, upVotes: upVotes, isAdmin: isAdmin, 
                          hasVoted: hasVoted, answerType: answerType}) AS answers`)
        .end({questionId, userId}).send();
    if (response.length === 1) {
        let question = response[0].question;
        delete question.questionId;
        question.creator = {
            name: response[0].user.name,
            thumbnailUrl: await cdn.getSignedUrl(`profileImage/${response[0].user.userId}/thumbnail.jpg`) //todo apply new privacy settings
        };
        question.answers = await getAnswers(response[0].answers);
        return question;
    } else {
        throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
    }
};

module.exports = {
    getQuestion
};
