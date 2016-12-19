'use strict';

let db = requireDb();
let util = require('./util');
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getOrderBy = function (order) {
    let orderBy = "numberOfRecommendations DESC";
    if (order === 'newestModification') {
        orderBy = "lastModified DESC";
    }
    return orderBy;
};

let getDiscussionCommand = function (params) {
    return db.cypher().match(`(discussion:Feedback:Discussion {feedbackId: {discussionId}})<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch("(discussion)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .with("discussion, creator, count(discussionIdea) AS numberOfIdeas")
        .optionalMatch("(discussion)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .with("discussion, discussionIdea, creator, numberOfIdeas")
        .optionalMatch("(discussionIdea)<-[:RECOMMENDS|COMMENT]-(feedbackRef)")
        .with("discussion, discussionIdea, creator, numberOfIdeas, max(feedbackRef.created) AS feedbackRef1Created, max(feedbackRef.modified) AS feedbackRef1Modified")
        .unwind(`[feedbackRef1Created, feedbackRef1Modified, discussionIdea.created, discussionIdea.modified] AS feedbackRefModifiedCombined`)
        .return("discussion, creator, numberOfIdeas, max(feedbackRefModifiedCombined) AS lastModified")
        .end(params);
};

let getDiscussionIdeas = function (params) {
    return db.cypher().match(`(feedback:Feedback:Discussion {feedbackId: {discussionId}})`)
        .optionalMatch("(feedback)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)<-[:IS_CREATOR]-(creator:User)")
        .with("creator, discussionIdea")
        .optionalMatch("(discussionIdea)<-[:RECOMMENDS|COMMENT]-(feedbackRef)")
        .with("creator, discussionIdea, max(feedbackRef.created) AS feedbackRef1Created, max(feedbackRef.modified) AS feedbackRef1Modified")
        .optionalMatch("(discussionIdea)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .with("creator, discussionIdea, feedbackRef1Created, feedbackRef1Modified, count(recommendation) AS numberOfRecommendations")
        .optionalMatch("(discussionIdea)<-[:COMMENT]-(comment:Feedback:Comment)")
        .with("creator, discussionIdea, feedbackRef1Created, feedbackRef1Modified, numberOfRecommendations, count(comment) AS numberOfComments")
        .unwind(`[feedbackRef1Created, feedbackRef1Modified, discussionIdea.created, discussionIdea.modified] AS feedbackRefModifiedCombined`)
        .return(`creator, discussionIdea, max(feedbackRefModifiedCombined) AS lastModified, 
                 numberOfRecommendations, numberOfComments`)
        .orderBy(getOrderBy(params.order)).skip("{skip}").limit("{maxItems}").end(params);
};

let getDiscussion = function (discussion) {
    let formattedDiscussion = {};
    formattedDiscussion.title = discussion.discussion.title;
    formattedDiscussion.description = discussion.discussion.description;
    formattedDiscussion.created = discussion.discussion.created;
    formattedDiscussion.lastModified = discussion.lastModified;
    formattedDiscussion.creator = {name: discussion.creator.name};
    formattedDiscussion.numberOfIdeas = discussion.numberOfIdeas;
    formattedDiscussion.status = discussion.discussion.status;
    return formattedDiscussion;
};

let getFeedback = function (feedbacks) {
    let formattedFeedbacks = [];
    feedbacks.forEach(function (feedback) {
        let formattedFeedback = {};
        if (feedback.hasOwnProperty('discussionIdea')) {
            formattedFeedback.title = feedback.discussionIdea.title;
            formattedFeedback.created = feedback.discussionIdea.created;
            formattedFeedback.lastModified = feedback.lastModified;
            formattedFeedback.feedbackId = feedback.discussionIdea.feedbackId;
            formattedFeedback.type = 'DiscussionIdea';
            formattedFeedback.creator = {name: feedback.creator.name};
            formattedFeedback.numberOfRecommendations = feedback.numberOfRecommendations;
            formattedFeedback.numberOfComments = feedback.numberOfComments;
            formattedFeedbacks.push(formattedFeedback);
        }
    });
    return formattedFeedbacks;
};

let getOverview = function (params) {
    let commands = [];
    commands.push(getDiscussionCommand(params).getCommand());
    return getDiscussionIdeas(params).send(commands).then(function (resp) {
        if (resp[0].length === 0) {
            return exceptions.getInvalidOperation(`Discussion does not exist ${params.discussionId}`, logger, req);
        }
        return {
            feedback: getFeedback(resp[1]), discussion: getDiscussion(resp[0][0])
        };
    });
};


module.exports = {
    getOverview: getOverview
};
