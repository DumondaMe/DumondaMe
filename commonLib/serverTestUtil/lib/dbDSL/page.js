'use strict';

let db = require('../db');
let Url = require('url-parse');
let dbConnectionHandling = require('./dbConnectionHandling');

let createBookPage = function (pageId, language, topic, modified, author, publishDate, title) {
    title = title || `page${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page  {title: {title}, label: 'Book', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, author: {author}, publishDate: {publishDate}, topic: {topic}})`)
        .end({
            pageId: pageId, title: title, description: `page${pageId}Description`,
            language: language, topic: topic, modified: modified, author: author, publishDate: publishDate
        }).getCommand());
};

let createYoutubePage = function (pageId, language, topic, modified, link, linkEmbed, title) {
    title = title || `page${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page  {title: {title}, label: 'Youtube', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, link: {link}, linkEmbed: {linkEmbed}, topic: {topic}})`)
        .end({
            pageId: pageId, title: title, description: `page${pageId}Description`,
            language: language, topic: topic, modified: modified, link: link, linkEmbed: linkEmbed
        }).getCommand());
};

let createLinkPage = function (pageId, language, topic, modified, link, heightPreviewImage, title) {
    let hostname = new Url(link).host;
    heightPreviewImage = typeof heightPreviewImage !== 'undefined' ? heightPreviewImage : null;
    title = title || `page${pageId}Title`;
    dbConnectionHandling.getCommands().push(db.cypher().create(`(:Page  {title: {title}, label: 'Link', language: {language}, description: {description}, 
                                            modified: {modified}, pageId: {pageId}, link: {link}, hostname: {hostname}, heightPreviewImage: {heightPreviewImage}, topic: {topic}, 
                                            linkHistory: [], linkHistoryDate: []})`)
        .end({
            pageId: pageId, title: title, description: `page${pageId}Description`, hostname: hostname,
            language: language, topic: topic, modified: modified, link: link, heightPreviewImage: heightPreviewImage
        }).getCommand());
};

let createGenericPage = function (pageId, adminId, language, topic, modified, title = `generic${pageId}Title`, coordinates = null) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(user:User {userId: {adminId}})")
        .create(`(user)-[:IS_ADMIN]->(page:Page  {title: {title}, label: 'Generic', language: {language}, description: {description}, modified: {modified}, created: {modified}, topic: {topic},
        pageId: {pageId}}) foreach (address in {coordinates} | CREATE (page)-[:HAS]->(:Address {description: address.description, latitude: toFloat(address.lat), 
        longitude: toFloat(address.lng), addressId: address.addressId}))`)
        .end({
            pageId: pageId, adminId: adminId, title: title, description: `page${pageId}Description`, language: language, topic: topic,
            modified: modified, coordinates: coordinates
        }).getCommand());
};

let addAdminToPage = function (adminId, pageId) {
    dbConnectionHandling.getCommands().push(db.cypher().match("(a:Page {pageId: {pageId}}), (b:User {userId: {adminId}})")
        .create("(b)-[:IS_ADMIN]->(a)")
        .end({pageId: pageId, adminId: adminId}).getCommand());
};

module.exports = {
    createBookPage: createBookPage,
    createYoutubePage: createYoutubePage,
    createLinkPage: createLinkPage,
    createGenericPage: createGenericPage,
    addAdminToPage: addAdminToPage
};