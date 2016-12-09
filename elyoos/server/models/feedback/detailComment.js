'use strict';

let db = requireDb();

let getFeedbackComments = function (feedbackId) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})`)
        .optionalMatch(`(feedback)<-[:COMMENT]-(comment:Feedback:Comment)<-[:IS_CREATOR]-(creator:User)`)
        .return("comment, creator")
        .orderBy("comment.created DESC").end({feedbackId: feedbackId});
};

let getCommentMessage = function (comments) {
    let result = [];
    comments.forEach(function (comment) {
        let resultComment = {};
        if (comment.hasOwnProperty('comment')) {
            resultComment.text = comment.comment.text;
            resultComment.created = comment.comment.created;
            resultComment.feedbackId = comment.comment.feedbackId;
            resultComment.creator = {userId: comment.creator.userId, name: comment.creator.name};
            result.push(resultComment);
        }
    });
    return result;
};

let getComment = function (params) {

    return getFeedbackComments(params.feedbackId)
        .send().then(function (resp) {
            return {comments: getCommentMessage(resp)};
        });
};


module.exports = {
    getComment: getComment
};
