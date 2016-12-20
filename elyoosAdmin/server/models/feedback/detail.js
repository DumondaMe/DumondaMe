'use strict';

let db = requireDb();
let util = require('./util');

let getFeedbackDetail = function (userId, feedbackId) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch("(feedback)<-[:COMMENT]-(comment:Feedback:Comment)")
        .where("NOT comment:Status")
        .with("feedback, creator, count(comment) AS numberOfComments")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .return(`feedback, LABELS(feedback) AS type, creator, numberOfComments, count(recommendation) AS numberOfRecommendations`)
        .end({userId: userId, feedbackId: feedbackId});
};


let getFeedbackMessage = function (feedback) {
    return {
        title: feedback.feedback.title,
        description: feedback.feedback.description,
        type: util.getFeedbackType(feedback.type),
        created: feedback.feedback.created,
        modified: feedback.feedback.modified,
        status: feedback.feedback.status,
        creator: {name: feedback.creator.name, userId: feedback.creator.userId},
        numberOfComments: feedback.numberOfComments,
        numberOfRecommendations: feedback.numberOfRecommendations
    };
};

let getDetail = function (userId, params) {

    return getFeedbackDetail(userId, params.feedbackId)
        .send().then(function (resp) {
            return getFeedbackMessage(resp[0]);
        });
};


module.exports = {
    getDetail: getDetail
};
