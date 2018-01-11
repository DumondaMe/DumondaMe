'use strict';

let db = requireDb();

let getFeedbackList = function (userId, feedbacks) {
    let result = [];
    feedbacks.forEach(function (feedback) {
        let formattedFeedback = {};
        formattedFeedback.title = feedback.feedback.title;
        formattedFeedback.description = feedback.feedback.description;
        formattedFeedback.created = feedback.feedback.created;
        formattedFeedback.lastModified = feedback.lastModified;
        formattedFeedback.feedbackId = feedback.feedback.feedbackId;
        formattedFeedback.operatingSystem = feedback.feedback.operatingSystem;
        formattedFeedback.browser = feedback.feedback.browser;
        formattedFeedback.screen = feedback.feedback.screen;
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

let getNumberOfGroupFeedbackCommand = function (group) {
    return db.cypher().match(`(discussion:Feedback:${group} {status: 'open'})`)
        .with("count(discussion) AS numberOfOpenFeedbacks")
        .optionalMatch(`(discussion:Feedback:${group} {status: 'closed'})`)
        .return("count(discussion) AS numberOfClosedFeedbacks, numberOfOpenFeedbacks").end().getCommand();
};

let getStatistic = function (resp) {
    return {
        numberOfOpenFeedbacks: resp.numberOfOpenFeedbacks, numberOfClosedFeedbacks: resp.numberOfClosedFeedbacks
    };
};

let getOverview = function (userId, params) {
    let commands = [];
    params.userId = userId;

    commands.push(getNumberOfGroupFeedbackCommand(params.group));

    return db.cypher().match("(feedback:Feedback {status: {status}})<-[:IS_CREATOR]-(creator)")
        .where("{group} IN labels(feedback)")
        .optionalMatch("(feedback)<-[:RECOMMENDS|COMMENT|IS_IDEA]-(feedbackRef)")
        .with("feedback, creator, max(feedbackRef.created) AS feedbackRef1Created, max(feedbackRef.modified) AS feedbackRef1Modified")
        .optionalMatch("(feedback)<-[:COMMENT]-(comments:Feedback:Comment)")
        .where("NOT comments:Status")
        .with("count(comments) AS numberOfComments, feedback, creator, feedbackRef1Created, feedbackRef1Modified")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .with("count(recommendation) AS numberOfRecommendations, numberOfComments, feedback, creator, feedbackRef1Created, feedbackRef1Modified")
        .optionalMatch("(feedback)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .with(`count(discussionIdea) AS numberOfIdeas, numberOfRecommendations, numberOfComments, feedback, creator, feedbackRef1Created, 
               feedbackRef1Modified`)
        .optionalMatch("(feedback)<-[IS_IDEA]-(feedbackRef)<-[:RECOMMENDS|COMMENT]-(feedbackRef2)")
        .with(`numberOfIdeas, numberOfRecommendations, numberOfComments, feedback, creator, feedbackRef1Created, 
               feedbackRef1Modified, max(feedbackRef2.created) AS feedbackRef2Created, max(feedbackRef2.modified) AS feedbackRef2Modified`)
        .unwind(`[feedbackRef1Created, feedbackRef1Modified, feedbackRef2Created, feedbackRef2Modified, feedback.created, feedback.modified] 
                 AS feedbackRefModifiedCombined`)
        .return(`feedback, creator, numberOfIdeas, numberOfComments, numberOfRecommendations, max(feedbackRefModifiedCombined) AS lastModified, 
                 EXISTS((feedback)<-[:RECOMMENDS]-(:Feedback:Recommendation)<-[:RECOMMENDED_BY]-(:User {userId: {userId}})) AS recommendedByUser`)
        .orderBy("numberOfRecommendations DESC, numberOfComments DESC, numberOfIdeas DESC, feedback.created DESC")
        .skip("{skip}")
        .limit("{maxItems}").end(params).send(commands).then(function (resp) {
            return {feedbacks: getFeedbackList(userId, resp[1]), statistic: getStatistic(resp[0][0])};
        });
};

module.exports = {
    getOverview: getOverview,
    getNumberOfGroupFeedbackCommand: getNumberOfGroupFeedbackCommand,
    getStatistic: getStatistic
};
