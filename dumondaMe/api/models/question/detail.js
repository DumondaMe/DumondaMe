'use strict';

const db = requireDb();
const cdn = require('dumonda-me-server-lib').cdn;
const answerParser = require('./answer/answerParser');
const answers = require('./answers');
const similar = require('./similar');
const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const time = require('dumonda-me-server-lib').time;
const logger = require('dumonda-me-server-lib').logging.getLogger(__filename);

const getCreator = async function (user, isTrustUser, creatorTrustUser, isHarvestingUser, userId) {
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
            isHarvestingUser,
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

const getHarvestingUserData = async function (user, createdQuestion, answeredQuestion) {
    return {
        userId: user.userId,
        name: user.name,
        startDate: user.start,
        endDate: user.end,
        slug: slug(user.name),
        userImage: await cdn.getSignedUrl(`profileImage/${user.userId}/profilePreview.jpg`),
        createdQuestion: createdQuestion,
        answeredQuestion: answeredQuestion
    }
};

const getHarvestingUser = async function (createdQuestionUser, createdAnswerUser) {
    let harvestingUser;
    if (createdQuestionUser && createdQuestionUser.userId) {
        harvestingUser = await getHarvestingUserData(createdQuestionUser, true, false);

        if (createdAnswerUser.length > 0 && createdAnswerUser[0].userId === harvestingUser.userId) {
            harvestingUser.answeredQuestion = true;
        }
    } else if (createdAnswerUser && createdAnswerUser.length > 0) {
        harvestingUser = await getHarvestingUserData(createdAnswerUser[0], false, true);
    }
    return harvestingUser;
};

const getQuestion = async function (questionId, answerId, language, userId, isSuperUser) {
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)`)
        .optionalMatch(`(:User)-[watch:WATCH]->(question)`)
        .optionalMatch(`(question)<-[:TOPIC]-(topic:Topic)`)
        .optionalMatch(`(question)<-[:SUGGESTION]-(suggestions:QuestionSuggestion)`)
        .optionalMatch(`(question)<-[:IS_CREATOR]-(harvestingUserCreatedQuestion:User:HarvestingUser)`)
        .optionalMatch(`(question)-[:ANSWER]->(:Answer)<-[:IS_CREATOR]-(harvestingUserAnswer:User:HarvestingUser)`)
        .return(`question, user, count(DISTINCT answer) AS numberOfAnswers, count(DISTINCT watch) AS numberOfWatches,
                 count(DISTINCT suggestions) AS numberOfSuggestions,
                 collect(DISTINCT {description: topic.${language}, id: topic.topicId}) AS topics,
                 harvestingUserCreatedQuestion, collect(DISTINCT harvestingUserAnswer) AS harvestingUserAnswer,
                 EXISTS((:User {userId: {userId}})-[:IS_CREATOR]->(question)) AS isAdmin,
                 EXISTS((:User {userId: {userId}})-[:IS_CONTACT]->(user)) AS isTrustUser,
                 EXISTS((user)-[:IS_CONTACT]->(:User {userId: {userId}})) AS creatorTrustUser,
                 EXISTS((:User {userId: {userId}})-[:WATCH]->(question)) AS userWatchesQuestion,
                 ANY (label IN LABELS(user) WHERE label = 'HarvestingUser') AS isHarvestingUser`)
        .end({questionId, userId}).send([answers.getAnswersCommand(questionId, answerId, 0, userId).getCommand(),
            similar.getSimilarQuestionsCommand(questionId, time.getNowUtcTimestamp(), 0, 10).getCommand()]);
    if (response[2].length === 1) {
        let questionResponse = response[2][0];
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
            questionResponse.creatorTrustUser, questionResponse.isHarvestingUser, userId);
        question.hasMoreAnswers = response[0].length > answers.PAGE_SIZE;
        if (question.hasMoreAnswers) {
            response[0] = response[0].slice(0, answers.PAGE_SIZE);
        }
        question.answers = await answerParser.getAnswers(response[0], language, userId);
        question.similarQuestions = similar.getResponse(response[1]);
        question.harvestingUser = await getHarvestingUser(questionResponse.harvestingUserCreatedQuestion,
            questionResponse.harvestingUserAnswer);
        return question;
    }
    logger.warn(`Question with id ${questionId} not found`);
    throw new Error(404);
};

module.exports = {
    getQuestion
};
