'use strict';

let db = requireDb();
let exceptions = require('elyoos-server-lib').exceptions;
let logger = require('elyoos-server-lib').logging.getLogger(__filename);

let questionExists = function (questionId, req) {
    return db.cypher().match("(forumQuestion:ForumQuestion {questionId: {questionId}})").return("forumQuestion")
        .end({questionId: questionId})
        .send().then(function (resp) {
            if (resp.length === 0) {
                return exceptions.getInvalidOperation("Forum question with id " + questionId + " does not exists", logger, req);
            }
        });
};

module.exports = {
    questionExists: questionExists
};
