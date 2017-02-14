'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createFeedbackBug = function (feedbackId, data) {
    data.title = data.title || `bug${feedbackId}Title`;
    data.description = data.description || `bug${feedbackId}Description`;
    data.operatingSystem = data.operatingSystem || `linux`;
    data.screen = data.screen || `desktop`;
    data.browser = data.browser || `firefox`;
    data.status = data.status || `open`;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Bug  {title: {title}, 
    description: {description}, status: {status}, created: {created}, modified: {modified}, feedbackId: {feedbackId}, 
    operatingSystem: {operatingSystem}, screen: {screen}, browser: {browser}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: data.title,
            description: data.description,
            created: data.created,
            modified: data.modified,
            creatorUserId: data.creatorUserId,
            status: data.status,
            operatingSystem: data.operatingSystem,
            screen: data.screen,
            browser: data.browser
        }).getCommand());
};

let createFeedbackIdea = function (feedbackId, data) {
    data.title = data.title || `idea${feedbackId}Title`;
    data.description = data.description || `idea${feedbackId}Description`;
    data.status = data.status || `open`;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Idea  {title: {title}, 
    description: {description}, status: {status},created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: data.title,
            description: data.description,
            created: data.created,
            modified: data.modified,
            creatorUserId: data.creatorUserId,
            status: data.status
        }).getCommand());
};

let createFeedbackDiscussion = function (feedbackId, data) {
    data.title = data.title || `discussion${feedbackId}Title`;
    data.description = data.description || `discussion${feedbackId}Description`;
    data.status = data.status || `open`;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Discussion  {title: {title},
    description: {description}, status: {status}, created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: data.title,
            description: data.description,
            created: data.created,
            modified: data.modified,
            creatorUserId: data.creatorUserId,
            status: data.status
        }).getCommand());
};

let createFeedbackDiscussionIdea = function (feedbackId, data) {
    data.title = data.title || `discussionIdea${feedbackId}Title`;
    data.description = data.description || `discussionIdea${feedbackId}Description`;
    data.status = data.status || `open`;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(discussion:Feedback:Discussion {feedbackId: {discussionFeedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(discussion)<-[:IS_IDEA]-(:Feedback:DiscussionIdea  {title: {title}, description: {description}, status: {status}, 
                  created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            discussionFeedbackId: data.discussionFeedbackId,
            title: data.title,
            description: data.description,
            created: data.created,
            modified: data.modified,
            creatorUserId: data.creatorUserId,
            status: data.status
        }).getCommand());
};

let createFeedbackComment = function (feedbackCommentId, data) {
    data.text = data.text || `comment${feedbackCommentId}Text`;
    data.createdByAdmin = data.createdByAdmin || null;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment  {text: {text}, created: {created}, feedbackId: {feedbackCommentId}, createdByAdmin: {createdByAdmin}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: data.feedbackId,
            feedbackCommentId: feedbackCommentId,
            created: data.created,
            creatorUserId: data.creatorUserId,
            text: data.text,
            createdByAdmin: data.createdByAdmin
        }).getCommand());
};

let createFeedbackRecommendation = function (feedbackRecommendationId, data) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(feedback)<-[:RECOMMENDS]-(:Feedback:Recommendation  {created: {created}, recommendationId: {feedbackRecommendationId}})
        <-[:RECOMMENDED_BY]-(user)`)
        .end({
            feedbackId: data.feedbackId,
            feedbackRecommendationId: feedbackRecommendationId,
            created: data.created,
            creatorUserId: data.creatorUserId,
        }).getCommand());
};

let closeFeedback = function (statusFeedbackId, data) {
    data.reasonText = data.reasonText || `closed${statusFeedbackId}Text`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .set("feedback", {status: 'closed'})
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment:Status  {status: 'closed', text: {reasonText}, created: {created}, feedbackId: {statusFeedbackId}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: data.feedbackId,
            statusFeedbackId: statusFeedbackId,
            created: data.created,
            creatorUserId: data.creatorUserId,
            reasonText: data.reasonText
        }).getCommand());
};

let reopenFeedback = function (statusFeedbackId, data) {
    data.reasonText = data.reasonText || `reopen${statusFeedbackId}Text`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .set("feedback", {status: 'open'})
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment:Status  {status: 'open', text: {reasonText}, created: {created}, feedbackId: {statusFeedbackId}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: data.feedbackId,
            statusFeedbackId: statusFeedbackId,
            created: data.created,
            creatorUserId: data.creatorUserId,
            reasonText: data.reasonText
        }).getCommand());
};

module.exports = {
    createFeedbackBug: createFeedbackBug,
    createFeedbackIdea: createFeedbackIdea,
    createFeedbackDiscussion: createFeedbackDiscussion,
    createFeedbackDiscussionIdea: createFeedbackDiscussionIdea,
    createFeedbackComment: createFeedbackComment,
    createFeedbackRecommendation: createFeedbackRecommendation,
    closeFeedback: closeFeedback,
    reopenFeedback: reopenFeedback
};