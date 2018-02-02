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
                 youtubeId: {youtubeId}, idOnYoutube: {idOnYoutube}, link: {link}, linkEmbed: {linkEmbed}})`)
        .merge(`(question)-[:ANSWER]->(youtube)`)
        .merge(`(youtube)<-[:IS_CREATOR]-(user)`)
        .end({
            youtubeId: youtubeId, idOnYoutube: data.idOnYoutube, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, linkEmbed: data.linkEmbed, questionId: data.questionId
        }).getCommand());
};

let createVimeoAnswer = function (vimeoId, data) {
    data.title = data.title || `vimeo${vimeoId}Title`;
    data.description = data.description || `vimeo${vimeoId}Description`;
    data.creatorId = data.creatorId || '1';
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(vimeo:Vimeo  {title: {title}, description: {description}, created: {created},
                 vimeoId: {vimeoId}, link: {link}, linkEmbed: {linkEmbed}})`)
        .merge(`(question)-[:ANSWER]->(vimeo)`)
        .merge(`(vimeo)<-[:IS_CREATOR]-(user)`)
        .end({
            vimeoId: vimeoId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, linkEmbed: data.linkEmbed, questionId: data.questionId
        }).getCommand());
};

let createLinkAnswer = function (linkId, data) {
    data.title = data.title || `link${linkId}Title`;
    data.description = data.description || `link${linkId}Description`;
    data.creatorId = data.creatorId || '1';
    data.hasImage = data.hasImage || false;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(:Link  {title: {title}, description: {description}, created: {created},
                  linkId: {linkId}, link: {link}, hasImage: {hasImage}, pageType: {pageType}})`)
        .merge(`(question)-[:ANSWER]->(book)`)
        .merge(`(book)<-[:IS_CREATOR]-(user)`)
        .end({
            linkId: linkId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, hasImage: data.hasImage, pageType: data.pageType,
            questionId: data.questionId
        }).getCommand());
};

let setYoutubeOriginal = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(youtube:Youtube {youtubeId: {youtubeId}}),
                 (original:Youtube {youtubeId: {originalYoutubeId}})`)
        .merge(`(youtube)-[:ORIGINAL]->(original)`)
        .end({
            youtubeId: data.youtubeId, originalYoutubeId: data.originalYoutubeId
        }).getCommand());
};

module.exports = {
    createBookAnswer,
    createYoutubeAnswer,
    createVimeoAnswer,
    createLinkAnswer,
    setYoutubeOriginal
};