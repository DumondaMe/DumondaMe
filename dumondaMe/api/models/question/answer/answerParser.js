'use strict';

const cdn = require('dumonda-me-server-lib').cdn;
const linkifyHtml = require('linkifyjs/html');
const slug = require('limax');

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
            isLoggedInUser: user.userId === userId,
            isTrustUser,
            isHarvestingUser
        };
    } else {
        return {
            isAnonymous: true,
            userImage: await cdn.getSignedUrl(`profileImage/default/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/default/profilePreview.jpg`)
        }
    }
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
                (l) => ['Youtube', 'Default', 'Link', 'Book', 'CommitmentAnswer'].some(v => v === l))[0];
            formattedAnswer.creator = await getCreator(answer.creator, answer.isTrustUser, answer.creatorTrustUser,
                answer.isHarvestingUser, userId);
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
            } else if (formattedAnswer.answerType === 'Default') {
                if (formattedAnswer.answer) {
                    formattedAnswer.answerHtml = linkifyHtml(formattedAnswer.answer, {attributes: {rel: 'noopener'}});
                }
                if (answer.hasImage) {
                    formattedAnswer.imageUrl = cdn.getPublicUrl(`default/${formattedAnswer.answerId}/500x500/title.jpg`);
                }
            }
            result.push(formattedAnswer);
        }
    }
    return result;
};

module.exports = {
    getAnswers
};
