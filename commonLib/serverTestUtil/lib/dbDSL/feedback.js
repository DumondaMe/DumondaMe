'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createFeedbackBug = function (feedbackId, creatorUserId, created, modified, status, title, description) {
    title = title || `bug${feedbackId}Title`;
    description = description || `bug${feedbackId}Description`;
    status = status || `open`;
    modified = modified || created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Bug  {title: {title}, 
    description: {description}, status: {status}, created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: title,
            description: description,
            created: created,
            modified: modified,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackIdea = function (feedbackId, creatorUserId, created, modified, status, title, description) {
    title = title || `idea${feedbackId}Title`;
    description = description || `idea${feedbackId}Description`;
    status = status || `open`;
    modified = modified || created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Idea  {title: {title}, 
    description: {description}, status: {status},created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: title,
            description: description,
            created: created,
            modified: modified,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackDiscussion = function (feedbackId, creatorUserId, created, modified, status, title, description) {
    title = title || `discussion${feedbackId}Title`;
    description = description || `discussion${feedbackId}Description`;
    status = status || `open`;
    modified = modified || created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Discussion  {title: {title},
    description: {description}, status: {status}, created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: title,
            description: description,
            created: created,
            modified: modified,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackDiscussionIdea = function (feedbackId, discussionFeedbackId, creatorUserId, created, modified, status, title, description) {
    title = title || `discussionIdea${feedbackId}Title`;
    description = description || `discussionIdea${feedbackId}Description`;
    status = status || `open`;
    modified = modified || created;
    dbConnectionHandling.getCommands().push(db.cypher().match('(discussion:Feedback:Discussion {feedbackId: {discussionFeedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(discussion)<-[:IS_IDEA]-(:Feedback:DiscussionIdea  {title: {title}, description: {description}, status: {status}, 
                  created: {created}, modified: {modified}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            discussionFeedbackId: discussionFeedbackId,
            title: title,
            description: description,
            created: created,
            modified: modified,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackComment = function (feedbackId, feedbackCommentId, creatorUserId, created, text, createdByAdmin) {
    text = text || `comment${feedbackCommentId}Text`;
    createdByAdmin = createdByAdmin || null;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment  {text: {text}, created: {created}, feedbackId: {feedbackCommentId}, createdByAdmin: {createdByAdmin}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            feedbackCommentId: feedbackCommentId,
            created: created,
            creatorUserId: creatorUserId,
            text: text,
            createdByAdmin: createdByAdmin
        }).getCommand());
};

var createFeedbackRecommendation = function (feedbackId, feedbackRecommendationId, creatorUserId, created) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(feedback)<-[:RECOMMENDS]-(:Feedback:Recommendation  {created: {created}, recommendationId: {feedbackRecommendationId}})
        <-[:RECOMMENDED_BY]-(user)`)
        .end({
            feedbackId: feedbackId,
            feedbackRecommendationId: feedbackRecommendationId,
            created: created,
            creatorUserId: creatorUserId,
        }).getCommand());
};

var closeFeedback = function (feedbackId, statusFeedbackId, creatorUserId, created, reasonText) {
    reasonText = reasonText || `closed${statusFeedbackId}Text`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .set("feedback", {status: 'closed'})
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment:Status  {status: 'closed', text: {reasonText}, created: {created}, feedbackId: {statusFeedbackId}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            statusFeedbackId: statusFeedbackId,
            created: created,
            creatorUserId: creatorUserId,
            reasonText: reasonText
        }).getCommand());
};

var reopenFeedback = function (feedbackId, statusFeedbackId, creatorUserId, created, reasonText) {
    reasonText = reasonText || `reopen${statusFeedbackId}Text`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .set("feedback", {status: 'open'})
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment:Status  {status: 'open', text: {reasonText}, created: {created}, feedbackId: {statusFeedbackId}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            statusFeedbackId: statusFeedbackId,
            created: created,
            creatorUserId: creatorUserId,
            reasonText: reasonText
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