'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createBlog = function (blogId, writerUserId, language, topic, modified, visible, pictureHeight) {
    dbConnectionHandling.getCommands().push(db.cypher().match('(user:User {userId: {writerUserId}})')
        .create(`(:Blog:PinwallElement {text: {text}, title: {title}, modified: {modified}, blogId: {blogId}, 
                                           pictureHeight: {pictureHeight}, topic: {topic}, language: {language}, visible: {visible}})
                                           <-[:WRITTEN]-(user)`)
        .end({
            title: `blog${blogId}Title`, text: `blog${blogId}Text`, topic: topic, modified: modified, blogId: blogId,
            language: language, visible: visible, pictureHeight: pictureHeight, writerUserId: writerUserId
        }).getCommand());
};

module.exports = {
    createBlog: createBlog
};