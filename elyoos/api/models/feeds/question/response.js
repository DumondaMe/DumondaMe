'use strict';

const dashify = require('dashify');
const db = requireDb();
const cdn = require('elyoos-server-lib').cdn;
const PAGE_SIZE = 20;

const addDefaultAnswerProperties = function (result, feedElement) {
    if (feedElement.question) {
        result.answerId = feedElement.feedElement.answerId;
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        result.questionId = feedElement.question.questionId;
        result.question = feedElement.question.question;
        result.questionSlug = dashify(feedElement.question.question);
    }
};

const addCommitmentProperties = function (result, feedElement) {
    if (result.type === 'CommitmentAnswer') {
        result.type = 'Commitment';
        result.commitmentId = feedElement.commitment.commitmentId;
        result.imageUrl = cdn.getPublicUrl(`commitment/${result.commitmentId}/120x120/title.jpg`);
        result.title = feedElement.commitment.title;
        result.commitmentSlug = dashify(feedElement.commitment.title);
    }
};

const addLinkProperties = function (result, feedElement) {
    if (result.type === 'Link') {
        result.pageType = feedElement.feedElement.pageType;
        result.link = feedElement.feedElement.link;
        if (feedElement.feedElement.hasPreviewImage) {
            result.imageUrl = cdn.getPublicUrl(`link/${result.answerId}/120x120/preview.jpg`);
        }
    }
};

const addYoutubeProperties = function (result, feedElement) {
    if (result.type === 'Youtube') {
        result.linkEmbed = feedElement.feedElement.linkEmbed;
        result.link = feedElement.feedElement.link;
        result.idOnYoutube = feedElement.feedElement.idOnYoutube;
    }
};

const addBookProperties = function (result, feedElement) {
    if (result.type === 'Book' && feedElement.feedElement.hasPreviewImage) {
        result.imageUrl = cdn.getPublicUrl(`book/${result.answerId}/120x250/preview.jpg`);
    }
};

const addTextProperties = function (result, feedElement) {
    if (result.type === 'Text') {
        result.answer = feedElement.feedElement.answer;
    }
};

const addQuestionProperties = function (result, feedElement) {
    if (result.type === 'Question') {
        result.questionId = feedElement.feedElement.questionId;
        result.question = feedElement.feedElement.question;
        result.questionSlug = dashify(feedElement.feedElement.question);
        result.description = feedElement.feedElement.description;
        result.numberOfAnswers = feedElement.numberOfAnswers;
    }
};

const getFeed = async function (feedElements) {
    let results = [];
    for (let feedElement of feedElements) {
        let result = {
            type: feedElement.type.filter(
                (l) => ['Youtube', 'Text', 'Link', 'Book', 'CommitmentAnswer', 'Question'].some(v => v === l))[0],
            action: 'created',
            created: feedElement.feedElement.created,
            creator: {
                userId: feedElement.creator.userId,
                name: feedElement.creator.name,
                slug: dashify(feedElement.creator.name),
                thumbnailUrl: await cdn.getSignedUrl(`profileImage/${feedElement.creator.userId}/thumbnail.jpg`)
            }
        };
        addDefaultAnswerProperties(result, feedElement);
        addCommitmentProperties(result, feedElement);
        addLinkProperties(result, feedElement);
        addYoutubeProperties(result, feedElement);
        addBookProperties(result, feedElement);
        addTextProperties(result, feedElement);
        addQuestionProperties(result, feedElement);

        results.push(result);
    }
    return results;
};

module.exports = {
    getFeed
};
