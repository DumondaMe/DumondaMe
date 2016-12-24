'use strict';

let db = requireDb();
let util = require('./util');
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let getFeedbackDetail = function (userId, feedbackId) {
    return db.cypher().match(`(feedback:Feedback {feedbackId: {feedbackId}})<-[:IS_CREATOR]-(creator:User)`)
        .where("NOT feedback:Discussion")
        .optionalMatch("(discussion:Feedback:Discussion)<-[:IS_IDEA]-(feedback)")
        .with("feedback, creator, discussion")
        .optionalMatch("(feedback)<-[:COMMENT]-(comment:Feedback:Comment)")
        .where("NOT comment:Status")
        .with("feedback, discussion, creator, count(comment) AS numberOfComments")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(userRecommendation:Feedback:Recommendation)<-[:RECOMMENDED_BY]-(:User {userId: {userId}})")
        .return(`feedback, discussion, LABELS(feedback) AS type, creator, numberOfComments, count(recommendation) AS numberOfRecommendations,
                 EXISTS((feedback)<-[:RECOMMENDS]-(:Feedback:Recommendation)<-[:RECOMMENDED_BY]-(:User {userId: {userId}})) AS recommendedByUser, 
                 userRecommendation.recommendationId AS recommendationId`)
        .end({userId: userId, feedbackId: feedbackId});
};


let getFeedbackMessage = function (userId, feedback) {
    let feedbackMessage = {
        title: feedback.feedback.title,
        description: feedback.feedback.description,
        type: util.getFeedbackType(feedback.type),
        created: feedback.feedback.created,
        modified: feedback.feedback.modified,
        status: feedback.feedback.status,
        operatingSystem: feedback.feedback.operatingSystem,
        screen: feedback.feedback.screen,
        browser: feedback.feedback.browser,
        creator: {name: feedback.creator.name, userId: feedback.creator.userId},
        numberOfComments: feedback.numberOfComments,
        numberOfRecommendations: feedback.numberOfRecommendations,
        recommendedByUser: feedback.recommendedByUser,
        recommendationId: feedback.recommendationId,
        createdByUser: userId === feedback.creator.userId
    };
    if (feedback.hasOwnProperty('discussion')) {
        feedbackMessage.discussion = {
            title: feedback.discussion.title,
            description: feedback.discussion.description,
            status: feedback.discussion.status,
            discussionId: feedback.discussion.feedbackId
        };
    }
    return feedbackMessage;
};

let getDetail = function (userId, params, req) {

    return getFeedbackDetail(userId, params.feedbackId)
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`Feedback not loaded ${params.feedbackId}`, logger, req);
            }
            return getFeedbackMessage(userId, resp[0]);
        });
};


module.exports = {
    getDetail: getDetail
};
