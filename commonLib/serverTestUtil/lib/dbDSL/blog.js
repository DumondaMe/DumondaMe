'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createBlog = function (pageId, data) {
    data.title = data.title || `blog${pageId}Title`;
    data.text = data.text || `blog${pageId}Text`;
    data.visible = data.visible || null;
    data.modified = data.modified || null;
    data.pictureHeight = data.pictureHeight || null;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {writerUserId}})')
        .create(`(:Blog:Page:PinwallElement {text: {text}, title: {title}, created: {created}, modified: {modified}, pageId: {pageId}, label: 'Blog',
                                           heightPreviewImage: {pictureHeight}, topic: {topic}, language: {language}, visible: {visible}})
                                           <-[:WRITTEN]-(user)`)
        .end({
            title: data.title, text: data.text, topic: data.topic, created: data.created, modified: data.modified, pageId: pageId,
            language: data.language, visible: data.visible, pictureHeight: data.pictureHeight, writerUserId: data.blogWriterUserId
        }).getCommand());
};

module.exports = {
    createBlog: createBlog
};