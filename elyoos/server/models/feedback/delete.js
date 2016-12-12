'use strict';

let db = requireDb();
let exceptions = requireLib('error/exceptions');
let logger = requireLogger.getLogger(__filename);

let checkAllowedToDelete = function (userId, feedbackId, req) {
    return db.cypher().match("(:User {userId: {userId}})-[:IS_CREATOR]->(feedback:Feedback {feedbackId: {feedbackId}})")
        .optionalMatch("(feedback)<-[:COMMENT]-(comment:Feedback:Comment)")
        .with("feedback, COUNT(comment) AS numberOfComment")
        .optionalMatch("(feedback)<-[:RECOMMENDS]-(recommendation:Feedback:Recommendation)")
        .return(`feedback, ANY(label IN LABELS(feedback) WHERE label = 'Discussion') AS isDiscussion, 
                 COUNT(recommendation) AS numberOfRecommendation, numberOfComment`)
        .end({userId: userId, feedbackId: feedbackId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`User ${userId} can not delete feedback ${feedbackId}`, logger, req);
            } else if (resp[0].feedback.status === 'closed') {
                return exceptions.getInvalidOperation(`User ${userId} can not delete closed feedback ${feedbackId}`, logger, req);
            } else if (resp[0].isDiscussion) {
                return exceptions.getInvalidOperation(`User ${userId} is not allowed to delete discussion ${feedbackId}`, logger, req);
            } else if (resp[0].numberOfRecommendation > 0) {
                return exceptions.getInvalidOperation(`feedback ${feedbackId} has recommendations`, logger, req);
            } else if (resp[0].numberOfComment > 0) {
                return exceptions.getInvalidOperation(`feedback ${feedbackId} has comments`, logger, req);
            }
        });
};

let deleteFeedback = function (userId, params, req) {

    return checkAllowedToDelete(userId, params.feedbackId, req).then(function () {
        return db.cypher().match("(feedback:Feedback {feedbackId: {feedbackId}})<-[rel:IS_CREATOR]-(:User)")
            .optionalMatch("(feedback)-[isIdeaRel:IS_IDEA]->(:Feedback:Discussion)")
            .delete("feedback, rel, isIdeaRel")
            .end({feedbackId: params.feedbackId}).send();
    });
};

module.exports = {
    delete: deleteFeedback
};
