'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createBlog = function (pageId, writerUserId, language, topic, created, visible, pictureHeight, title) {
    title = title || `blog${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {writerUserId}})')
        .create(`(:Blog:Page:PinwallElement {text: {text}, title: {title}, created: {created}, pageId: {pageId}, label: 'Blog',
                                           heightPreviewImage: {pictureHeight}, topic: {topic}, language: {language}, visible: {visible}})
                                           <-[:WRITTEN]-(user)`)
        .end({
            title: title, text: `blog${pageId}Text`, topic: topic, created: created, pageId: pageId,
            language: language, visible: visible, pictureHeight: pictureHeight, writerUserId: writerUserId
        }).getCommand());
};

module.exports = {
    createBlog: createBlog
};