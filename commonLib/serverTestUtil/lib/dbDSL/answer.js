'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createBookAnswer = function (answerId, data) {
    data.title = data.title || `book${answerId}Title`;
    data.description = data.description || `book${answerId}Description`;
    data.creatorId = data.creatorId || '1';
    data.googleBookId = data.googleBookId || null;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}), 
                 (question:Question {questionId: {questionId}})`)
        .create(`(book:Book:Answer {title: {title}, description: {description}, created: {created},
                         answerId: {answerId}, authors: {authors}, hasPreviewImage: {hasPreviewImage},
                         googleBookId: {googleBookId}})`)
        .merge(`(question)-[:ANSWER]->(book)`)
        .merge(`(book)<-[:IS_CREATOR]-(user)`)
        .end({
            answerId: answerId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, authors: data.authors, questionId: data.questionId,
            hasPreviewImage: data.hasPreviewImage, googleBookId: data.googleBookId
        }).getCommand());
};

let createYoutubeAnswer = function (answerId, data) {
    data.title = data.title || `youtube${answerId}Title`;
    data.description = data.description || `youtube${answerId}Description`;
    data.creatorId = data.creatorId || '1';
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(youtube:Youtube:Answer  {title: {title}, description: {description}, created: {created},
                 answerId: {answerId}, idOnYoutube: {idOnYoutube}, link: {link}, linkEmbed: {linkEmbed}})`)
        .merge(`(question)-[:ANSWER]->(youtube)`)
        .merge(`(youtube)<-[:IS_CREATOR]-(user)`)
        .end({
            answerId: answerId, idOnYoutube: data.idOnYoutube, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, linkEmbed: data.linkEmbed, questionId: data.questionId
        }).getCommand());
};

let createVimeoAnswer = function (answerId, data) {
    data.title = data.title || `vimeo${answerId}Title`;
    data.description = data.description || `vimeo${answerId}Description`;
    data.creatorId = data.creatorId || '1';
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(vimeo:Vimeo:Answer  {title: {title}, description: {description}, created: {created},
                 answerId: {answerId}, link: {link}, linkEmbed: {linkEmbed}})`)
        .merge(`(question)-[:ANSWER]->(vimeo)`)
        .merge(`(vimeo)<-[:IS_CREATOR]-(user)`)
        .end({
            answerId: answerId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, linkEmbed: data.linkEmbed, questionId: data.questionId
        }).getCommand());
};

let createLinkAnswer = function (answerId, data) {
    data.title = data.title || `link${answerId}Title`;
    data.description = data.description || `link${answerId}Description`;
    data.creatorId = data.creatorId || '1';
    data.hasPreviewImage = data.hasPreviewImage || false;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(link:Link:Answer  {title: {title}, description: {description}, created: {created},
                  answerId: {answerId}, link: {link}, hasPreviewImage: {hasPreviewImage}, pageType: {pageType}})`)
        .merge(`(question)-[:ANSWER]->(link)`)
        .merge(`(link)<-[:IS_CREATOR]-(user)`)
        .end({
            answerId: answerId, title: data.title, description: data.description, creatorId: data.creatorId,
            created: data.created, link: data.link, hasPreviewImage: data.hasPreviewImage, pageType: data.pageType,
            questionId: data.questionId
        }).getCommand());
};

let createTextAnswer = function (answerId, data) {
    data.created = data.created || 500;
    data.modified = data.modified || data.created;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}})`)
        .create(`(answer:Text:Answer {answerId: {answerId}, answer: {answer},
                  created: {created}, modified: {modified}})`)
        .merge(`(question)-[:ANSWER]->(answer)<-[:IS_CREATOR]-(user)`)
        .end({
            answer: data.answer, created: data.created, questionId: data.questionId,
            modified: data.modified, answerId: answerId, creatorId: data.creatorId
        }).getCommand());
};

let upVoteAnswer = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})')
        .merge(`(user)-[:UP_VOTE]->(answer)`)
        .end({userId: data.userId, answerId: data.answerId}).getCommand());
};


let setOriginalAnswer = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher().match(`(answer:Answer {answerId: {answerId}}),
                 (original:Answer {answerId: {originalAnswerId}})`)
        .merge(`(answer)-[:ORIGINAL]->(original)`)
        .end({
            answerId: data.answerId, originalAnswerId: data.originalAnswerId
        }).getCommand());
};

module.exports = {
    createBookAnswer,
    createYoutubeAnswer,
    createVimeoAnswer,
    createLinkAnswer,
    createTextAnswer,
    upVoteAnswer,
    setOriginalAnswer
};