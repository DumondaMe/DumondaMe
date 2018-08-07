'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const cdn = require('elyoos-server-lib').cdn;
const time = require('elyoos-server-lib').time;
const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');

const getEvents = function (events, language) {
    let result = [];
    for (let index = 0; index < events.length && index < 2; index++) {
        let event = events[index];
        if (event.event && event.region) {
            result.push({
                eventId: event.event.eventId,
                title: event.event.title,
                startDate: event.event.startDate,
                endDate: event.event.endDate,
                location: event.event.location,
                region: event.region[language]
            })
        }
    }
    return result;
};

const getAnswers = function (answers, language) {
    let result = [];
    for (let answer of answers) {
        if (answer.answer) {
            let formattedAnswer = answer.answer;
            formattedAnswer.upVotes = answer.upVotes;
            formattedAnswer.numberOfNotes = answer.numberOfNotes;
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
                if (answer.commitment.modified) {
                    formattedAnswer.imageUrl += `?v=${answer.commitment.modified}`;
                }
                formattedAnswer.regions = answer.regions.map((region) => region[language]);
                formattedAnswer.events = getEvents(answer.events, language)
            }
            result.push(formattedAnswer);
        }
    }
    return result;
};

const getAnswersCommand = function (questionId, userId) {
    return db.cypher()
        .match(`(q:Question {questionId: {questionId}})-[:ANSWER]->(answer:Answer)<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch(`(answer)<-[upVotesRel:UP_VOTE]-(:User)`)
        .with(`q, creator, answer, count(DISTINCT upVotesRel) AS upVotes,
               creator.userId = {userId} AS isAdmin, labels(answer) AS answerType,
               EXISTS((:User {userId: {userId}})-[:UP_VOTE]->(answer)) AS hasVoted`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .limit(20)
        .optionalMatch(`(answer)-[:NOTE]->(note:Note)`)
        .optionalMatch(`(answer)-[:COMMITMENT]->(commitment:Commitment)-[:BELONGS_TO_REGION]-(region:Region)`)
        .with(`answer, creator, upVotes, isAdmin, hasVoted, commitment, answerType, region, note`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .limit(20)
        .optionalMatch(`(commitment)-[:EVENT]->(event:Event)-[:BELONGS_TO_REGION]->(eventRegion:Region)`)
        .where(`event.endDate > {now}`)
        .with(`answer, creator, upVotes, isAdmin, hasVoted, commitment, answerType, region, eventRegion, note, event`)
        .orderBy(`upVotes DESC, answer.created DESC, event.startDate`)
        .return(`DISTINCT answer, creator, upVotes, isAdmin, hasVoted, commitment, answerType, 
                 collect(DISTINCT region) AS regions, count(DISTINCT note) AS numberOfNotes,
                 collect(DISTINCT {event: event, region: eventRegion}) AS events`)
        .orderBy(`upVotes DESC, answer.created DESC`)
        .end({questionId, userId, now: time.getNowUtcTimestamp()}).getCommand();
};

const getQuestion = async function (questionId, language, userId) {
    let response = await db.cypher().match(`(question:Question {questionId: {questionId}})<-[:IS_CREATOR]-(user:User)`)
        .optionalMatch(`(question)-[:ANSWER]->(answer)`)
        .optionalMatch(`(:User)-[watch:WATCH]->(question)`)
        .optionalMatch(`(question)<-[:TOPIC]-(topic:Topic)`)
        .return(`question, user, count(DISTINCT answer) AS numberOfAnswers, count(DISTINCT watch) AS numberOfWatches,
                 collect(DISTINCT topic.${language}) AS topics,
                 EXISTS((:User {userId: {userId}})-[:IS_CREATOR]->(question)) AS isAdmin,
                 EXISTS((:User {userId: {userId}})-[:WATCH]->(question)) AS userWatchesQuestion`)
        .end({questionId, userId}).send([getAnswersCommand(questionId, userId)]);
    if (response[1].length === 1) {
        let questionResponse = response[1][0];
        let question = questionResponse.question;
        if (question.description) {
            question.descriptionHtml = linkifyHtml(question.description);
        }
        question.isAdmin = questionResponse.isAdmin;
        question.topics = questionResponse.topics;
        question.numberOfWatches = questionResponse.numberOfWatches;
        question.numberOfAnswers = questionResponse.numberOfAnswers;
        question.userWatchesQuestion = questionResponse.userWatchesQuestion;
        question.creator = {
            name: questionResponse.user.name,
            userId: questionResponse.user.userId,
            slug: dashify(questionResponse.user.name)
        };
        question.answers = getAnswers(response[0], language);
        return question;
    }
    throw new exceptions.InvalidOperation(`Question with id ${questionId} not found`);
};

module.exports = {
    getQuestion
};
