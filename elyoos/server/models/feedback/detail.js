'use strict';

let db = requireDb();

let getFeedbackDetail = function (feedbackId) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch("(feedback)<-[:COMMENT]-(comment:Feedback:Comment)")
        .with("feedback, creator, count(comment) AS numberOfComments")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .return("feedback, creator, numberOfComments, count(recommendation) AS numberOfRecommendations").end({feedbackId: feedbackId});
};

let getFeedbackComments = function (feedbackId) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})`)
        .optionalMatch(`(feedback)<-[:COMMENT]-(comment:Feedback:Comment)<-[:IS_CREATOR]-(creator:User)`)
        .return("comment, creator")
        .orderBy("comment.created DESC").end({feedbackId: feedbackId});
};

let getFeedbackMessage = function (feedback) {
    return {
        title: feedback.feedback.title,
        description: feedback.feedback.description,
        created: feedback.feedback.created,
        creator: {name: feedback.creator.name, userId: feedback.creator.userId},
        numberOfComments: feedback.numberOfComments,
        numberOfRecommendations: feedback.numberOfRecommendations
    };
};

let getCommentMessage = function (comments) {
    let result = [];
    comments.forEach(function (comment) {
        let resultComment = {};
        resultComment.text = comment.comment.text;
        resultComment.created = comment.comment.created;
        resultComment.feedbackId = comment.comment.feedbackId;
        resultComment.creator = {userId: comment.creator.userId, name: comment.creator.name};
        result.push(resultComment);
    });
    return result;
};

let getDetail = function (userId, params) {
    let commands = [];
    commands.push(getFeedbackComments(params.feedbackId).getCommand());

    return getFeedbackDetail(params.feedbackId)
        .send(commands).then(function (resp) {
            return {feedback: getFeedbackMessage(resp[1][0]), comments: getCommentMessage(resp[0])};
        });
};


module.exports = {
    getDetail: getDetail
};
