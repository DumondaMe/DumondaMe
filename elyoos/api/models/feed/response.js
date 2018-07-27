'use strict';

const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('elyoos-server-lib').cdn;


const addQuestionProperties = async function (result, feedElement) {
    if (result.type === 'Question') {
        result.questionId = feedElement.feedElement.questionId;
        result.question = feedElement.feedElement.question;
        result.questionSlug = dashify(feedElement.feedElement.question);
        result.description = feedElement.feedElement.description;
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.numberOfAnswers = feedElement.numberOfAnswers;
        result.created = feedElement.feedElement.created;
        result.user = {
            userId: feedElement.creator.userId,
            name: feedElement.creator.name,
            slug: dashify(feedElement.creator.name),
            userImage: await cdn.getSignedUrl(`profileImage/${feedElement.creator.userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${feedElement.creator.userId}/profilePreview.jpg`)
        };
    }
};

const addCommitmentProperties = async function (result, feedElement) {
    if (result.type === 'Commitment') {
        result.commitmentId = feedElement.feedElement.commitmentId;
        result.commitmentSlug = dashify(feedElement.feedElement.title);
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.imageUrl = cdn.getPublicUrl(`commitment/${result.commitmentId}/460x460/title.jpg`);
        if (feedElement.feedElement.modified) {
            result.imageUrl += `?v=${feedElement.feedElement.modified}`;
        }
        result.regions = feedElement.regions;
        result.created = feedElement.feedElement.created;
        result.user = {
            userId: feedElement.creator.userId,
            name: feedElement.creator.name,
            slug: dashify(feedElement.creator.name),
            userImage: await cdn.getSignedUrl(`profileImage/${feedElement.creator.userId}/thumbnail.jpg`),
            userImagePreview: await cdn.getSignedUrl(`profileImage/${feedElement.creator.userId}/profilePreview.jpg`)
        };
    }
};

const addEventProperties = function (result, feedElement) {
    if (result.type === 'Event') {
        result.commitmentId = feedElement.creator.commitmentId;
        result.commitmentSlug = dashify(feedElement.creator.title);
        result.commitmentTitle = feedElement.creator.title;
        result.eventId = feedElement.feedElement.eventId;
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        result.location = feedElement.feedElement.location;
        result.region = feedElement.regions[0];
        result.startDate = feedElement.feedElement.startDate;
        result.endDate = feedElement.feedElement.endDate;
    }
};

const getFeed = async function (feedElements) {
    let results = [];
    for (let feedElement of feedElements) {
        let result = {
            type: feedElement.type.filter((l) => ['Commitment', 'Question', 'Event'].some(v => v === l))[0],
            action: 'created',
        };
        await addQuestionProperties(result, feedElement);
        await addCommitmentProperties(result, feedElement);
        addEventProperties(result, feedElement);

        results.push(result);
    }
    return results;
};

module.exports = {
    getFeed
};
