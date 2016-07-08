'use strict';

var db = require('../db');
var dbConnectionHandling = require('./dbConnectionHandling');

var createBlog = function (blogId, language, topic, modified, visible, pictureHeight) {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Blog:PinwallElement {text: {text}, title: {title}, modified: {modified}, blogId: {blogId}, 
                                           pictureHeight: {pictureHeight}, topic: {topic}, language: {language}, visible: {visible}})`)
        .end({
            title: `blogTitle${blogId}`, text: `blogText${blogId}`, topic: topic, modified: modified, blogId: blogId,
            language: language, visible: visible, pictureHeight: pictureHeight
        }).getCommand());
};

module.exports = {
    createBlog: createBlog
};