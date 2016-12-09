'use strict';

let db = requireDb();

let getFeedbackDetail = function (userId, feedbackId) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})<-[:IS_CREATOR]-(creator:User)`)
        .optionalMatch("(feedback)<-[:COMMENT]-(comment:Feedback:Comment)")
        .with("feedback, creator, count(comment) AS numberOfComments")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .return(`feedback, creator, numberOfComments, count(recommendation) AS numberOfRecommendations,
                 EXISTS((feedback)<-[:RECOMMENDS]-(:Feedback:Recommendation)<-[:RECOMMENDED_BY]-(:User {userId: {userId}})) AS recommendedByUser`)
        .end({userId: userId, feedbackId: feedbackId});
};

let getFeedbackMessage = function (userId, feedback) {
    return {
        title: feedback.feedback.title,
        description: feedback.feedback.description,
        created: feedback.feedback.created,
        modified: feedback.feedback.modified,
        status: feedback.feedback.status,
        creator: {name: feedback.creator.name, userId: feedback.creator.userId},
        numberOfComments: feedback.numberOfComments,
        numberOfRecommendations: feedback.numberOfRecommendations,
        recommendedByUser: feedback.recommendedByUser,
        createdByUser: userId === feedback.creator.userId
    };
};

let getDetail = function (userId, params) {

    return getFeedbackDetail(userId, params.feedbackId)
        .send().then(function (resp) {
            return getFeedbackMessage(userId, resp[0]);
        });
};


module.exports = {
    getDetail: getDetail
};
