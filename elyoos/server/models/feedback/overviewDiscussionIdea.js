'use strict';

let db = requireDb();
let exception = requireLib('error/exceptions');

let getIdeaList = function (discussionIdeas) {
    let formattedListDiscussionIdeas = [];

    discussionIdeas.forEach(function (idea) {
        let formattedFeedback = {};
        formattedFeedback.title = idea.idea.title;
        formattedFeedback.description = idea.idea.description;
        formattedFeedback.created = idea.idea.created;
        formattedFeedback.feedbackId = idea.idea.feedbackId;
        formattedFeedback.creator = {userId: idea.creator.userId, name: idea.creator.name};
        formattedFeedback.numberOfComments = idea.numberOfComments;
        formattedFeedback.numberOfRecommendations = idea.numberOfRecommendations;
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

    commands.push(getDiscussionCommand(params));

    return db.cypher().match(`(:Feedback:Discussion {feedbackId: {discussionId}})<-[:IS_IDEA]-(idea:Feedback:DiscussionIdea)
                               <-[:IS_CREATOR]-(creator)`)
        .optionalMatch("(idea)<-[:COMMENT]-(comments:Feedback:Comment)")
        .with("count(comments) AS numberOfComments, idea, creator")
        .optionalMatch("(idea)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .return("idea, creator, numberOfComments, count(recommendation) AS numberOfRecommendations")
        .orderBy("numberOfRecommendations DESC, numberOfComments DESC")
        .skip("{skip}")
        .limit("{maxItems}").end(params).send(commands).then(function (resp) {
            return {feedbacks: getIdeaList(resp[1]), discussion: getDiscussion(resp[0])};
        });
};

module.exports = {
    getOverview: getOverview
};
