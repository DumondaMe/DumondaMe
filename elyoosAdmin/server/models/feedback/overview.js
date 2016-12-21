'use strict';

let db = requireDb();
let _ = require('underscore');

let getNumberOfOpenFeedback = function () {
    return db.cypher().match(`(feedback:Feedback {status: 'open'})`)
        .where(`feedback:Discussion OR feedback:Idea OR feedback:Bug`)
        .return("count(feedback) AS numberOfOpenFeedback").end();
};

let getOverviewOfFeedback = function (params) {
    return db.cypher().match(`(feedback:Feedback)<-[:IS_CREATOR|:RECOMMENDED_BY]-(creator:User)`)
        .where("NOT feedback:Discussion AND NOT feedback:Status")
        .optionalMatch("(feedbackParent)<-[:RECOMMENDS|COMMENT]-(feedback)")
        .where("(feedback:Comment OR feedback:Recommendation)")
        .with("feedback, feedbackParent, creator")
        .optionalMatch("(discussionOfParent:Feedback:Discussion)<-[:IS_IDEA]-(feedbackParent)")
        .optionalMatch("(discussion:Feedback:Discussion)<-[:IS_IDEA]-(feedback)")
        .return("feedback, feedbackParent, creator, discussion, discussionOfParent, LABELS(feedback) AS label")
        .orderBy("feedback.created DESC").skip("{skip}").limit("{maxItems}").end(params);
};

let getTypeIdea = function (feedback) {
    let formattedFeedback = {};
    formattedFeedback.title = feedback.feedback.title;
    formattedFeedback.created = feedback.feedback.created;
    formattedFeedback.feedbackId = feedback.feedback.feedbackId;
    formattedFeedback.status = feedback.feedback.status;
    formattedFeedback.type = 'idea';
    if (_.contains(feedback.label, 'Bug')) {
        formattedFeedback.type = 'bug';
    }
    if (_.contains(feedback.label, 'DiscussionIdea')) {
        formattedFeedback.status = feedback.discussion.status;
    }
    return formattedFeedback;
};

let getTypeRecommendationAndComment = function (feedback) {
    let formattedFeedback = {};
    formattedFeedback.title = feedback.feedbackParent.title;
    formattedFeedback.created = feedback.feedback.created;
    formattedFeedback.feedbackId = feedback.feedbackParent.feedbackId;
    formattedFeedback.status = feedback.feedbackParent.status;
    formattedFeedback.type = 'recommendation';
    if (_.contains(feedback.label, 'Comment')) {
        formattedFeedback.type = 'comment';
        formattedFeedback.text = feedback.feedback.text;
    }
    if (feedback.hasOwnProperty('discussionOfParent')) {
        formattedFeedback.status = feedback.discussionOfParent.status;
    }
    return formattedFeedback;
};

let getFeedback = function (feedbacks) {
    let formattedFeedbacks = [];
    feedbacks.forEach(function (feedback) {
        let formattedFeedback;
        if (_.contains(feedback.label, 'Bug') || _.contains(feedback.label, 'Idea') || _.contains(feedback.label, 'DiscussionIdea')) {
            formattedFeedback = getTypeIdea(feedback);
        } else if (_.contains(feedback.label, 'Recommendation') || _.contains(feedback.label, 'Comment')) {
            formattedFeedback = getTypeRecommendationAndComment(feedback);
        }
        if (formattedFeedback) {
            formattedFeedback.creator = {name: feedback.creator.name};
        }
        formattedFeedbacks.push(formattedFeedback);
    });
    return formattedFeedbacks;
};

let getOverview = function (params) {

    let commands = [];

    commands.push(getOverviewOfFeedback(params).getCommand());

    return getNumberOfOpenFeedback().send(commands).then(function (resp) {
        return {
            numberOfOpenFeedback: resp[1][0].numberOfOpenFeedback, feedback: getFeedback(resp[0])
        };
    });
};


module.exports = {
    getOverview: getOverview
};
