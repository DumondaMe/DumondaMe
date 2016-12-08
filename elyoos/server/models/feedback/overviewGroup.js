'use strict';

let db = requireDb();

let getFeedbackList = function (userId, feedbacks) {
    let result = [];
    feedbacks.forEach(function(feedback) {
        let formattedFeedback = {};
        formattedFeedback.title = feedback.feedback.title;
        formattedFeedback.description = feedback.feedback.description;
        formattedFeedback.created = feedback.feedback.created;
        formattedFeedback.feedbackId = feedback.feedback.feedbackId;
        formattedFeedback.creator = {userId: feedback.creator.userId, name: feedback.creator.name};
        formattedFeedback.createdByUser = feedback.creator.userId === userId;
        formattedFeedback.numberOfComments = feedback.numberOfComments;
        formattedFeedback.numberOfIdeas = feedback.numberOfIdeas;
        formattedFeedback.numberOfRecommendations = feedback.numberOfRecommendations;
        formattedFeedback.recommendedByUser = feedback.recommendedByUser;
        result.push(formattedFeedback);
    });
    return result;
};

let getOverview = function (userId, params) {
    params.userId = userId;
    return db.cypher().match("(feedback:Feedback {status: {status}})<-[:IS_CREATOR]-(creator)")
        .where("{group} IN labels(feedback)")
        .optionalMatch("(feedback)<-[:COMMENT]-(comments:Feedback:Comment)")
        .with("count(comments) AS numberOfComments, feedback, creator")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .with("count(recommendation) AS numberOfRecommendations, numberOfComments, feedback, creator")
        .optionalMatch("(feedback)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .return(`feedback, creator, count(discussionIdea) AS numberOfIdeas, numberOfComments, numberOfRecommendations,
                 EXISTS((feedback)<-[:RECOMMENDS]-(:Feedback:Recommendation)<-[:RECOMMENDED_BY]-(:User {userId: {userId}})) AS recommendedByUser`)
        .orderBy("numberOfRecommendations DESC, numberOfComments DESC, numberOfIdeas DESC, feedback.created DESC")
        .skip("{skip}")
        .limit("{maxItems}").end(params).send().then(function (resp) {
            return {feedbacks: getFeedbackList(userId, resp)};
        });
};

module.exports = {
    getOverview: getOverview
};
