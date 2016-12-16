'use strict';

let db = requireDb();
let _ = require('underscore');

let getOrderBy = function (order) {
    let orderBy = "feedback.created DESC";
    if (order === 'newestModification') {
        orderBy = "lastModified DESC";
    }
    return orderBy;
};

let getOverviewOfFeedback = function (params) {
    return db.cypher().match(`(feedback:Feedback {status: {status}})<-[:IS_CREATOR]-(creator:User)`)
        .where("feedback:Discussion OR feedback:Bug OR feedback:Idea")
        .optionalMatch("(feedback)<-[:RECOMMENDS|COMMENT|IS_IDEA]-(feedbackRef)")
        .with("feedback, creator, max(feedbackRef.created) AS feedbackRef1Created, max(feedbackRef.modified) AS feedbackRef1Modified")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .with("feedback, creator, feedbackRef1Created, feedbackRef1Modified, count(recommendation) AS numberOfRecommendations")
        .optionalMatch("(feedback)<-[:COMMENT]-(comment:Feedback:Comment)")
        .with("feedback, creator, feedbackRef1Created, feedbackRef1Modified, numberOfRecommendations, count(comment) AS numberOfComments")
        .optionalMatch("(feedback)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .with(`feedback, creator, feedbackRef1Created, feedbackRef1Modified, numberOfRecommendations, numberOfComments, 
               count(discussionIdea) AS numberOfIdeas`)
        .optionalMatch("(feedback)<-[IS_IDEA]-(feedbackRef)<-[:RECOMMENDS|COMMENT]-(feedbackRef2)")
        .with(`feedback, creator, feedbackRef1Created, feedbackRef1Modified, numberOfRecommendations, numberOfComments, numberOfIdeas, 
               max(feedbackRef2.created) AS feedbackRef2Created, max(feedbackRef2.modified) AS feedbackRef2Modified`)
        .unwind(`[feedbackRef1Created, feedbackRef1Modified, feedbackRef2Created, feedbackRef2Modified, feedback.created, feedback.modified] 
                 AS feedbackRefModifiedCombined`)
        .return(`feedback, creator, LABELS(feedback) AS label, max(feedbackRefModifiedCombined) AS lastModified, 
                 numberOfRecommendations, numberOfComments, numberOfIdeas`)
        .orderBy(getOrderBy(params.order)).skip("{skip}").limit("{maxItems}").end(params);
};

let getFeedbackType = function (label) {
    let type = null;
    if (_.contains(label, 'Bug')) {
        type = 'bug';
    } else if (_.contains(label, 'Idea')) {
        type = 'idea';
    } else if (_.contains(label, 'Discussion')) {
        type = 'discussion';
    }
    return type;
};

let getFeedback = function (feedbacks) {
    let formattedFeedbacks = [];
    feedbacks.forEach(function (feedback) {
        let formattedFeedback = {};
        formattedFeedback.title = feedback.feedback.title;
        formattedFeedback.created = feedback.feedback.created;
        formattedFeedback.lastModified = feedback.lastModified;
        formattedFeedback.feedbackId = feedback.feedback.feedbackId;
        formattedFeedback.status = feedback.feedback.status;
        formattedFeedback.type = getFeedbackType(feedback.label);
        formattedFeedback.creator = {name: feedback.creator.name};
        formattedFeedback.numberOfRecommendations = feedback.numberOfRecommendations;
        formattedFeedback.numberOfComments = feedback.numberOfComments;
        formattedFeedback.numberOfIdeas = feedback.numberOfIdeas;
        formattedFeedbacks.push(formattedFeedback);
    });
    return formattedFeedbacks;
};

let getOverview = function (params) {

    return getOverviewOfFeedback(params).send().then(function (resp) {
        return {
            feedback: getFeedback(resp)
        };
    });
};


module.exports = {
    getOverview: getOverview
};
