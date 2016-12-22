'use strict';

let db = requireDb();
let exception = require('elyoos-server-lib').exceptions;
let overviewGroup = require('./overviewGroup');

let getIdeaList = function (userId, discussionIdeas) {
    let formattedListDiscussionIdeas = [];

    discussionIdeas.forEach(function (idea) {
        let formattedFeedback = {};
        formattedFeedback.title = idea.idea.title;
        formattedFeedback.description = idea.idea.description;
        formattedFeedback.created = idea.idea.created;
        formattedFeedback.lastModified = idea.lastModified;
        formattedFeedback.feedbackId = idea.idea.feedbackId;
        formattedFeedback.creator = {userId: idea.creator.userId, name: idea.creator.name};
        formattedFeedback.createdByUser = idea.creator.userId === userId;
        formattedFeedback.numberOfComments = idea.numberOfComments;
        formattedFeedback.numberOfRecommendations = idea.numberOfRecommendations;
        formattedFeedback.recommendedByUser = idea.recommendedByUser;
        formattedListDiscussionIdeas.push(formattedFeedback);
    });
    return formattedListDiscussionIdeas;
};

let getDiscussion = function (discussion) {
    if (discussion.length === 1) {
        let result = {};
        result.title = discussion[0].discussion.title;
        result.description = discussion[0].discussion.description;
        result.feedbackId = discussion[0].discussion.feedbackId;
        return result;
    }
    throw new exception.InvalidOperation(`Discussion is not existing`);
};

let getDiscussionCommand = function (params) {
    return db.cypher().match(`(discussion:Feedback:Discussion {feedbackId: {discussionId}})`)
        .return("discussion").end(params).getCommand();
};

let getOverview = function (userId, params) {

    let commands = [];
    params.userId = userId;

    commands.push(getDiscussionCommand(params));
    commands.push(overviewGroup.getNumberOfGroupFeedbackCommand('DiscussionIdea'));

    return db.cypher().match(`(:Feedback:Discussion {feedbackId: {discussionId}})<-[:IS_IDEA]-(idea:Feedback:DiscussionIdea {status: {status}})
                               <-[:IS_CREATOR]-(creator)`)
        .optionalMatch("(idea)<-[:COMMENT]-(comments:Feedback:Comment)")
        .where("NOT comments:Status")
        .with("count(comments) AS numberOfComments, idea, creator")
        .optionalMatch("(idea)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .with("numberOfComments, idea, creator, count(recommendation) AS numberOfRecommendations")
        .optionalMatch("(idea)<-[:RECOMMENDS|COMMENT]-(feedbackRef)")
        .with(`numberOfComments, idea, creator, numberOfRecommendations, max(feedbackRef.created) AS feedbackRef1Created, 
               max(feedbackRef.modified) AS feedbackRef1Modified`)
        .unwind(`[feedbackRef1Created, feedbackRef1Modified, idea.created, idea.modified] AS feedbackRefModifiedCombined`)
        .return(`idea, creator, numberOfComments, numberOfRecommendations, max(feedbackRefModifiedCombined) AS lastModified,
                 EXISTS((idea)<-[:RECOMMENDS]-(:Feedback:Recommendation)<-[:RECOMMENDED_BY]-(:User {userId: {userId}})) AS recommendedByUser`)
        .orderBy("numberOfRecommendations DESC, numberOfComments DESC, idea.created DESC")
        .skip("{skip}")
        .limit("{maxItems}").end(params).send(commands).then(function (resp) {
            return {feedbacks: getIdeaList(userId, resp[2]), discussion: getDiscussion(resp[0]), statistic: resp[1][0]};
        });
};

module.exports = {
    getOverview: getOverview
};
