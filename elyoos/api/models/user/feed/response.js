'use strict';

const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('elyoos-server-lib').cdn;

const addDefaultAnswerProperties = function (result, feedElement) {
    if (feedElement.question) {
        result.answerId = feedElement.feedElement.answerId;
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.questionId = feedElement.question.questionId;
        result.question = feedElement.question.question;
        result.questionSlug = dashify(feedElement.question.question);
    }
};

const addCommitmentAnswerProperties = function (result, feedElement) {
    if (result.type === 'CommitmentAnswer') {
        result.commitmentId = feedElement.commitment.commitmentId;
        result.imageUrl = cdn.getPublicUrl(`commitment/${result.commitmentId}/120x120/title.jpg`);
        if (feedElement.commitment.modified) {
            result.imageUrl += `?v=${feedElement.commitment.modified}`;
        }
        result.title = feedElement.commitment.title;
        result.commitmentSlug = dashify(feedElement.commitment.title);
        result.regions = feedElement.commitmentAnswerRegions;
    }
};

const addCommitmentProperties = function (result, feedElement) {
    if (result.type === 'Commitment') {
        result.commitmentId = feedElement.feedElement.commitmentId;
        result.commitmentSlug = dashify(feedElement.feedElement.title);
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.imageUrl = cdn.getPublicUrl(`commitment/${result.commitmentId}/120x120/title.jpg`);
        if (feedElement.feedElement.modified) {
            result.imageUrl += `?v=${feedElement.feedElement.modified}`;
        }
        result.regions = feedElement.regions;
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
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.numberOfAnswers = feedElement.numberOfAnswers;
    }
};

const getAction = function (relAction) {
    if (relAction === 'UP_VOTE') {
        return 'upVote'
    } else if (relAction === 'WATCH') {
        return 'watch'
    } else if (relAction === 'IS_CREATOR' || relAction === 'ANSWER') {
        return 'created'
    }
};

const getCreator = function (feedElement) {
    if (feedElement.relWatch === 'WATCH') {
        return {
            userId: feedElement.creator.userId,
            name: feedElement.creator.name,
            slug: dashify(feedElement.creator.name)
        }
    }
    return {
        userId: feedElement.watch.userId,
        name: feedElement.watch.name,
        slug: dashify(feedElement.watch.name)
    }
};

const getFeed = function (feedElements) {
    let results = [];
    for (let feedElement of feedElements) {
        let result = {
            type: feedElement.type.filter(
                (l) => ['Youtube', 'Text', 'Link', 'Book', 'CommitmentAnswer', 'Commitment', 'Question']
                    .some(v => v === l))[0],
            action: getAction(feedElement.relAction),
            created: feedElement.created,
            creator: getCreator(feedElement)
        };
        addDefaultAnswerProperties(result, feedElement);
        addCommitmentAnswerProperties(result, feedElement);
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
