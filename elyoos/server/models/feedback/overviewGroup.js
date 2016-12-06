'use strict';

let db = requireDb();

let getFeedbackList = function (feedbacks) {
    let result = [];
    feedbacks.forEach(function(feedback) {
        let formattedFeedback = {};
        formattedFeedback.title = feedback.feedback.title;
        formattedFeedback.description = feedback.feedback.description;
        formattedFeedback.created = feedback.feedback.created;
        formattedFeedback.feedbackId = feedback.feedback.feedbackId;
        formattedFeedback.creator = {userId: feedback.creator.userId, name: feedback.creator.name};
        formattedFeedback.numberOfComments = feedback.numberOfComments;
        formattedFeedback.numberOfIdeas = feedback.numberOfIdeas;
        result.push(formattedFeedback);
    });
    return result;
};

let getOverview = function (userId, params) {
    return db.cypher().match("(feedback:Feedback {status: {status}})<-[:IS_CREATOR]-(creator)")
        .where("{group} IN labels(feedback)")
        .optionalMatch("(feedback)<-[:COMMENT]-(comments:Feedback:Comment)")
        .optionalMatch("(feedback)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .return("feedback, creator, count(comments) AS numberOfComments, count(discussionIdea) AS numberOfIdeas")
        .orderBy("numberOfComments DESC, numberOfIdeas DESC")
        .skip("{skip}")
        .limit("{maxItems}").end(params).send().then(function (resp) {
            return {feedbacks: getFeedbackList(resp)};
        });
};

module.exports = {
    getOverview: getOverview
};
