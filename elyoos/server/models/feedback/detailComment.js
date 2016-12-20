'use strict';

let db = requireDb();

let getOrderBy = function (orderBy) {
    if (orderBy === 'old') {
        return "comment.created";
    }
    return "comment.created DESC";
};

let getFeedbackComments = function (feedbackId, orderBy) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})`)
        .optionalMatch(`(feedback)<-[:COMMENT]-(comment:Feedback:Comment)<-[:IS_CREATOR]-(creator:User)`)
        .return("comment, creator")
        .orderBy(getOrderBy(orderBy)).end({feedbackId: feedbackId});
};

let getCommentMessage = function (comments) {
    let result = [];
    comments.forEach(function (comment) {
        let resultComment = {};
        if (comment.hasOwnProperty('comment')) {
            resultComment.text = comment.comment.text;
            resultComment.status = comment.comment.status;
            resultComment.created = comment.comment.created;
            resultComment.createdByAdmin = comment.comment.createdByAdmin;
            resultComment.feedbackId = comment.comment.feedbackId;
            resultComment.creator = {userId: comment.creator.userId, name: comment.creator.name};
            result.push(resultComment);
        }
    });
    return result;
};

let getComment = function (params) {

    return getFeedbackComments(params.feedbackId, params.orderBy)
        .send().then(function (resp) {
            return {comments: getCommentMessage(resp)};
        });
};


module.exports = {
    getComment: getComment
};
