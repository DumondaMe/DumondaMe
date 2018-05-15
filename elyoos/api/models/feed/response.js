'use strict';

const dashify = require('dashify');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('elyoos-server-lib').cdn;


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

const getFeed = function (feedElements) {
    let results = [];
    for (let feedElement of feedElements) {
        let result = {
            type: feedElement.type.filter(
                (l) => ['Commitment', 'Question'].some(v => v === l))[0],
            action: 'created',
            created: feedElement.feedElement.created,
            creator: {
                userId: feedElement.creator.userId,
                name: feedElement.creator.name,
                slug: dashify(feedElement.creator.name)
            }
        };
        addQuestionProperties(result, feedElement);
        addCommitmentProperties(result, feedElement);

        results.push(result);
    }
    return results;
};

module.exports = {
    getFeed
};
