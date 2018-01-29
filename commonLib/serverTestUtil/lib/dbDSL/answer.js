'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createBookAnswer = function (bookId, data) {
    data.title = data.title || `book${bookId}Title`;
    data.description = data.description || `book${bookId}Description`;
    data.creatorId = data.creatorId || '1';
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}), 
                 (question:Question {questionId: {questionId}})`)
        .create(`(book:Book {title: {title}, description: {description}, created: {created},
                         bookId: {bookId}, author: {author}})`)
        .merge(`(question)-[:ANSWER]->(book)`)
        .merge(`(book)<-[:IS_CREATOR]-(user)`)
        .end({
            bookId: bookId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, author: data.author, questionId: data.questionId
        }).getCommand());
};

let createYoutubeAnswer = function (youtubeId, data) {
    data.title = data.title || `youtube${youtubeId}Title`;
    data.description = data.description || `youtube${youtubeId}Description`;
    data.creatorId = data.creatorId || '1';
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(youtube:Youtube  {title: {title}, description: {description}, created: {created},
                 youtubeId: {youtubeId}, link: {link}, linkEmbed: {linkEmbed}})`)
        .merge(`(question)-[:ANSWER]->(youtube)`)
        .merge(`(youtube)<-[:IS_CREATOR]-(user)`)
        .end({
            youtubeId: youtubeId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, linkEmbed: data.linkEmbed, questionId: data.questionId
        }).getCommand());
};

let createLinkAnswer = function (linkId, data) {
    data.title = data.title || `link${linkId}Title`;
    data.description = data.description || `link${linkId}Description`;
    data.creatorId = data.creatorId || '1';
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {adminId}})
                 (question:Question {questionId: {questionId}})`)
        .create(`(:Link  {title: {title}, description: {description}, created: {created},
                  linkId: {linkId}, link: {link}})`)
        .merge(`(question)-[:ANSWER]->(book)`)
        .merge(`(book)<-[:IS_CREATOR]-(user)`)
        .end({
            linkId: linkId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link,
        }).getCommand());
};

module.exports = {
    createBookAnswer,
    createYoutubeAnswer,
    createLinkAnswer
};