"use strict";

let db = requireDb();
let eMailQueue = require('elyoos-server-lib').eMailQueue;

let getJobData = function (resp) {
    if (resp.creator.userId !== resp.feedbackCreator.userId) {
        resp.notified.unshift(resp.feedbackCreator.email);
    }
    return {
        userChangedStatusFeedback: resp.creator.name, titleFeedback: resp.feedback.title, reasonText: resp.comment.text, status: resp.comment.status,
        emails: resp.notified
    };
};

let checkSendFeedbackComment = function (resp) {
    return resp.notified.length > 0 || (resp.notified.length === 0 && resp.feedbackCreator.userId !== resp.creator.userId);
};

let statusChanged = function (statusCommentId) {

    return db.cypher().match(`(feedbackCreator)-[:IS_CREATOR]->(feedback:Feedback)<-[:COMMENT]-
                              (comment:Feedback:Comment:Status {feedbackId: {statusCommentId}})<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch("(feedback)<-[:COMMENT]-(otherComment:Feedback:Comment)<-[:IS_CREATOR]-(otherCreator:User)")
        .where(`comment.feedbackId <> otherComment.feedbackId AND otherCreator.userId <> creator.userId AND 
                feedbackCreator.userId <> otherCreator.userId`)
        .return("comment, creator, feedback, feedbackCreator, collect(DISTINCT otherCreator.email) AS notified").end({statusCommentId: statusCommentId}).send()
        .then(function (resp) {
            if (resp.length === 1 && checkSendFeedbackComment(resp[0])) {
                eMailQueue.createImmediatelyJob('feedbackStatusChanged', getJobData(resp[0]));
            }
        });
};

module.exports = {
    statusChanged: statusChanged
};
