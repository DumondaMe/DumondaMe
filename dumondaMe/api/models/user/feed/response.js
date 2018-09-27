'use strict';

const slug = require('limax');
const linkifyHtml = require('linkifyjs/html');
const cdn = require('dumonda-me-server-lib').cdn;

const addDefaultAnswerProperties = function (result, feedElement) {
    if (feedElement.question) {
        result.answerId = feedElement.feedElement.answerId;
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.isUpVotedByUser = feedElement.isUpVotedByUser;
        result.numberOfUpVotes = feedElement.numberOfUpVotes;
        result.questionId = feedElement.question.questionId;
        result.question = feedElement.question.question;
        result.questionSlug = slug(feedElement.question.question);
        result.isAdmin = feedElement.isAdmin;
    }
};

const addCommitmentAnswerProperties = function (result, feedElement) {
    if (result.type === 'CommitmentAnswer') {
        result.commitmentId = feedElement.commitment.commitmentId;
        result.imageUrl = cdn.getPublicUrl(`commitment/${result.commitmentId}/460x460/title.jpg`);
        if (feedElement.commitment.modified) {
            result.imageUrl += `?v=${feedElement.commitment.modified}`;
        }
        result.title = feedElement.commitment.title;
        result.commitmentSlug = slug(feedElement.commitment.title);
        result.regions = feedElement.commitmentAnswerRegions;
    }
};

const addCommitmentProperties = function (result, feedElement) {
    if (result.type === 'Commitment') {
        result.commitmentId = feedElement.feedElement.commitmentId;
        result.commitmentSlug = slug(feedElement.feedElement.title);
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
        result.numberOfWatches = feedElement.numberOfWatches;
        result.isWatchedByUser = feedElement.isWatchedByUser;
        result.isAdmin = feedElement.isAdmin;
    }
};

const addLinkProperties = function (result, feedElement) {
    if (result.type === 'Link') {
        result.pageType = feedElement.feedElement.pageType;
        result.link = feedElement.feedElement.link;
        if (feedElement.feedElement.hasPreviewImage) {
            result.imageUrl = cdn.getPublicUrl(`link/${result.answerId}/460x460/preview.jpg`);
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
        result.questionSlug = slug(feedElement.feedElement.question);
        result.description = feedElement.feedElement.description;
        if (result.description) {
            result.descriptionHtml = linkifyHtml(result.description);
        }
        result.numberOfWatches = feedElement.numberOfWatches;
        result.numberOfAnswers = feedElement.numberOfAnswers;
        result.isWatchedByUser = feedElement.isWatchedByUser;
        result.isAdmin = feedElement.isAdmin;
    }
};

const addEventProperties = function (result, feedElement) {
    if (result.type === 'Event') {
        result.commitmentId = feedElement.activityElement.commitmentId;
        result.commitmentSlug = slug(feedElement.activityElement.title);
        result.commitmentTitle = feedElement.activityElement.title;
        result.commitmentDescription = feedElement.activityElement.description;
        result.commitmentImageUrl = cdn.getPublicUrl(`commitment/${result.commitmentId}/40x40/title.jpg`);
        result.commitmentImageUrlPreview = cdn.getPublicUrl(`commitment/${result.commitmentId}/320x320/title.jpg`);
        if (feedElement.feedElement.modified) {
            result.commitmentImageUrl += `?v=${feedElement.feedElement.modified}`;
            result.commitmentImageUrlPreview += `?v=${feedElement.feedElement.modified}`;
        }

        result.eventId = feedElement.feedElement.eventId;
        result.title = feedElement.feedElement.title;
        result.description = feedElement.feedElement.description;
        result.location = feedElement.feedElement.location;
        result.region = feedElement.regions[0];
        result.endDate = feedElement.feedElement.endDate;
        result.startDate = feedElement.feedElement.startDate;
    }
};

const getActivity = function (relActivity) {
    if (relActivity === 'UP_VOTE') {
        return 'upVote'
    } else if (relActivity === 'WATCH') {
        return 'watch'
    } else if (relActivity === 'IS_CREATOR' || relActivity === 'ANSWER' || relActivity === 'EVENT') {
        return 'created'
    }
};

const getUserResponse = async function (user, userId, isTrustUser) {
    return {
        userId: user.userId,
        isLoggedInUser: user.userId === userId,
        isTrustUser: isTrustUser,
        name: user.name,
        slug: slug(user.name),
        userImage: await cdn.getSignedUrl(`profileImage/${user.userId}/thumbnail.jpg`),
        userImagePreview: await cdn.getSignedUrl(`profileImage/${user.userId}/profilePreview.jpg`)
    }
};

const getUser = async function (feedElement, userId) {
    if (feedElement.relActivity === 'WATCH' || feedElement.relActivity === 'UP_VOTE') {
        return await getUserResponse(feedElement.activityElement, userId, feedElement.activityIsInTrustCircle);
    }
    return await getUserResponse(feedElement.creator, userId, feedElement.creatorIsInTrustCircle);
};

const getCreator = async function (feedElement, resultType, action, userId) {
    if (resultType !== 'Commitment' && (action === 'upVote' || action === 'watch')) {
        return await getUserResponse(feedElement.creator, userId, feedElement.creatorIsInTrustCircle);
    }
};

const getFeed = async function (feedElements, userId) {
    let results = [];
    for (let feedElement of feedElements) {
        let result = {
            type: feedElement.type.filter(
                (l) => ['Youtube', 'Text', 'Link', 'Book', 'CommitmentAnswer', 'Commitment', 'Question', 'Event']
                    .some(v => v === l))[0],
            action: getActivity(feedElement.relActivity),
            created: feedElement.created
        };
        if (result.type !== 'Event' && result.type !== 'Text') {
            result.user = await getUser(feedElement, userId);
        } else if(result.type === 'Text') {
            result.user = await getUser(feedElement, userId);
            result.creator = await getCreator(feedElement, result.type, result.action, userId);
        }
        addDefaultAnswerProperties(result, feedElement);
        addCommitmentAnswerProperties(result, feedElement);
        addCommitmentProperties(result, feedElement);
        addLinkProperties(result, feedElement);
        addYoutubeProperties(result, feedElement);
        addBookProperties(result, feedElement);
        addTextProperties(result, feedElement);
        addQuestionProperties(result, feedElement);
        addEventProperties(result, feedElement);

        results.push(result);
    }
    return results;
};

module.exports = {
    getFeed
};
