'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createBlog = function (pageId, writerUserId, language, topic, created, visible, pictureHeight, title, modified = null) {
    title = title || `blog${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {writerUserId}})')
        .create(`(:Blog:Page:PinwallElement {text: {text}, title: {title}, created: {created}, modified: {modified}, pageId: {pageId}, label: 'Blog',
                                           heightPreviewImage: {pictureHeight}, topic: {topic}, language: {language}, visible: {visible}})
                                           <-[:WRITTEN]-(user)`)
        .end({
            title: title, text: `blog${pageId}Text`, topic: topic, created: created, modified: modified, pageId: pageId,
            language: language, visible: visible, pictureHeight: pictureHeight, writerUserId: writerUserId
        }).getCommand());
};

module.exports = {
    createBlog: createBlog
};