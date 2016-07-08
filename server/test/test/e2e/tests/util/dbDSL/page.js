'use strict';

var db = require('../db');
var Url = require('url-parse');
var dbConnectionHandling = require('./dbConnectionHandling');

var createBookPage = function (pageId, language, topic, modified, author, publishDate) {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page:PinwallElement  {title: {title}, label: 'Book', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, author: {author}, publishDate: {publishDate}})`)
        .end({
            pageId: pageId, title: `page${pageId}Title`, description: `page${pageId}Description`,
            language: language, topic: topic, modified: modified, author: author, publishDate: publishDate
        }).getCommand());
};

var createYoutubePage = function (pageId, language, topic, modified, link) {
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page:PinwallElement  {title: {title}, label: 'Youtube', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, link: {link}})`)
        .end({
            pageId: pageId, title: `page${pageId}Title`, description: `page${pageId}Description`,
            language: language, topic: topic, modified: modified, link: link
        }).getCommand());
};

var createLinkPage = function (pageId, language, topic, modified, link) {
    var hostname = new Url(link).host;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page:PinwallElement  {title: {title}, label: 'Link', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, link: {link}, hostname: {hostname}})`)
        .end({
            pageId: pageId, title: `page${pageId}Title`, description: `page${pageId}Description`, hostname: hostname,
            language: language, topic: topic, modified: modified, link: link
        }).getCommand());
};

module.exports = {
    createBookPage: createBookPage,
    createYoutubePage: createYoutubePage,
    createLinkPage: createLinkPage
};