'use strict';

var db = requireDb();
var exceptions = requireLib('error/exceptions');
var logger = requireLogger.getLogger(__filename);

var allowedToDeleteAnswer = function (userId, answerId, req) {
    return db.cypher().match("(answer:ForumAnswer {answerId: {answerId}})<-[:IS_ADMIN]-(:User {userId: {userId}})").return("answer")
        .end({userId: userId, answerId: answerId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation("User  ${userId} is not allowed to delete answer ${answerId}", logger, req);
            }
        });
};

module.exports = {
    allowedToDeleteAnswer: allowedToDeleteAnswer
};
