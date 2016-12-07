'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createFeedbackBug = function (feedbackId, creatorUserId, created, status, title, description) {
    title = title || `bug${feedbackId}Title`;
    description = description || `bug${feedbackId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Bug  {title: {title}, 
    description: {description}, status: {status}, created: {created}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: title,
            description: description,
            created: created,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackIdea = function (feedbackId, creatorUserId, created, status, title, description) {
    title = title || `idea${feedbackId}Title`;
    description = description || `idea${feedbackId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Idea  {title: {title}, 
    description: {description}, status: {status},created: {created}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: title,
            description: description,
            created: created,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackDiscussion = function (feedbackId, creatorUserId, created, status, title, description) {
    title = title || `discussion${feedbackId}Title`;
    description = description || `discussion${feedbackId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {creatorUserId}})').create(`(:Feedback:Discussion  {title: {title},
    description: {description}, status: {status}, created: {created}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            title: title,
            description: description,
            created: created,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackDiscussionIdea = function (feedbackId, discussionFeedbackId, creatorUserId, created, status, title, description) {
    title = title || `discussionIdea${feedbackId}Title`;
    description = description || `discussionIdea${feedbackId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(discussion:Feedback:Discussion {feedbackId: {discussionFeedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(discussion)<-[:IS_IDEA]-(:Feedback:DiscussionIdea  {title: {title}, description: {description}, status: {status}, 
                  created: {created}, feedbackId: {feedbackId}})<-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            discussionFeedbackId: discussionFeedbackId,
            title: title,
            description: description,
            created: created,
            creatorUserId: creatorUserId,
            status: status
        }).getCommand());
};

var createFeedbackRating = function (feedbackId, feedbackCommentId, creatorUserId, created, text) {
    text = text || `comment${feedbackId}Text`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(feedback:Feedback {feedbackId: {feedbackId}}), (user:User {userId: {creatorUserId}})')
        .create(`(feedback)<-[:COMMENT]-(:Feedback:Comment  {text: {text}, created: {created}, feedbackId: {feedbackCommentId}})
        <-[:IS_CREATOR]-(user)`)
        .end({
            feedbackId: feedbackId,
            feedbackCommentId: feedbackCommentId,
            created: created,
            creatorUserId: creatorUserId,
            text: text
        }).getCommand());
};

module.exports = {
    createFeedbackBug: createFeedbackBug,
    createFeedbackIdea: createFeedbackIdea,
    createFeedbackDiscussion: createFeedbackDiscussion,
    createFeedbackDiscussionIdea: createFeedbackDiscussionIdea,
    createFeedbackComment: createFeedbackRating
};