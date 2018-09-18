'use strict';

const db = requireDb();
const exceptions = require('elyoos-server-lib').exceptions;
const cdn = require('elyoos-server-lib').cdn;
const time = require('elyoos-server-lib').time;
const slug = require('limax');
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

const getAnswers = async function (answers, language, userId) {
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
                slug: slug(answer.creator.name),
                userImage: await cdn.getSignedUrl(`profileImage/${answer.creator.userId}/thumbnail.jpg`),
                userImagePreview: await cdn.getSignedUrl(`profileImage/${answer.creator.userId}/profilePreview.jpg`),
                isLoggedInUser: answer.creator.userId === userId,
                isTrustUser: answer.isTrustUser,
            };
            if (formattedAnswer.answerType === 'Link' && formattedAnswer.hasPreviewImage) {
                formattedAnswer.imageUrl = cdn.getPublicUrl(`link/${formattedAnswer.answerId}/460x460/preview.jpg`);
            } else if (formattedAnswer.answerType === 'Book' && formattedAnswer.hasPreviewImage) {
                formattedAnswer.imageUrl = cdn.getPublicUrl(`book/${formattedAnswer.answerId}/120x250/preview.jpg`);
            } else if (formattedAnswer.answerType === 'CommitmentAnswer') {
                formattedAnswer.answerType = 'Commitment';
                formattedAnswer.commitmentId = answer.commitment.commitmentId;
                formattedAnswer.commitmentSlug = slug(answer.commitment.title);
                formattedAnswer.title = answer.commitment.title;
                formattedAnswer.imageUrl = cdn.getPublicUrl(`commitment/${formattedAnswer.commitmentId}/460x460/title.jpg`);
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

module.exports = {
    getAnswers
};
