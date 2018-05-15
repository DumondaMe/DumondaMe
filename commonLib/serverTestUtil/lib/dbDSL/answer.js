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

let createCommitmentAnswer = function (answerId, data) {
    data.created = data.created || 500;
    data.modified = data.modified || null;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}),
                 (question:Question {questionId: {questionId}}), (commitment:Commitment {commitmentId: {commitmentId}})`)
        .create(`(answer:CommitmentAnswer:Answer {answerId: {answerId}, description: {description},
                  created: {created}, modified: {modified}})`)
        .merge(`(question)-[:ANSWER]->(answer)<-[:IS_CREATOR]-(user)`)
        .merge(`(answer)-[:COMMITMENT]->(commitment)`)
        .end({
            description: data.description, created: data.created, questionId: data.questionId,
            commitmentId: data.commitmentId, modified: data.modified, answerId: answerId, creatorId: data.creatorId
        }).getCommand());
};

let createNote = function (noteId, data) {
    data.text = data.text || `note${noteId}Text`;
    dbConnectionHandling.getCommands().push(db.cypher().match(`(user:User {userId: {creatorId}}), (answer:Answer {answerId: {answerId}})`)
        .create(`(note:Note {noteId: {noteId}, text: {text}, created: {created}})`)
        .merge(`(answer)-[:NOTE]->(note)<-[:IS_CREATOR]-(user)`)
        .end({
            noteId, created: data.created, answerId: data.answerId, text: data.text, creatorId: data.creatorId,
        }).getCommand());
};

let upVoteNote = function (data) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (note:Note {noteId: {noteId}})')
        .merge(`(user)-[:UP_VOTE]->(note)`)
        .end({userId: data.userId, noteId: data.noteId}).getCommand());
};

let upVoteAnswer = function (data) {
    data.created = data.created || 555;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {userId}}), (answer:Answer {answerId: {answerId}})')
        .merge(`(user)-[:UP_VOTE {created: {created}}]->(answer)`)
        .end({userId: data.userId, answerId: data.answerId, created: data.created}).getCommand());
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
    createCommitmentAnswer,
    upVoteAnswer,
    setOriginalAnswer,
    createNote,
    upVoteNote
};