'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createFeedbackBug = function (bugId, creatorUserId, created, status, title, description) {
    title = title || `page${bugId}Title`;
    description = description || `page${bugId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Feedback:Bug  {title: {title}, description: {description}, status: {status},
                                            created: {created}, bugId: {bugId}})<-[:IS_CREATOR]-(:User {userId: {creatorUserId}})`)
        .end({bugId: bugId, title: title, description: description, created: created, creatorUserId: creatorUserId, status: status}).getCommand());
};

var createFeedbackIdea = function (bugId, creatorUserId, created, status, title, description) {
    title = title || `page${bugId}Title`;
    description = description || `page${bugId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Feedback:Idea  {title: {title}, description: {description}, status: {status},
                                            created: {created}, bugId: {bugId}})<-[:IS_CREATOR]-(:User {userId: {creatorUserId}})`)
        .end({bugId: bugId, title: title, description: description, created: created, creatorUserId: creatorUserId, status: status}).getCommand());
};

var createFeedbackDiscussion = function (bugId, creatorUserId, created, status, title, description) {
    title = title || `page${bugId}Title`;
    description = description || `page${bugId}Description`;
    status = status || `open`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Feedback:Discussion  {title: {title}, description: {description}, status: {status},
                                            created: {created}, bugId: {bugId}})<-[:IS_CREATOR]-(:User {userId: {creatorUserId}})`)
        .end({bugId: bugId, title: title, description: description, created: created, creatorUserId: creatorUserId, status: status}).getCommand());
};

module.exports = {
    createFeedbackBug: createFeedbackBug,
    createFeedbackIdea: createFeedbackIdea,
    createFeedbackDiscussion: createFeedbackDiscussion
};