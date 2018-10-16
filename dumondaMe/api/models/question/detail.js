'use strict';

const db = requireDb();
const exceptions = require('dumonda-me-server-lib').exceptions;
const cdn = require('dumonda-me-server-lib').cdn;
const answerParser = require('./answer/answerParser');
const answers = require('./answers');
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');

const getCreator = async function (user, isTrustUser, creatorTrustUser, userId) {
    if (user.privacyMode === 'public' || user.userId === userId ||
        (user.privacyMode === 'publicEl' && userId !== null) ||
        (user.privacyMode === 'onlyContact' && creatorTrustUser)) {
        return {
            isAnonymous: false,
            name: user.name,
            userId: user.userId,
            slug: slug(user.name),
            userImage: await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${user.userId}/profilePreview.jpg`),
            isTrustUser,
            isLoggedInUser: user.userId === userId && userId !== null
        };
    } else {
        return {
            isAnonymous: true,
            userImage: await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/default/profilePreview.jpg`)
        }
    }
};

const getQuestion = async function (questionId, answerId, language, userId, isSuperUser) {
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)`)
        .optionalMatch(`(:User)-[watch:WATCH]->(question)`)
        .optionalMatch(`(question)<-[:TOPIC]-(topic:Topic)`)
        .optionalMatch(`(question)<-[:SUGGESTION]-(suggestions:QuestionSuggestion)`)
        .return(`question, user, count(DISTINCT answer) AS numberOfAnswers, count(DISTINCT watch) AS numberOfWatches,
                 count(DISTINCT suggestions) AS numberOfSuggestions,
                 collect(DISTINCT {description: topic.${language}, id: topic.topicId}) AS topics,
                 EXISTS((:User {userId: {userId}})-[:IS_CREATOR]->(question)) AS isAdmin,
                 EXISTS((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isTrustUser,
                 EXISTS((user)-[:IS_CONTACT]->(:User {userId: {userId}})) AS creatorTrustUser,
                 EXISTS((:User {userId: {userId}})-[:WATCH]->(question)) AS userWatchesQuestion`)
        .end({questionId, userId}).send([answers.getAnswersCommand(questionId, answerId, 0, userId).getCommand()]);
    if (response[1].length === 1) {
        let questionResponse = response[1][0];
        let question = questionResponse.question;
        if (question.description) {
            question.descriptionHtml = linkifyHtml(question.description, {attributes: {rel: 'noopener'}});
        }
        question.isAdmin = questionResponse.isAdmin;
        question.isSuperUser = isSuperUser;
        question.topics = questionResponse.topics;
        question.numberOfSuggestions = questionResponse.numberOfSuggestions;
        question.numberOfWatches = questionResponse.numberOfWatches;
        question.numberOfAnswers = questionResponse.numberOfAnswers;
        question.userWatchesQuestion = questionResponse.userWatchesQuestion;
        question.creator = await getCreator(questionResponse.user, questionResponse.isTrustUser,
            questionResponse.creatorTrustUser, userId);
        question.hasMoreAnswers = response[0].length > answers.PAGE_SIZE;
        if (question.hasMoreAnswers) {
            response[0] = response[0].slice(0, answers.PAGE_SIZE);
        }
        question.answers = await answerParser.getAnswers(response[0], language, userId);
        return question;
    }
    throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
};

module.exports = {
    getQuestion
};
