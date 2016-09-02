'use strict';

var db = require('../db');
var Url = require('url-parse');
var dbConnectionHandling = require('./dbConnectionHandling');

var createBookPage = function (pageId, language, topic, modified, author, publishDate, title) {
    title = title || `page${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page:PinwallElement  {title: {title}, label: 'Book', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, author: {author}, publishDate: {publishDate}, topic: {topic}})`)
        .end({
            pageId: pageId, title: title, description: `page${pageId}Description`,
            language: language, topic: topic, modified: modified, author: author, publishDate: publishDate
        }).getCommand());
};

var createYoutubePage = function (pageId, language, topic, modified, link, linkEmbed, title) {
    title = title || `page${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page:PinwallElement  {title: {title}, label: 'Youtube', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, link: {link}, linkEmbed: {linkEmbed}, topic: {topic}})`)
        .end({
            pageId: pageId, title: title, description: `page${pageId}Description`,
            language: language, topic: topic, modified: modified, link: link, linkEmbed: linkEmbed
        }).getCommand());
};

var createLinkPage = function (pageId, language, topic, modified, link, heightPreviewImage, title) {
    var hostname = new Url(link).host;
    heightPreviewImage = typeof heightPreviewImage !== 'undefined' ?  heightPreviewImage : null;
    title = title || `page${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page:PinwallElement  {title: {title}, label: 'Link', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, link: {link}, hostname: {hostname}, heightPreviewImage: {heightPreviewImage}, topic: {topic}, 
                                            linkHistory: [], linkHistoryDate: []})`)
        .end({
            pageId: pageId, title: title, description: `page${pageId}Description`, hostname: hostname,
            language: language, topic: topic, modified: modified, link: link, heightPreviewImage: heightPreviewImage
        }).getCommand());
};

module.exports = {
    createBookPage: createBookPage,
    createYoutubePage: createYoutubePage,
    createLinkPage: createLinkPage
};