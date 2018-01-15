'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let allowedToDeleteQuestion = function (userId, questionId, req) {
    return db.cypher().match("(question:ForumQuestion {questionId: {questionId}})<-[:IS_ADMIN]-(:User {userId: {userId}})").return("question")
        .end({userId: userId, questionId: questionId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation(`User ${userId} is not allowed to delete question ${questionId}`, logger, req);
            }
        });
};

module.exports = {
    allowedToDeleteQuestion: allowedToDeleteQuestion
};