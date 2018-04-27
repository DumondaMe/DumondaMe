'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const cdn = require('elyoos-server-lib').cdn;
const dashify = require('dashify');

const getAnswers = function (answers) {
    let result = [];
    for (let answer of answers) {
        if (answer.answer) {
            let formattedAnswer = answer.answer;
            formattedAnswer.upVotes = answer.upVotes;
            formattedAnswer.isAdmin = answer.isAdmin || false;
            formattedAnswer.hasVoted = answer.hasVoted || false;
            formattedAnswer.answerType = answer.answerType.filter(
                (l) => ['Youtube', 'Text', 'Link', 'Book', 'CommitmentAnswer'].some(v => v === l))[0];
            formattedAnswer.creator = {
                name: answer.creator.name,
                userId: answer.creator.userId,
                slug: dashify(answer.creator.name)
            };
            if (formattedAnswer.answerType === 'Link' && formattedAnswer.hasPreviewImage) {
                formattedAnswer.imageUrl = cdn.getPublicUrl(`link/${formattedAnswer.answerId}/120x120/preview.jpg`);
            } else if (formattedAnswer.answerType === 'Book' && formattedAnswer.hasPreviewImage) {
                formattedAnswer.imageUrl = cdn.getPublicUrl(`book/${formattedAnswer.answerId}/120x250/preview.jpg`);
            } else if (formattedAnswer.answerType === 'CommitmentAnswer') {
                formattedAnswer.answerType = 'Commitment';
                formattedAnswer.commitmentId = answer.commitment.commitmentId;
                formattedAnswer.commitmentSlug = dashify(answer.commitment.title);
                formattedAnswer.title = answer.commitment.title;
                formattedAnswer.imageUrl = cdn.getPublicUrl(`commitment/${formattedAnswer.commitmentId}/120x120/title.jpg`);
                formattedAnswer.regions = answer.regions.map((region) => region.code);
            }
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
        .optionalMatch(`(question)<-[:TOPIC]-(topic:Topic)`)
        .with(`question, user, answer, topic, answerCreator, count(DISTINCT upVotesRel) AS upVotes,
               answerCreator.userId = {userId} AS isAdmin, labels(answer) AS answerType,
               EXISTS((:User {userId: {userId}})-[:UP_VOTE]->(answer)) AS hasVoted`)
        .optionalMatch(`(question)-[:ANSWER]->(countAnswer)`)
        .with(`question, user, answer, topic, answerCreator, upVotes, isAdmin, answerType, hasVoted,
               count(DISTINCT countAnswer) AS numberOfAnswers`)
        .optionalMatch(`(answer)-[:COMMITMENT]->(commitment:Commitment)-[:BELONGS_TO_REGION]-(region:Region)`)
        .with(`question, user, answer, topic, answerCreator, upVotes, isAdmin, answerType, hasVoted, numberOfAnswers,
               commitment, collect(region) AS regions`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .optionalMatch(`(:User)-[watch:WATCH]->(question)`)
        .return(`question, user, EXISTS((:User {userId: {userId}})-[:IS_CREATOR]->(question)) AS isAdmin,
                 collect(DISTINCT topic.name) AS topics, count(DISTINCT watch) AS numberOfWatches, numberOfAnswers,
                 EXISTS((:User {userId: {userId}})-[:WATCH]->(question)) AS userWatchesQuestion,
                 collect(DISTINCT {answer: answer, creator: answerCreator, upVotes: upVotes, isAdmin: isAdmin, 
                         hasVoted: hasVoted, commitment: commitment, regions: regions, 
                         answerType: answerType}) AS answers`)
        .end({questionId, userId}).send();
    if (response.length === 1) {
        let question = response[0].question;
        question.isAdmin = response[0].isAdmin;
        question.topics = response[0].topics;
        question.numberOfWatches = response[0].numberOfWatches;
        question.numberOfAnswers = response[0].numberOfAnswers;
        question.userWatchesQuestion = response[0].userWatchesQuestion;
        question.creator = {
            name: response[0].user.name,
            userId: response[0].user.userId,
            slug: dashify(response[0].user.name)
        };
        question.answers = getAnswers(response[0].answers);
        return question;
    }
    throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
};

module.exports = {
    getQuestion
};
