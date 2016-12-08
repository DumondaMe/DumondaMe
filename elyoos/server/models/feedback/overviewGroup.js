'use strict';

let db = requireDb();

let getFeedbackList = function (userId, feedbacks) {
    let result = [];
    feedbacks.forEach(function (feedback) {
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
        .optionalMatch("(feedback)<-[:COMMENT]-(comments:Feedback:Comment)")
        .with("count(comments) AS numberOfComments, feedback, creator")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .with("count(recommendation) AS numberOfRecommendations, numberOfComments, feedback, creator")
        .optionalMatch("(feedback)<-[:IS_IDEA]-(discussionIdea:Feedback:DiscussionIdea)")
        .return(`feedback, creator, count(discussionIdea) AS numberOfIdeas, numberOfComments, numberOfRecommendations,
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
