'use strict';

let db = require('../db');
let dbConnectionHandling = require('./dbConnectionHandling');

let createNews = function (newsId, data) {
    data.title = data.title || `news${newsId}Title`;
    data.text = data.text || `news${newsId}Text`;
    data.modified = data.modified || null;
    data.isSent = data.isSent || null;
    dbConnectionHandling.getCommands().push(db.cypher()
        .create(`(:News {newsId: {newsId}, title: {title}, text: {text}, created: {created}, 
        modified: {modified}, isSent: {isSent}})`)
        .end({
            title: data.title, text: data.text, newsId: newsId, created: data.created,
            modified: data.modified, isSent: data.isSent
        }).getCommand());
};

module.exports = {
    createNews: createNews
};