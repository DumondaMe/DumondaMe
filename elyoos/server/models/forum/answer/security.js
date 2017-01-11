'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let allowedToDeleteAnswer = function (userId, answerId, req) {
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
