'use strict';

var db = require('./../../neo4j');
var exceptions = require('./../../lib/error/exceptions');
var logger = requireLogger.getLogger(__filename);

var questionExists = function (questionId, req) {
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
