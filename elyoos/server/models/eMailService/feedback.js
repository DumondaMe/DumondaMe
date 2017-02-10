"use strict";

let db = requireDb();
let eMailQueue = require('elyoos-server-lib').eMailQueue;

let getJobData = function (resp) {
    resp.notified.unshift(resp.feedbackCreator.email);
    return {
        userCommentName: resp.creator.name, titleFeedback: resp.feedback.title, textComment: resp.comment.text,
        emails: resp.notified
    };
};

let checkSendFeedbackComment = function (resp) {
   return  resp.notified.length > 0 || (resp.notified.length === 0 && resp.feedbackCreator.userId !== resp.creator.userId)
};

let newComment = function (commentId) {

    return db.cypher().match(`(feedbackCreator)-[:IS_CREATOR]->(feedback:Feedback)<-[:COMMENT]-
                              (comment:Feedback:Comment {feedbackId: {commentId}})<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch("(feedback)<-[:COMMENT]-(otherComment:Feedback:Comment)<-[:IS_CREATOR]-(otherCreator:User)")
        .where(`comment.feedbackId <> otherComment.feedbackId AND otherCreator.userId <> creator.userId AND 
                feedbackCreator.userId <> otherCreator.userId`)
        .return("comment, creator, feedback, feedbackCreator, collect(DISTINCT otherCreator.email) AS notified").end({commentId: commentId}).send()
        .then(function (resp) {
            if (resp.length === 1 && checkSendFeedbackComment(resp[0])) {
                eMailQueue.createImmediatelyJob('feedbackNewComment', getJobData(resp[0]));
            }
        });
};

module.exports = {
    newComment: newComment
};
